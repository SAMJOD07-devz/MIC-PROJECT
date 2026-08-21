import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authResult = requireAuth(req);
  if ("errorResponse" in authResult) {
    return authResult.errorResponse;
  }

  try {
    const { id } = await params;
    const event = await prisma.event.findUnique({
      where: { id },
      include: {
        organizer: {
          select: { id: true, name: true, email: true },
        },
        _count: {
          select: { registrations: true, checkIns: true },
        },
      },
    });

    if (!event) {
      return NextResponse.json(
        { error: "NOT_FOUND", message: "Event not found" },
        { status: 404 }
      );
    }

    const registeredCount = event._count.registrations;
    const remainingCapacity = Math.max(0, event.capacity - registeredCount);

    return NextResponse.json(
      {
        event: {
          id: event.id,
          title: event.title,
          description: event.description,
          date: event.date,
          capacity: event.capacity,
          registeredCount,
          checkedInCount: event._count.checkIns,
          remainingCapacity,
          isFull: remainingCapacity === 0,
          organizer: event.organizer,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Get event error:", error);
    return NextResponse.json(
      { error: "INTERNAL_ERROR", message: "Failed to fetch event" },
      { status: 500 }
    );
  }
}
