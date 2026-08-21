import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";
import { getTicketsForAttendee } from "@/lib/eventsStore";
import { renderQrCodeDataUrl } from "@/lib/qr";

export async function GET(req: NextRequest) {
  const authResult = requireAuth(req);
  if ("errorResponse" in authResult) {
    return authResult.errorResponse;
  }

  const { user } = authResult;

  try {
    const rawTickets = getTicketsForAttendee(user.email);

    const tickets = await Promise.all(
      rawTickets.map(async (t) => {
        const qrCodeDataUrl = await renderQrCodeDataUrl(t.qrToken);
        return {
          registrationId: t.id,
          eventId: t.eventId,
          eventTitle: t.eventTitle,
          eventDescription: t.eventDescription,
          eventDate: t.eventDate,
          status: t.status,
          registeredAt: t.registeredAt,
          qrToken: t.qrToken,
          qrCodeDataUrl,
          checkInTime: t.checkInTime || null,
          isCheckedIn: t.status === "CHECKED_IN",
        };
      })
    );

    return NextResponse.json({ tickets }, { status: 200 });
  } catch (error) {
    console.error("Fetch tickets error:", error);
    return NextResponse.json({ tickets: [] }, { status: 500 });
  }
}
