import { NextRequest } from "next/server";
import { generateRegistrationQrToken, hashQrToken, renderQrCodeDataUrl } from "../src/lib/qr";
import { POST as validateTicketRoute } from "../src/app/api/tickets/validate/route";
import { createSessionToken } from "../src/lib/auth";
import { Role } from "@prisma/client";

async function runQrTests() {
  console.log("🧪 Starting Phase 4 — QR Tickets & Anti-Sharing Strategy Unit Tests...");
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

  // Test 1: Unique QR Token Generation
  const tokenA = generateRegistrationQrToken("event-1", "attendee-1");
  const tokenB = generateRegistrationQrToken("event-1", "attendee-2");
  assert(
    tokenA.token !== tokenB.token && tokenA.hash !== tokenB.hash,
    "Two registrations generate distinct QR tokens and token hashes"
  );

  // Test 2: SHA-256 Hash Function
  const hash1 = hashQrToken("TEST-TOKEN-123");
  const hash2 = hashQrToken("TEST-TOKEN-123");
  assert(hash1 === hash2 && hash1.length === 64, "SHA-256 hashing is deterministic and produces 64-char hex string");

  // Test 3: QR Code Image DataURL Generation
  const dataUrl = await renderQrCodeDataUrl(tokenA.token);
  assert(
    typeof dataUrl === "string" && dataUrl.startsWith("data:image/png;base64,"),
    "Rendered QR code produces a valid Base64 PNG DataURL"
  );

  // Test 4: Validate Route rejects fake/invalid token -> 404
  const organizerToken = createSessionToken({
    id: "org-1",
    email: "org@test.com",
    name: "Organizer",
    role: Role.ORGANIZER,
  });
  const reqFakeToken = new NextRequest("http://localhost:3000/api/tickets/validate", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${organizerToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      qrToken: "INVALID-FAKE-ORBIT-TOKEN-99999",
    }),
  });
  const resFakeToken = await validateTicketRoute(reqFakeToken);
  assert(
    resFakeToken.status === 404,
    "Invalid QR token validation request is rejected with 404 NOT_FOUND"
  );

  console.log(`\n📊 QR Ticket Unit Test Results: ${passed} Passed, ${failed} Failed`);
  if (failed > 0) {
    process.exit(1);
  }
}

runQrTests().catch((e) => {
  console.error("QR tests failed:", e);
  process.exit(1);
});
