import { NextRequest, NextResponse } from "next/server";
import { Role } from "@prisma/client";
import { requireRole } from "@/lib/auth";
import { getDashboardMetrics } from "@/lib/eventsStore";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authResult = requireRole(req, [Role.ORGANIZER]);
  if ("errorResponse" in authResult) {
    return authResult.errorResponse;
  }

  try {
    const { id: eventId } = await params;
    const metrics = getDashboardMetrics(eventId);

    if (!metrics) {
      return NextResponse.json(
        { error: "NOT_FOUND", message: "Event not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ metrics }, { status: 200 });
  } catch (error) {
    console.error("Dashboard metrics error:", error);
    return NextResponse.json(
      { error: "INTERNAL_ERROR", message: "Failed to load dashboard metrics" },
      { status: 500 }
    );
  }
}
