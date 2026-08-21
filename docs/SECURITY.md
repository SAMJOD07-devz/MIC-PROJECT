# OrbitCheck — Security Architecture & QR Anti-Sharing Strategy

## 1. QR Ticket Security Overview

In physical event operations, static QR codes are vulnerable to unauthorized sharing (e.g. sending a screenshot to an unregistered friend). OrbitCheck mitigates this threat through a multi-layered security model combining server-bound tokens, one-time consumption constraints, and dynamic token rotation.

---

## 2. Server-Bound Token Hashing

1. **Unique Registration Payload**: Every registration receives a server-issued opaque token containing registration ID, event ID, attendee ID, timestamp, and a cryptographic random salt:
   ```text
   ORBIT-TICKET:<eventId>:<attendeeId>:<timestamp>:<randomBytes>
   ```
2. **SHA-256 Hashing**: The database stores only the SHA-256 hash (`qrTokenHash`) of the token payload.
3. **No Multi-Event Sharing**: A QR code is mathematically tied to exactly one event registration. An attendee cannot reuse a single QR code across multiple events.

---

## 3. Anti-Sharing Tradeoff Matrix

| Strategy | Security Mechanism | User Experience Tradeoff | Offline Suitability |
| --- | --- | --- | --- |
| **One-Time Consumption (Active)** | Once scanned and recorded in `CheckIn`, any subsequent scan is rejected as `ALREADY_CHECKED_IN` with the original check-in timestamp. | Simple for attendees; screenshot is invalidated instantly upon first use. | High — Scans recorded offline sync deterministically upon reconnect. |
| **Short-Lived Token Rotation** | Dynamic client QR code that rotates signature every 30 seconds. | Requires attendee device to maintain network connectivity to refresh payload. | Medium — Requires a bounded grace window (e.g. 5 minutes) for offline mobile devices. |
| **Server-Side Attendee Verification** | Scanned QR reveals attendee identity; organizer console displays photo/name for manual verification. | Adds 2 seconds of visual check per scan. | High — Works fully offline if roster is pre-cached on device. |

---

## 4. One-Time Consumption Enforcement

OrbitCheck relies on database-enforced unique constraints:
- `CheckIn.registrationId UNIQUE`: Guarantees that even if two attendees present identical screenshots to two different scanner stations simultaneously, the database engine permits **exactly ONE `INSERT INTO check_ins`**.
- All duplicate scans return status `409 ALREADY_CHECKED_IN` with the timestamp of the original check-in.

---

## 5. Secret Key Management & Protection

- All secret keys (`JWT_SECRET`, database passwords, AI service keys) are managed strictly via environment variables.
- Secret files (`.env`, `.env.local`) are added to `.gitignore` and excluded from repository commits.
- Frontend bundles receive only public configuration (`NEXT_PUBLIC_APP_URL`). API keys never leak to browser bundles.
