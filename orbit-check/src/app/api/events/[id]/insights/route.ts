import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { Role } from "@prisma/client";
import { requireRole } from "@/lib/auth";
import { getDashboardMetrics } from "@/lib/eventsStore";

const insightQuerySchema = z.object({
  prompt: z.string().optional(),
  query: z.string().optional(),
});

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authResult = requireRole(req, [Role.ORGANIZER]);
  if ("errorResponse" in authResult) {
    return authResult.errorResponse;
  }

  try {
    const { id: eventId } = await params;
    const body = await req.json().catch(() => ({}));
    const parseResult = insightQuerySchema.safeParse(body);
    const userPrompt = parseResult.success && (parseResult.data.query || parseResult.data.prompt)
      ? (parseResult.data.query || parseResult.data.prompt!)
      : "Analyze check-in velocity and suggest operational improvements";

    const metrics = getDashboardMetrics(eventId);
    if (!metrics) {
      return NextResponse.json(
        { error: "NOT_FOUND", message: "Event not found" },
        { status: 404 }
      );
    }

    const summary = `Event Intelligence Report for "${metrics.eventTitle}": Currently ${metrics.checkedInCount} of ${metrics.registeredCount} registered attendees have checked in (${metrics.checkInPercentage}% check-in rate). ${metrics.noShowCount} attendees have not checked in yet. Total capacity is ${metrics.capacity}.`;

    const recommendations: string[] = [];
    if (metrics.checkInPercentage < 50) {
      recommendations.push("Check-in rate is under 50%. Send a broadcast reminder to registered attendees.");
    } else {
      recommendations.push("Check-in velocity is strong. Keep scanner gates open for late arrivals.");
    }
    if (metrics.noShowCount > 0) {
      recommendations.push(`Follow up with the ${metrics.noShowCount} attendees who have not checked in yet.`);
    }
    if (metrics.remainingCapacity === 0) {
      recommendations.push("Event room has reached maximum capacity. Enable gate waitlist.");
    }

    const insightsObj = {
      query: userPrompt,
      isFallback: true,
      metrics,
      summary,
      recommendations,
    };

    return NextResponse.json({
      insights: insightsObj,
      ...insightsObj,
    }, { status: 200 });
  } catch (error) {
    console.error("AI Insights Error:", error);
    return NextResponse.json(
      { error: "INTERNAL_ERROR", message: "Failed to generate AI insights" },
      { status: 500 }
    );
  }
}
