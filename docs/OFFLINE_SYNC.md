# OrbitCheck — Offline-First Scanner & Synchronization Architecture

## 1. Offline Scanner Overview

In high-density physical events, cellular or Wi-Fi networks can intermittently drop. OrbitCheck incorporates an **offline-first scanner outbox** backed by browser `IndexedDB` (`Dexie.js`). Scans captured while offline are stored locally with client-generated idempotency keys and automatically synchronized when connectivity is restored.

---

## 2. Station A vs Station B Conflict Resolution Protocol

### Scenario
- **Station A** (Offline): Organizer at Gate A scans Attendee X's QR token while disconnected from the network. The scan is queued in IndexedDB with `idempotencyKey = IDEM-101`.
- **Station B** (Online): Organizer at Gate B scans Attendee X's QR token while connected to the internet. Server processes the check-in and marks `Registration.status = CHECKED_IN`.
- **Station A Reconnects**: Station A's outbox flushes pending items to `/api/checkin/sync`.

### Resolution Rule: Server Authority
1. The PostgreSQL server database remains **strictly authoritative**.
2. When Station A submits `IDEM-101` during sync, the server detects that `Registration.status === CHECKED_IN`.
3. The server rejects the item with status `409 CONFLICT_DUPLICATE` and returns:
   ```json
   {
     "idempotencyKey": "IDEM-101",
     "status": "CONFLICT_DUPLICATE",
     "message": "Station B checked in attendee Alex Rivera online first at 14:32:05",
     "originalCheckInTime": "2026-08-21T14:32:05.000Z"
   }
   ```
4. Station A marks its local IndexedDB record as `CONFLICT_DUPLICATE` and displays the original check-in timestamp in the organizer outbox log. **No silent data loss occurs.**

---

## 3. Idempotency Key Architecture

Every scan captured on a device receives a unique UUID v4 / timestamped idempotency key (`idempotencyKey`).
- When retrying network sync requests due to dropped TCP connections, submitting the same `idempotencyKey` multiple times is guaranteed to be **idempotent**.
- The server records processed keys in the `IdempotencyRecord` table and returns the cached response without creating duplicate `CheckIn` database entries.

---

## 4. IndexedDB Outbox Schema

```typescript
interface OutboxScan {
  id?: number;                        // Local IndexedDB Auto-Increment PK
  idempotencyKey: string;             // Client UUID v4 (Unique)
  qrToken: string;                    // Scanned QR Payload
  deviceId: string;                   // Scanner device identifier
  offlineCapturedAt: string;         // Device capture timestamp
  syncStatus: "PENDING" | "SYNCED" | "CONFLICT_DUPLICATE" | "INVALID";
  serverResponse?: string;           // Response message from server post-sync
  syncedAt?: string;                  // Sync completion timestamp
}
```
