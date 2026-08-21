import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";
import { getEventById } from "@/lib/eventsStore";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authResult = requireAuth(req);
  if ("errorResponse" in authResult) {
    return authResult.errorResponse;
  }

  try {
    const { id: rawId } = await params;
    const eventId = decodeURIComponent(rawId || "").trim();

    const event = getEventById(eventId);

    if (!event) {
      return NextResponse.json(
        { error: "NOT_FOUND", message: "Event not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ event }, { status: 200 });
  } catch (error) {
    console.error("Get event error:", error);
    return NextResponse.json(
      { error: "INTERNAL_ERROR", message: "Failed to fetch event" },
      { status: 500 }
    );
  }
}
