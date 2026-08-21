import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { Role } from "@prisma/client";
import { env } from "@/lib/env";

export interface SessionUser {
  id: string;
  email: string;
  name: string;
  role: Role;
}

const COOKIE_NAME = "orbitcheck_session";
const JWT_EXPIRES_IN = "7d";

// 1. Password Hashing
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

// 2. JWT Session Tokens
export function createSessionToken(user: SessionUser): string {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    },
    env.JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  );
}

export function verifySessionToken(token: string): SessionUser | null {
  try {
    const decoded = jwt.verify(token, env.JWT_SECRET) as SessionUser;
    return decoded;
  } catch {
    return null;
  }
}

// 3. Extract Session from Request Cookie or Authorization Header
export function getSessionFromRequest(req: NextRequest): SessionUser | null {
  // Check Cookie first
  const cookieToken = req.cookies.get(COOKIE_NAME)?.value;
  if (cookieToken) {
    const user = verifySessionToken(cookieToken);
    if (user) return user;
  }

  // Fallback to Bearer Token
  const authHeader = req.headers.get("authorization");
  if (authHeader?.startsWith("Bearer ")) {
    const bearerToken = authHeader.substring(7);
    return verifySessionToken(bearerToken);
  }

  return null;
}

// 4. Set Session Cookie on NextResponse
export function attachSessionCookie(response: NextResponse, token: string): NextResponse {
  response.cookies.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 7 * 24 * 60 * 60, // 7 days
  });
  return response;
}

export function removeSessionCookie(response: NextResponse): NextResponse {
  response.cookies.delete(COOKIE_NAME);
  return response;
}

// 5. Server-Side Guard Helpers
export function requireAuth(req: NextRequest): { user: SessionUser } | { errorResponse: NextResponse } {
  const user = getSessionFromRequest(req);
  if (!user) {
    return {
      errorResponse: NextResponse.json(
        { error: "UNAUTHORIZED", message: "Authentication required" },
        { status: 401 }
      ),
    };
  }
  return { user };
}

export function requireRole(
  req: NextRequest,
  allowedRoles: Role[]
): { user: SessionUser } | { errorResponse: NextResponse } {
  const authResult = requireAuth(req);
  if ("errorResponse" in authResult) {
    return authResult;
  }

  const { user } = authResult;
  if (!allowedRoles.includes(user.role)) {
    return {
      errorResponse: NextResponse.json(
        { error: "FORBIDDEN", message: "Insufficient permissions for this operation" },
        { status: 403 }
      ),
    };
  }

  return { user };
}
