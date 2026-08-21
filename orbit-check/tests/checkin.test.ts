import { NextRequest } from "next/server";
import { Role } from "@prisma/client";
import { createSessionToken } from "../src/lib/auth";
import { POST as checkInRoute } from "../src/app/api/checkin/route";

async function runCheckInUnitTests() {
  console.log("🧪 Starting Phase 5 — Atomic Check-In & Duplicate Protection Unit Tests...");
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

  // Test 1: Unauthenticated Check-In -> 401 Unauthorized
  const reqUnauth = new NextRequest("http://localhost:3000/api/checkin", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ qrToken: "ORBIT-TEST-TOKEN" }),
  });
  const resUnauth = await checkInRoute(reqUnauth);
  assert(resUnauth.status === 401, "Unauthenticated check-in is rejected with 401 Unauthorized");

  // Test 2: Attendee attempting Check-In -> 403 Forbidden
  const attendeeToken = createSessionToken({
    id: "att-1",
    email: "att@test.com",
    name: "Attendee",
    role: Role.ATTENDEE,
  });
  const reqAttendee = new NextRequest("http://localhost:3000/api/checkin", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${attendeeToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ qrToken: "ORBIT-TEST-TOKEN" }),
  });
  const resAttendee = await checkInRoute(reqAttendee);
  assert(resAttendee.status === 403, "Attendee user calling check-in is rejected with 403 Forbidden");

  // Test 3: Organizer scanning fake QR Token -> 404 INVALID_TOKEN
  const organizerToken = createSessionToken({
    id: "org-1",
    email: "org@test.com",
    name: "Organizer",
    role: Role.ORGANIZER,
  });
  const reqFakeToken = new NextRequest("http://localhost:3000/api/checkin", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${organizerToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ qrToken: "FAKE-NONEXISTENT-ORBIT-TOKEN-9999" }),
  });
  const resFakeToken = await checkInRoute(reqFakeToken);
  assert(resFakeToken.status === 404, "Scanning non-existent QR token returns 404 INVALID_TOKEN");

  console.log(`\n📊 Check-In Unit Test Results: ${passed} Passed, ${failed} Failed`);
  if (failed > 0) {
    process.exit(1);
  }
}

runCheckInUnitTests().catch((e) => {
  console.error("Check-in tests failed:", e);
  process.exit(1);
});
