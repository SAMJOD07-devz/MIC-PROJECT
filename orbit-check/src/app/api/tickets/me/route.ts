import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";
import { renderQrCodeDataUrl } from "@/lib/qr";

export async function GET(req: NextRequest) {
  const authResult = requireAuth(req);
  if ("errorResponse" in authResult) {
    return authResult.errorResponse;
  }

  const { user } = authResult;

  try {
    const registrations = await prisma.registration.findMany({
      where: { attendeeId: user.id },
      include: {
        event: {
          select: {
            id: true,
            title: true,
            description: true,
            date: true,
            capacity: true,
          },
        },
        checkIn: {
          select: {
            id: true,
            checkInTime: true,
          },
        },
      },
      orderBy: { registeredAt: "desc" },
    });

    const tickets = await Promise.all(
      registrations.map(async (reg) => {
        const qrDataUrl = await renderQrCodeDataUrl(reg.qrToken);
        return {
          registrationId: reg.id,
          eventId: reg.eventId,
          eventTitle: reg.event.title,
          eventDescription: reg.event.description,
          eventDate: reg.event.date,
          status: reg.status,
          registeredAt: reg.registeredAt,
          qrToken: reg.qrToken,
          qrCodeDataUrl: qrDataUrl,
          checkInTime: reg.checkIn?.checkInTime || null,
          isCheckedIn: reg.status === "CHECKED_IN",
        };
      })
    );

    return NextResponse.json({ tickets }, { status: 200 });
  } catch (error) {
    console.error("Fetch tickets error:", error);
    return NextResponse.json(
      { error: "INTERNAL_ERROR", message: "Failed to fetch attendee tickets" },
      { status: 500 }
    );
  }
}
