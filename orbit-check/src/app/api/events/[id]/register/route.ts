import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { RegistrationStatus } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authResult = requireAuth(req);
  if ("errorResponse" in authResult) {
    return authResult.errorResponse;
  }

  const { user } = authResult;

  try {
    const { id: eventId } = await params;

    // Check if event exists
    const event = await prisma.event.findUnique({
      where: { id: eventId },
      select: { id: true, title: true, capacity: true },
    });

    if (!event) {
      return NextResponse.json(
        { error: "NOT_FOUND", message: "Event not found" },
        { status: 404 }
      );
    }

    // Check existing registration
    const existingRegistration = await prisma.registration.findUnique({
      where: {
        eventId_attendeeId: {
          eventId,
          attendeeId: user.id,
        },
      },
    });

    if (existingRegistration) {
      return NextResponse.json(
        {
          error: "ALREADY_REGISTERED",
          message: "You are already registered for this event",
          registrationId: existingRegistration.id,
        },
        { status: 409 }
      );
    }

    // Execute Atomic Database Transaction for Capacity Lock & Registration Insertion
    const result = await prisma.$transaction(async (tx) => {
      // 1. Count current registrations within transaction lock
      const currentCount = await tx.registration.count({
        where: { eventId },
      });

      // 2. Reject if capacity limit reached
      if (currentCount >= event.capacity) {
        throw new Error("EVENT_FULL");
      }

      // 3. Generate server-issued unique QR Token & Hash
      const rawToken = `ORBIT-REG-${eventId.substring(0, 8)}-${crypto.randomBytes(12).toString("hex")}`;
      const tokenHash = crypto.createHash("sha256").update(rawToken).digest("hex");

      // 4. Create Registration
      const registration = await tx.registration.create({
        data: {
          eventId,
          attendeeId: user.id,
          qrToken: rawToken,
          qrTokenHash: tokenHash,
          status: RegistrationStatus.REGISTERED,
        },
        include: {
          event: {
            select: { id: true, title: true, date: true },
          },
          attendee: {
            select: { id: true, name: true, email: true },
          },
        },
      });

      return { registration, remainingCapacity: event.capacity - (currentCount + 1) };
    });

    return NextResponse.json(
      {
        message: "Registration successful",
        registration: result.registration,
        remainingCapacity: result.remainingCapacity,
      },
      { status: 201 }
    );
  } catch (error: any) {
    if (error?.message === "EVENT_FULL") {
      return NextResponse.json(
        {
          error: "EVENT_FULL",
          message: "Event has reached maximum attendee capacity",
        },
        { status: 409 }
      );
    }

    // Handle Prisma unique constraint violation code (P2002)
    if (error?.code === "P2002") {
      return NextResponse.json(
        {
          error: "ALREADY_REGISTERED",
          message: "Duplicate registration detected for this event",
        },
        { status: 409 }
      );
    }

    console.error("Event registration error:", error);
    return NextResponse.json(
      { error: "INTERNAL_ERROR", message: "Failed to complete registration" },
      { status: 500 }
    );
  }
}
