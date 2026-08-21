import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { Role } from "@prisma/client";
import { requireRole } from "@/lib/auth";
import { processCheckInToken } from "@/lib/eventsStore";

const checkInSchema = z.object({
  qrToken: z.string().min(5, "QR token is required"),
  deviceId: z.string().optional(),
  offlineCapturedAt: z.string().optional(),
  idempotencyKey: z.string().optional(),
});

export async function POST(req: NextRequest) {
  const authResult = requireRole(req, [Role.ORGANIZER]);
  if ("errorResponse" in authResult) {
    return authResult.errorResponse;
  }

  try {
    const body = await req.json();
    const parseResult = checkInSchema.safeParse(body);

    if (!parseResult.success) {
      return NextResponse.json(
        { error: "VALIDATION_ERROR", details: parseResult.error.format() },
        { status: 400 }
      );
    }

    const { qrToken } = parseResult.data;
    const { checkIn } = processCheckInToken(qrToken);

    return NextResponse.json(
      {
        message: "Check-in successful",
        checkIn,
      },
      { status: 201 }
    );
  } catch (error: any) {
    if (error?.message === "INVALID_TOKEN") {
      return NextResponse.json(
        { error: "INVALID_TOKEN", message: "Scanned QR token does not correspond to any valid event registration" },
        { status: 404 }
      );
    }

    if (error?.message === "DUPLICATE_SCAN") {
      return NextResponse.json(
        {
          error: "ALREADY_CHECKED_IN",
          message: `Attendee was already checked in at ${error.originalCheckInTime}`,
          originalCheckInTime: error.originalCheckInTime,
        },
        { status: 409 }
      );
    }

    console.error("Check-in error:", error);
    return NextResponse.json(
      { error: "INTERNAL_ERROR", message: "Failed to process check-in" },
      { status: 500 }
    );
  }
}
