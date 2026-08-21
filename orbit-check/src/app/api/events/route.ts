import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { Role } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { requireAuth, requireRole } from "@/lib/auth";

const createEventSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().min(5, "Description must be at least 5 characters"),
  date: z.string().datetime("Valid ISO date required"),
  capacity: z.number().int().positive("Capacity must be a positive integer"),
});

// GET /api/events — List all upcoming events (Authenticated)
export async function GET(req: NextRequest) {
  const authResult = requireAuth(req);
  if ("errorResponse" in authResult) {
    return authResult.errorResponse;
  }

  try {
    const events = await prisma.event.findMany({
      orderBy: { date: "asc" },
      include: {
        organizer: {
          select: { id: true, name: true, email: true },
        },
        _count: {
          select: { registrations: true, checkIns: true },
        },
      },
    });

    const formattedEvents = events.map((event) => {
      const registeredCount = event._count.registrations;
      const remainingCapacity = Math.max(0, event.capacity - registeredCount);
      return {
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
      };
    });

    return NextResponse.json({ events: formattedEvents }, { status: 200 });
  } catch (error) {
    console.error("Fetch events error:", error);
    return NextResponse.json(
      { error: "INTERNAL_ERROR", message: "Failed to fetch events" },
      { status: 500 }
    );
  }
}

// POST /api/events — Create new event (Organizer only)
export async function POST(req: NextRequest) {
  const authResult = requireRole(req, [Role.ORGANIZER]);
  if ("errorResponse" in authResult) {
    return authResult.errorResponse;
  }

  const { user } = authResult;

  try {
    const body = await req.json();
    const parseResult = createEventSchema.safeParse(body);

    if (!parseResult.success) {
      return NextResponse.json(
        { error: "VALIDATION_ERROR", details: parseResult.error.format() },
        { status: 400 }
      );
    }

    const { title, description, date, capacity } = parseResult.data;

    const newEvent = await prisma.event.create({
      data: {
        title,
        description,
        date: new Date(date),
        capacity,
        organizerId: user.id,
      },
    });

    return NextResponse.json(
      {
        message: "Event created successfully",
        event: {
          ...newEvent,
          registeredCount: 0,
          remainingCapacity: newEvent.capacity,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Create event error:", error);
    return NextResponse.json(
      { error: "INTERNAL_ERROR", message: "Failed to create event" },
      { status: 500 }
    );
  }
}
