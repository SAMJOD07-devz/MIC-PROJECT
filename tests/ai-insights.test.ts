import { NextRequest } from "next/server";
import { Role } from "@prisma/client";
import { createSessionToken } from "../src/lib/auth";
import { POST as getInsightsRoute } from "../src/app/api/events/[id]/insights/route";

async function runAiInsightsTests() {
  console.log("🧪 Starting Phase 9 — Server-Side AI Event Insights Unit Tests...");
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

  const mockParams = Promise.resolve({ id: "evt-test-999" });

  // Test 1: Unauthenticated AI Insights -> 401 Unauthorized
  const reqUnauth = new NextRequest("http://localhost:3000/api/events/evt-test-999/insights", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ prompt: "Analyze event check-ins" }),
  });
  const resUnauth = await getInsightsRoute(reqUnauth, { params: mockParams });
  assert(resUnauth.status === 401, "Unauthenticated AI insights request is rejected with 401");

  // Test 2: Attendee Role AI Insights -> 403 Forbidden
  const attendeeToken = createSessionToken({
    id: "att-1",
    email: "att@test.com",
    name: "Attendee",
    role: Role.ATTENDEE,
  });
  const reqAttendee = new NextRequest("http://localhost:3000/api/events/evt-test-999/insights", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${attendeeToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ prompt: "Analyze event check-ins" }),
  });
  const resAttendee = await getInsightsRoute(reqAttendee, { params: mockParams });
  assert(resAttendee.status === 403, "Attendee role AI insights request is rejected with 403 Forbidden");

  // Test 3: Organizer Role AI Insights -> 200 OK with ground-truth metrics and fallback summary
  const organizerToken = createSessionToken({
    id: "org-1",
    email: "org@test.com",
    name: "Organizer",
    role: Role.ORGANIZER,
  });
  const reqOrg = new NextRequest("http://localhost:3000/api/events/evt-test-999/insights", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${organizerToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ prompt: "How is check-in progressing?" }),
  });
  const resOrg = await getInsightsRoute(reqOrg, { params: mockParams });
  const dataOrg = await resOrg.json();

  assert(
    resOrg.status === 200 &&
      dataOrg?.metrics !== undefined &&
      dataOrg?.summary !== undefined &&
      Array.isArray(dataOrg?.recommendations),
    "Organizer AI insights returns 200 OK with ground-truth metrics, summary, and recommendations"
  );

  console.log(`\n📊 Server-Side AI Insights Unit Test Results: ${passed} Passed, ${failed} Failed`);
  if (failed > 0) {
    process.exit(1);
  }
}

runAiInsightsTests().catch((e) => {
  console.error("AI insights test failed:", e);
  process.exit(1);
});
