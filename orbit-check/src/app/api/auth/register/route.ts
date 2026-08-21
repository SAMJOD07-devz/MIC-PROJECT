import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { Role } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { hashPassword, createSessionToken, attachSessionCookie } from "@/lib/auth";

const registerSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  name: z.string().min(2, "Name must be at least 2 characters"),
  phone: z.string().optional(),
  year: z.string().optional(),
  role: z.nativeEnum(Role).optional().default(Role.ATTENDEE),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parseResult = registerSchema.safeParse(body);

    if (!parseResult.success) {
      return NextResponse.json(
        { error: "VALIDATION_ERROR", details: parseResult.error.format() },
        { status: 400 }
      );
    }

    const { email, password, name, phone, year, role } = parseResult.data;

    // Strict VIT Student Email domain validation
    if (!email.toLowerCase().endsWith("@vitstudent.ac.in")) {
      return NextResponse.json(
        {
          error: "INVALID_EMAIL_DOMAIN",
          message: "Only @vitstudent.ac.in email addresses are allowed to register.",
        },
        { status: 400 }
      );
    }

    // Check existing user
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "USER_EXISTS", message: "User with this email already exists" },
        { status: 409 }
      );
    }

    const passwordHash = await hashPassword(password);
    const newUser = await prisma.user.create({
      data: {
        email,
        passwordHash,
        name,
        phone: phone || null,
        year: year || null,
        role,
      },
    });

    const sessionUser = {
      id: newUser.id,
      email: newUser.email,
      name: newUser.name,
      phone: newUser.phone,
      year: newUser.year,
      role: newUser.role,
    };

    const token = createSessionToken(sessionUser);
    const response = NextResponse.json(
      { message: "Registration successful", user: sessionUser },
      { status: 201 }
    );

    return attachSessionCookie(response, token);
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { error: "INTERNAL_ERROR", message: "Internal server error during registration" },
      { status: 500 }
    );
  }
}

