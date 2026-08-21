import { NextRequest } from "next/server";
import { Role } from "@prisma/client";
import {
  hashPassword,
  verifyPassword,
  createSessionToken,
  verifySessionToken,
  requireAuth,
  requireRole,
} from "../src/lib/auth";

async function runAuthTests() {
  console.log("🧪 Starting Phase 2 — Authentication & Role Enforcement Unit Tests...");
  let passed = 0;
  let failed = 0;

  function assert(condition: boolean, testName: string) {
    if (condition) {
      console.log(`  ✅ PASSED: ${testName}`);
      passed++;
    } else {
      console.error(`  ❌ FAILED: ${testName}`);
      failed++;
    }
  }

  // Test 1: Password Hashing & Verification
  const password = "SuperSecretPassword123!";
  const hash = await hashPassword(password);
  const isValid = await verifyPassword(password, hash);
  const isInvalid = await verifyPassword("WrongPassword", hash);
  assert(isValid === true && isInvalid === false, "Password hash & verify works correctly");

  // Test 2: JWT Session Token Signing & Verification
  const attendeeUser = {
    id: "user-att-123",
    email: "attendee@test.com",
    name: "Test Attendee",
    role: Role.ATTENDEE,
  };
  const token = createSessionToken(attendeeUser);
  const decoded = verifySessionToken(token);
  assert(
    decoded?.id === attendeeUser.id && decoded?.role === Role.ATTENDEE,
    "JWT token signing and decoding succeeds"
  );

  // Test 3: Unauthenticated Request Guard (401 Unauthorized)
  const reqUnauth = new NextRequest("http://localhost:3000/api/organizer/protected-test");
  const authRes = requireAuth(reqUnauth);
  assert(
    "errorResponse" in authRes && authRes.errorResponse.status === 401,
    "Unauthenticated request is rejected with 401 Unauthorized"
  );

  // Test 4: Role Guard — Attendee accessing Organizer Route (403 Forbidden)
  const reqAttendeeRole = new NextRequest("http://localhost:3000/api/organizer/protected-test", {
    headers: { Authorization: `Bearer ${token}` },
  });
  const roleResAttendee = requireRole(reqAttendeeRole, [Role.ORGANIZER]);
  assert(
    "errorResponse" in roleResAttendee && roleResAttendee.errorResponse.status === 403,
    "Attendee user attempting organizer route is rejected with 403 Forbidden"
  );

  // Test 5: Role Guard — Organizer accessing Organizer Route (200 Granted)
  const organizerUser = {
    id: "user-org-456",
    email: "organizer@test.com",
    name: "Test Organizer",
    role: Role.ORGANIZER,
  };
  const orgToken = createSessionToken(organizerUser);
  const reqOrganizerRole = new NextRequest("http://localhost:3000/api/organizer/protected-test", {
    headers: { Authorization: `Bearer ${orgToken}` },
  });
  const roleResOrganizer = requireRole(reqOrganizerRole, [Role.ORGANIZER]);
  assert(
    "user" in roleResOrganizer && roleResOrganizer.user.role === Role.ORGANIZER,
    "Organizer user accessing organizer route is granted access"
  );

  // Test 6: Role Guard — Attendee accessing Attendee Route (200 Granted)
  const reqAttendeePortal = new NextRequest("http://localhost:3000/api/attendee/protected-test", {
    headers: { Authorization: `Bearer ${token}` },
  });
  const roleResAttendeePortal = requireRole(reqAttendeePortal, [Role.ATTENDEE]);
  assert(
    "user" in roleResAttendeePortal && roleResAttendeePortal.user.role === Role.ATTENDEE,
    "Attendee user accessing attendee portal is granted access"
  );

  console.log(`\n📊 Auth Unit Test Results: ${passed} Passed, ${failed} Failed`);
  if (failed > 0) {
    process.exit(1);
  }
}

runAuthTests().catch((e) => {
  console.error("Test error:", e);
  process.exit(1);
});
