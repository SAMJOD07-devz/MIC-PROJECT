import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { Role } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { createSessionToken, attachSessionCookie } from "@/lib/auth";

const googleAuthSchema = z.object({
  email: z.string().email("Invalid email address"),
  name: z.string().min(1, "Name is required"),
  googleId: z.string().optional(),
  role: z.enum(["ORGANIZER", "ATTENDEE"]).optional().default("ATTENDEE"),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parseResult = googleAuthSchema.safeParse(body);

    if (!parseResult.success) {
      return NextResponse.json(
        { error: "VALIDATION_ERROR", details: parseResult.error.format() },
        { status: 400 }
      );
    }

    const { email, name, role } = parseResult.data;

    let user;
    try {
      // Find existing user by email or create new Google user
      user = await prisma.user.findUnique({
        where: { email },
      });

      if (!user) {
        user = await prisma.user.create({
          data: {
            email,
            name,
            role: role || Role.ATTENDEE,
            passwordHash: "$google_oauth_authenticated_user$", // Oauth user placeholder
          },
        });
      }
    } catch (dbErr: any) {
      // Database unavailable offline fallback mode
      if (dbErr?.code === "ECONNREFUSED" || dbErr?.message?.includes("ECONNREFUSED")) {
        const mockGoogleUser = {
          id: `google-${Date.now()}`,
          email,
          name,
          role: role || Role.ATTENDEE,
        };

        const token = createSessionToken(mockGoogleUser);
        const response = NextResponse.json(
          { message: "Google authentication successful (Offline Demo Mode)", user: mockGoogleUser },
          { status: 200 }
        );
        return attachSessionCookie(response, token);
      }
      throw dbErr;
    }

    const sessionUser = {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    };

    const token = createSessionToken(sessionUser);
    const response = NextResponse.json(
      { message: "Google authentication successful", user: sessionUser },
      { status: 200 }
    );

    return attachSessionCookie(response, token);
  } catch (error) {
    console.error("Google authentication error:", error);
    return NextResponse.json(
      { error: "INTERNAL_ERROR", message: "Internal server error during Google login" },
      { status: 500 }
    );
  }
}
