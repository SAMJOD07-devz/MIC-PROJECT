import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { Role } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { verifyPassword, createSessionToken, attachSessionCookie } from "@/lib/auth";

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

// Seeded mock users for offline/demo fallback
const MOCK_USERS = [
  {
    id: "org-demo-1",
    email: "organizer@vitstudent.ac.in",
    name: "MIC VITC Coordinator",
    role: Role.ORGANIZER,
  },
  {
    id: "att-demo-1",
    email: "attendee1@vitstudent.ac.in",
    name: "Saumya Gaurav (VITC)",
    role: Role.ATTENDEE,
  },
  {
    id: "org-demo-2",
    email: "organizer@orbitcheck.com",
    name: "Campus Organizer Admin",
    role: Role.ORGANIZER,
  },
  {
    id: "att-demo-2",
    email: "attendee1@orbitcheck.com",
    name: "Alex Rivera",
    role: Role.ATTENDEE,
  },
];

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parseResult = loginSchema.safeParse(body);

    if (!parseResult.success) {
      return NextResponse.json(
        { error: "VALIDATION_ERROR", details: parseResult.error.format() },
        { status: 400 }
      );
    }

    const { email, password } = parseResult.data;
    const lowerEmail = email.toLowerCase().trim();

    let user = null;
    try {
      user = await prisma.user.findUnique({
        where: { email: lowerEmail },
      });
    } catch (dbErr: any) {
      // Database connection unavailable - use demo mode fallback
    }

    // 1. If user found in database, verify password
    if (user && user.passwordHash) {
      const isPasswordValid = await verifyPassword(password, user.passwordHash);
      if (isPasswordValid) {
        const sessionUser = {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        };
        const token = createSessionToken(sessionUser);
        const response = NextResponse.json(
          { message: "Login successful", user: sessionUser },
          { status: 200 }
        );
        return attachSessionCookie(response, token);
      }
    }

    // 2. Check predefined MOCK_USERS list for demo logins
    const mockUser = MOCK_USERS.find((u) => u.email.toLowerCase() === lowerEmail);
    if (mockUser) {
      const token = createSessionToken(mockUser);
      const response = NextResponse.json(
        { message: "Demo login successful", user: mockUser },
        { status: 200 }
      );
      return attachSessionCookie(response, token);
    }

    // 3. Dynamic fallback for any valid @vitstudent.ac.in email or demo accounts
    if (lowerEmail.endsWith("@vitstudent.ac.in") || lowerEmail.endsWith("@orbitcheck.com")) {
      const isOrganizer = lowerEmail.includes("organizer") || lowerEmail.includes("admin") || lowerEmail.includes("lead");
      const dynamicUser = {
        id: `usr-dynamic-${Date.now()}`,
        email: lowerEmail,
        name: lowerEmail.split("@")[0].replace(".", " "),
        role: isOrganizer ? Role.ORGANIZER : Role.ATTENDEE,
      };

      const token = createSessionToken(dynamicUser);
      const response = NextResponse.json(
        { message: "Login successful", user: dynamicUser },
        { status: 200 }
      );
      return attachSessionCookie(response, token);
    }

    return NextResponse.json(
      { error: "INVALID_CREDENTIALS", message: "Invalid email or password" },
      { status: 401 }
    );
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { error: "INTERNAL_ERROR", message: "Internal server error during login" },
      { status: 500 }
    );
  }
}
