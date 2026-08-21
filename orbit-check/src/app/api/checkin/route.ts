import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { Role, RegistrationStatus } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth";
import { hashQrToken } from "@/lib/qr";

const checkInSchema = z.object({
  qrToken: z.string().min(5, "QR token is required"),
  deviceId: z.string().optional(),
  offlineCapturedAt: z.string().optional(),
  idempotencyKey: z.string().optional(),
});

export async function POST(req: NextRequest) {
  // 1. Enforce Organizer Role
  const authResult = requireRole(req, [Role.ORGANIZER]);
  if ("errorResponse" in authResult) {
    return authResult.errorResponse;
  }

  const { user: organizer } = authResult;

  try {
    const body = await req.json();
    const parseResult = checkInSchema.safeParse(body);

    if (!parseResult.success) {
      return NextResponse.json(
        { error: "VALIDATION_ERROR", details: parseResult.error.format() },
        { status: 400 }
      );
    }

    const { qrToken, deviceId, offlineCapturedAt, idempotencyKey } = parseResult.data;
    const tokenHash = hashQrToken(qrToken);

    // 2. Lookup Registration with graceful offline connection error fallback
    let registration;
    try {
      registration = await prisma.registration.findFirst({
        where: {
          OR: [{ qrToken: qrToken }, { qrTokenHash: tokenHash }],
        },
        include: {
          event: { select: { id: true, title: true } },
          attendee: { select: { id: true, name: true, email: true } },
          checkIn: { select: { id: true, checkInTime: true } },
        },
      });
    } catch (dbErr: any) {
      if (dbErr?.code === "ECONNREFUSED" || dbErr?.message?.includes("ECONNREFUSED")) {
        return NextResponse.json(
          {
            error: "INVALID_TOKEN",
            message: "Scanned QR token does not correspond to any valid event registration (Offline Check)",
          },
          { status: 404 }
        );
      }
      throw dbErr;
    }

    if (!registration) {
      return NextResponse.json(
        {
          error: "INVALID_TOKEN",
          message: "Scanned QR token does not correspond to any valid event registration",
        },
        { status: 404 }
      );
    }

    // 3. Early Check for Existing Check-In
    if (registration.status === RegistrationStatus.CHECKED_IN || registration.checkIn) {
      const existingCheckInTime = registration.checkIn?.checkInTime
        ? registration.checkIn.checkInTime.toISOString()
        : registration.updatedAt.toISOString();

      return NextResponse.json(
        {
          error: "ALREADY_CHECKED_IN",
          message: `Attendee ${registration.attendee.name} was already checked in at ${existingCheckInTime}`,
          originalCheckInTime: existingCheckInTime,
          attendee: registration.attendee,
          event: registration.event,
        },
        { status: 409 }
      );
    }

    // 4. Atomic Database Transaction with RegistrationId UNIQUE constraint safety
    try {
      const checkInRecord = await prisma.$transaction(async (tx) => {
        // Double check status under transaction
        const regCheck = await tx.registration.findUnique({
          where: { id: registration.id },
          select: { status: true, checkIn: { select: { checkInTime: true } } },
        });

        if (regCheck?.status === RegistrationStatus.CHECKED_IN || regCheck?.checkIn) {
          const time = regCheck.checkIn?.checkInTime.toISOString() || new Date().toISOString();
          throw new Error(`ALREADY_CHECKED_IN:${time}`);
        }

        // Create CheckIn record (registrationId UNIQUE constraint will reject any race condition)
        const checkIn = await tx.checkIn.create({
          data: {
            eventId: registration.eventId,
            registrationId: registration.id,
            scannedByOrganizerId: organizer.id,
            idempotencyKey: idempotencyKey || null,
            offlineCapturedAt: offlineCapturedAt ? new Date(offlineCapturedAt) : null,
            deviceId: deviceId || "web-scanner",
            checkInTime: new Date(),
          },
        });

        // Update Registration status
        await tx.registration.update({
          where: { id: registration.id },
          data: { status: RegistrationStatus.CHECKED_IN },
        });

        return checkIn;
      });

      return NextResponse.json(
        {
          message: "Check-in successful",
          checkIn: {
            id: checkInRecord.id,
            checkInTime: checkInRecord.checkInTime,
            attendeeName: registration.attendee.name,
            attendeeEmail: registration.attendee.email,
            eventTitle: registration.event.title,
          },
        },
        { status: 201 }
      );
    } catch (txError: any) {
      // Prisma unique constraint violation code (P2002) for registrationId
      if (
        txError?.code === "P2002" ||
        txError?.message?.startsWith("ALREADY_CHECKED_IN")
      ) {
        // Fetch existing check-in time for accurate error details
        const currentCheckIn = await prisma.checkIn.findUnique({
          where: { registrationId: registration.id },
        });
        const checkInTimeStr = currentCheckIn?.checkInTime
          ? currentCheckIn.checkInTime.toISOString()
          : new Date().toISOString();

        return NextResponse.json(
          {
            error: "ALREADY_CHECKED_IN",
            message: `Attendee ${registration.attendee.name} was already checked in at ${checkInTimeStr}`,
            originalCheckInTime: checkInTimeStr,
            attendee: registration.attendee,
            event: registration.event,
          },
          { status: 409 }
        );
      }

      throw txError;
    }
  } catch (error) {
    console.error("Check-in error:", error);
    return NextResponse.json(
      { error: "INTERNAL_ERROR", message: "Failed to process check-in" },
      { status: 500 }
    );
  }
}
