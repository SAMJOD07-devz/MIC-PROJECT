import { NextRequest, NextResponse } from "next/server";
import { Role } from "@prisma/client";
import { requireRole } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const authResult = requireRole(req, [Role.ORGANIZER]);
  if ("errorResponse" in authResult) {
    return authResult.errorResponse;
  }

  return NextResponse.json({
    message: "Welcome Organizer! Access granted to protected console data.",
    user: authResult.user,
  });
}
