import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { Role } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { verifyPassword, createSessionToken, attachSessionCookie } from "@/lib/auth";

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

// Seeded mock users for offline demo fallback when local PostgreSQL is not connected
const MOCK_USERS = [
  {
    id: "org-demo-1",
    email: "organizer@orbitcheck.com",
    name: "Campus Organizer Admin",
    role: Role.ORGANIZER,
  },
  {
    id: "att-demo-1",
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

    let user;
    try {
      user = await prisma.user.findUnique({
        where: { email },
      });
    } catch (dbErr: any) {
      if (dbErr?.code === "ECONNREFUSED" || dbErr?.message?.includes("ECONNREFUSED")) {
        // Offline demo fallback mode
        const mockUser = MOCK_USERS.find((u) => u.email === email);
        if (mockUser) {
          const token = createSessionToken(mockUser);
          const response = NextResponse.json(
            { message: "Demo login successful (Offline Mode)", user: mockUser },
            { status: 200 }
          );
          return attachSessionCookie(response, token);
        }
        return NextResponse.json(
          { error: "INVALID_CREDENTIALS", message: "Invalid email or password" },
          { status: 401 }
        );
      }
      throw dbErr;
    }

    if (!user) {
      // Fallback check for demo accounts if DB is empty
      const mockUser = MOCK_USERS.find((u) => u.email === email);
      if (mockUser) {
        const token = createSessionToken(mockUser);
        const response = NextResponse.json(
          { message: "Demo login successful", user: mockUser },
          { status: 200 }
        );
        return attachSessionCookie(response, token);
      }

      return NextResponse.json(
        { error: "INVALID_CREDENTIALS", message: "Invalid email or password" },
        { status: 401 }
      );
    }

    const isPasswordValid = await verifyPassword(password, user.passwordHash);
    if (!isPasswordValid) {
      return NextResponse.json(
        { error: "INVALID_CREDENTIALS", message: "Invalid email or password" },
        { status: 401 }
      );
    }

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
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { error: "INTERNAL_ERROR", message: "Internal server error during login" },
      { status: 500 }
    );
  }
}
