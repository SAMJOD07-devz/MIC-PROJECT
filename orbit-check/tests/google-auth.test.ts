import { POST as googleAuthHandler } from "../src/app/api/auth/google/route";
import { NextRequest } from "next/server";

async function runGoogleAuthTests() {
  console.log("🧪 Starting Google Authentication Unit Tests...\n");

  let passed = 0;
  let failed = 0;

  function assert(condition: boolean, message: string) {
    if (condition) {
      console.log(`  ✅ PASSED: ${message}`);
      passed++;
    } else {
      console.error(`  ❌ FAILED: ${message}`);
      failed++;
    }
  }

  try {
    // Test 1: Invalid payload schema returns 400 Bad Request
    const reqInvalid = new NextRequest("http://localhost:3000/api/auth/google", {
      method: "POST",
      body: JSON.stringify({ email: "invalid-email" }),
    });
    const resInvalid = await googleAuthHandler(reqInvalid);
    assert(resInvalid.status === 400, "Invalid email payload is rejected with 400 BAD_REQUEST");

    // Test 2: Non-VIT email domain is rejected with 400 Bad Request
    const reqNonVit = new NextRequest("http://localhost:3000/api/auth/google", {
      method: "POST",
      body: JSON.stringify({ email: "user@gmail.com", name: "Non VIT User" }),
    });
    const resNonVit = await googleAuthHandler(reqNonVit);
    assert(resNonVit.status === 400, "Non-@vitstudent.ac.in email is rejected with 400 BAD_REQUEST");

    // Test 3: Valid @vitstudent.ac.in Google sign-in creates/logs-in user and returns 200 OK
    const reqValid = new NextRequest("http://localhost:3000/api/auth/google", {
      method: "POST",
      body: JSON.stringify({
        email: "unit.test.google@vitstudent.ac.in",
        name: "Unit Test Google User",
        phone: "9876543210",
        year: "2nd Year",
        role: "ATTENDEE",
      }),
    });
    const resValid = await googleAuthHandler(reqValid);
    const dataValid = await resValid.json();

    assert(resValid.status === 200, "Valid @vitstudent.ac.in Google payload returns 200 OK");
    assert(dataValid.user.email === "unit.test.google@vitstudent.ac.in", "Returned user matches Google email");
    assert(dataValid.user.phone === "9876543210", "Returned user includes phone number");
    assert(dataValid.user.year === "2nd Year", "Returned user includes academic year");

    // Test 4: Session cookie is attached
    const setCookieHeader = resValid.headers.get("Set-Cookie");
    assert(
      !!setCookieHeader && setCookieHeader.includes("orbitcheck_session"),
      "Response sets orbitcheck_session HTTP-only cookie"
    );
  } catch (err: any) {
    console.error("Test execution error:", err);
    failed++;
  }

  console.log(`\n📊 Google Auth Unit Test Results: ${passed} Passed, ${failed} Failed`);
  if (failed > 0) {
    process.exit(1);
  }
}

runGoogleAuthTests();
