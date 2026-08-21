import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";
import { registerAttendeeForEvent } from "@/lib/eventsStore";

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
    const { id: rawId } = await params;
    const eventId = decodeURIComponent(rawId || "").trim();

    if (!eventId) {
      return NextResponse.json(
        { error: "NOT_FOUND", message: "Event ID is required" },
        { status: 400 }
      );
    }

    const { ticket, event } = registerAttendeeForEvent(eventId, user.id, user.email);

    return NextResponse.json(
      {
        message: "Registration successful",
        registration: ticket,
        remainingCapacity: event.remainingCapacity,
      },
      { status: 201 }
    );
  } catch (error: any) {
    if (error?.message === "EVENT_NOT_FOUND") {
      return NextResponse.json(
        { error: "NOT_FOUND", message: "Event not found" },
        { status: 404 }
      );
    }
    if (error?.message === "EVENT_FULL") {
      return NextResponse.json(
        { error: "EVENT_FULL", message: "Event has reached maximum attendee capacity" },
        { status: 409 }
      );
    }
    if (error?.message === "ALREADY_REGISTERED") {
      return NextResponse.json(
        { error: "ALREADY_REGISTERED", message: "You are already registered for this event" },
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
