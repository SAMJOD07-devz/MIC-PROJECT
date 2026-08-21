import { NextRequest, NextResponse } from "next/server";
import { Role } from "@prisma/client";
import { requireRole } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const authResult = requireRole(req, [Role.ATTENDEE]);
  if ("errorResponse" in authResult) {
    return authResult.errorResponse;
  }

  return NextResponse.json({
    message: "Welcome Attendee! Access granted to personal attendee portal.",
    user: authResult.user,
  });
}
