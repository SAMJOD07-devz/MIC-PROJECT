# OrbitCheck — 100+ Request Concurrency Proof & Multi-Process Architecture

## 1. Concurrency Architecture & Technical Defense

OrbitCheck is engineered to withstand aggressive multi-process race conditions during peak event check-ins. Rather than relying on fragile in-memory counters, mutexes, or client-side flags (which fail across multiple server processes), OrbitCheck enforces correctness directly at the PostgreSQL database engine level:

1. **`CheckIn.registrationId UNIQUE` Constraint**:
   - The PostgreSQL database enforces a hard `UNIQUE` index on the `registrationId` column in the `CheckIn` table.
   - When 100 parallel scan requests attempt to insert a check-in for the same registration, the database transaction isolation manager serializes the write locks.
   - **Result**: Exactly ONE `INSERT INTO check_ins` succeeds; 99 attempts trigger a `P2002` unique constraint violation and are caught immediately.

2. **Atomic Transaction Scope**:
   - Both registration and check-in execute within Prisma `$transaction` blocks.
   - Any serialization failure or duplicate attempt triggers an immediate rollback without corrupting attendee counts.

---

## 2. Running the Concurrency Proof Scripts

### Script 1: 100+ Concurrent Registration Capacity Proof
Tests 100 parallel registration requests against an event with `capacity = 10`.
```bash
cd orbit-check
npx tsx scripts/concurrency-registration.ts
```
**Expected Output**:
```text
=======================================================
📊 100+ CONCURRENT REGISTRATION TEST RESULTS
=======================================================
Total Parallel Requests Fired : 100
Event Capacity Limit           : 10
Successful Registrations (201) : 10
Rejected (EVENT_FULL) (409)     : 90
Other Errors                   : 0
Final Database Registration Count: 10
=======================================================
✅ CONCURRENCY PROOF PASSED: Exactly 10 registrations succeeded and 90 were rejected!
```

---

### Script 2: 100+ Concurrent Duplicate Check-In Proof
Tests 100 parallel scan requests for the **EXACT SAME QR TOKEN**.
```bash
cd orbit-check
npx tsx scripts/concurrency-checkin.ts
```
**Expected Output**:
```text
=======================================================
📊 100+ CONCURRENT DUPLICATE CHECK-IN PROOF RESULTS
=======================================================
Total Parallel Scan Requests Fired : 100
Successful Initial Check-Ins (201)  : 1
Rejected Duplicates (409 ALREADY)   : 99
Other Errors                        : 0
Final Database CheckIn Record Count : 1
Final Registration Status           : CHECKED_IN
=======================================================
✅ CONCURRENCY PROOF PASSED: Exactly 1 check-in succeeded and 99 were rejected as duplicates!
```

---

## 3. Dual-Process / Dual-Port Multi-Node Verification

To prove multi-process safety across two separate Node.js server instances pointing to the same PostgreSQL database:
1. Start Server Instance 1: `PORT=3001 npm run dev`
2. Start Server Instance 2: `PORT=3002 npm run dev`
3. Dispatch 50 requests to `http://localhost:3001/api/checkin` and 50 requests to `http://localhost:3002/api/checkin` simultaneously.
4. The database engine guarantees **exactly 1 success** and **99 rejected duplicates** with status `409 ALREADY_CHECKED_IN`.
