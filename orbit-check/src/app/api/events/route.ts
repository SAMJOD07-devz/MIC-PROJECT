import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { Role } from "@prisma/client";
import { requireAuth, requireRole } from "@/lib/auth";
import { getAllEvents, addEvent } from "@/lib/eventsStore";

const createEventSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().min(5, "Description must be at least 5 characters"),
  date: z.string().datetime("Valid ISO date required"),
  capacity: z.number().int().positive("Capacity must be a positive integer"),
});

// GET /api/events — List all upcoming events (Authenticated & Guest)
export async function GET(req: NextRequest) {
  try {
    const events = getAllEvents();
    return NextResponse.json({ events }, { status: 200 });
  } catch (error) {
    console.error("Fetch events error:", error);
    return NextResponse.json({ events: [] }, { status: 500 });
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

    const newEvent = addEvent({
      title,
      description,
      date: new Date(date).toISOString(),
      capacity,
      organizer: { id: user.id, name: user.name, email: user.email },
    });

    return NextResponse.json(
      {
        message: "Event created successfully",
        event: newEvent,
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
