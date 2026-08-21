import { NextRequest } from "next/server";
import { Role } from "@prisma/client";
import { createSessionToken } from "../src/lib/auth";
import { POST as batchSyncRoute } from "../src/app/api/checkin/sync/route";

async function runOfflineSyncTests() {
  console.log("🧪 Starting Phase 7 — Camera & Offline Outbox Sync Unit Tests...");
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

  // Test 1: Unauthenticated batch sync -> 401 Unauthorized
  const reqUnauth = new NextRequest("http://localhost:3000/api/checkin/sync", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ scans: [] }),
  });
  const resUnauth = await batchSyncRoute(reqUnauth);
  assert(resUnauth.status === 401, "Unauthenticated batch sync is rejected with 401 Unauthorized");

  // Test 2: Attendee role batch sync -> 403 Forbidden
  const attendeeToken = createSessionToken({
    id: "att-1",
    email: "att@test.com",
    name: "Attendee",
    role: Role.ATTENDEE,
  });
  const reqAttendee = new NextRequest("http://localhost:3000/api/checkin/sync", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${attendeeToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      scans: [
        {
          idempotencyKey: "IDEM-TEST-1",
          qrToken: "ORBIT-TOKEN-TEST",
          deviceId: "station-a",
          offlineCapturedAt: new Date().toISOString(),
        },
      ],
    }),
  });
  const resAttendee = await batchSyncRoute(reqAttendee);
  assert(resAttendee.status === 403, "Attendee calling batch sync is rejected with 403 Forbidden");

  // Test 3: Organizer batch sync with offline fake QR token -> 200 OK with INVALID item status
  const organizerToken = createSessionToken({
    id: "org-1",
    email: "org@test.com",
    name: "Organizer",
    role: Role.ORGANIZER,
  });
  const reqBatchSync = new NextRequest("http://localhost:3000/api/checkin/sync", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${organizerToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      scans: [
        {
          idempotencyKey: `IDEM-SYNC-TEST-${Date.now()}`,
          qrToken: "ORBIT-FAKE-OFFLINE-TOKEN-999",
          deviceId: "station-offline-1",
          offlineCapturedAt: new Date().toISOString(),
        },
      ],
    }),
  });
  const resBatchSync = await batchSyncRoute(reqBatchSync);
  const dataBatchSync = await resBatchSync.json();
  assert(
    resBatchSync.status === 200 &&
      Array.isArray(dataBatchSync.results) &&
      dataBatchSync.results[0]?.status === "INVALID",
    "Batch sync processes items and returns itemized status list"
  );

  console.log(`\n📊 Offline Sync Unit Test Results: ${passed} Passed, ${failed} Failed`);
  if (failed > 0) {
    process.exit(1);
  }
}

runOfflineSyncTests().catch((e) => {
  console.error("Offline sync test failed:", e);
  process.exit(1);
});
