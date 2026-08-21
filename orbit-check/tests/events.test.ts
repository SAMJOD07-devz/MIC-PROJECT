import { NextRequest } from "next/server";
import { Role } from "@prisma/client";
import { createSessionToken } from "../src/lib/auth";
import { POST as createEventRoute, GET as getEventsRoute } from "../src/app/api/events/route";

async function runEventsTests() {
  console.log("🧪 Starting Phase 3 — Events & Registration Unit Tests...");
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

  // Test 1: Unauthenticated GET /api/events -> 401
  const reqUnauthEvents = new NextRequest("http://localhost:3000/api/events");
  const resUnauthEvents = await getEventsRoute(reqUnauthEvents);
  assert(resUnauthEvents.status === 401, "Unauthenticated GET /api/events returns 401");

  // Test 2: Attendee attempting POST /api/events -> 403 Forbidden
  const attendeeToken = createSessionToken({
    id: "att-1",
    email: "att@test.com",
    name: "Attendee",
    role: Role.ATTENDEE,
  });
  const reqAttendeeCreate = new NextRequest("http://localhost:3000/api/events", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${attendeeToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      title: "Attendee Created Event",
      description: "Should fail authorization",
      date: new Date().toISOString(),
      capacity: 100,
    }),
  });
  const resAttendeeCreate = await createEventRoute(reqAttendeeCreate);
  assert(resAttendeeCreate.status === 403, "Attendee POST /api/events is rejected with 403 Forbidden");

  // Test 3: Organizer invalid payload POST /api/events -> 400 Bad Request
  const organizerToken = createSessionToken({
    id: "org-1",
    email: "org@test.com",
    name: "Organizer",
    role: Role.ORGANIZER,
  });
  const reqInvalidPayload = new NextRequest("http://localhost:3000/api/events", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${organizerToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      title: "X", // Invalid: min 3 chars
      description: "Short",
      date: "not-a-date",
      capacity: -5, // Invalid: must be positive
    }),
  });
  const resInvalidPayload = await createEventRoute(reqInvalidPayload);
  assert(resInvalidPayload.status === 400, "Organizer POST /api/events with invalid schema returns 400");

  console.log(`\n📊 Events & Registration Unit Test Results: ${passed} Passed, ${failed} Failed`);
  if (failed > 0) {
    process.exit(1);
  }
}

runEventsTests().catch((e) => {
  console.error("Events test failed:", e);
  process.exit(1);
});
