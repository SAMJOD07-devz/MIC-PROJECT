import { NextRequest } from "next/server";
import { Role } from "@prisma/client";
import { createSessionToken } from "../src/lib/auth";
import { GET as exportCsvRoute } from "../src/app/api/events/[id]/export/route";
import { GET as getDashboardMetricsRoute } from "../src/app/api/events/[id]/dashboard/route";

async function runDashboardExportTests() {
  console.log("🧪 Starting Phase 8 — Live Operations Dashboard & CSV Export Unit Tests...");
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

  const mockParams = Promise.resolve({ id: "evt-test-123" });

  // Test 1: Unauthenticated CSV Export -> 401 Unauthorized
  const reqUnauthExport = new NextRequest("http://localhost:3000/api/events/evt-test-123/export");
  const resUnauthExport = await exportCsvRoute(reqUnauthExport, { params: mockParams });
  assert(resUnauthExport.status === 401, "Unauthenticated CSV export request is rejected with 401");

  // Test 2: Attendee role CSV Export -> 403 Forbidden
  const attendeeToken = createSessionToken({
    id: "att-1",
    email: "att@test.com",
    name: "Attendee",
    role: Role.ATTENDEE,
  });
  const reqAttendeeExport = new NextRequest("http://localhost:3000/api/events/evt-test-123/export", {
    headers: { Authorization: `Bearer ${attendeeToken}` },
  });
  const resAttendeeExport = await exportCsvRoute(reqAttendeeExport, { params: mockParams });
  assert(resAttendeeExport.status === 403, "Attendee role CSV export request is rejected with 403 Forbidden");

  // Test 3: Organizer CSV Export -> 200 OK & Content-Type text/csv
  const organizerToken = createSessionToken({
    id: "org-1",
    email: "org@test.com",
    name: "Organizer",
    role: Role.ORGANIZER,
  });
  const reqOrgExport = new NextRequest("http://localhost:3000/api/events/evt-test-123/export", {
    headers: { Authorization: `Bearer ${organizerToken}` },
  });
  const resOrgExport = await exportCsvRoute(reqOrgExport, { params: mockParams });
  const contentType = resOrgExport.headers.get("Content-Type");
  const csvBody = await resOrgExport.text();
  assert(
    resOrgExport.status === 200 &&
      Boolean(contentType?.includes("text/csv")) &&
      csvBody.includes("Attendee Name") &&
      csvBody.includes("Check-In Timestamp"),
    "Organizer CSV export returns valid 200 OK text/csv with formatted header columns"
  );

  // Test 4: Organizer Dashboard Metrics -> 200 OK with computed stats
  const reqOrgDashboard = new NextRequest("http://localhost:3000/api/events/evt-test-123/dashboard", {
    headers: { Authorization: `Bearer ${organizerToken}` },
  });
  const resOrgDashboard = await getDashboardMetricsRoute(reqOrgDashboard, { params: mockParams });
  const dataDashboard = await resOrgDashboard.json();
  assert(
    resOrgDashboard.status === 200 &&
      dataDashboard?.metrics !== undefined &&
      typeof dataDashboard?.metrics?.capacity === "number",
    "Organizer dashboard route returns 200 OK with computed metrics and checkInPercentage"
  );

  console.log(`\n📊 Live Dashboard & CSV Export Unit Test Results: ${passed} Passed, ${failed} Failed`);
  if (failed > 0) {
    process.exit(1);
  }
}

runDashboardExportTests().catch((e) => {
  console.error("Dashboard & export tests failed:", e);
  process.exit(1);
});
