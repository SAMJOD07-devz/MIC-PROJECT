# OrbitCheck — Architecture & Systems Design

## 1. Technical Stack Overview

| Layer | Chosen Technology | Architectural Rationale |
| --- | --- | --- |
| **Frontend Framework** | Next.js 14+ (App Router, React, TypeScript) | Unified TypeScript full-stack structure, fast SSR/client component boundaries, built-in API routing capabilities. |
| **Backend API** | Node.js (Next.js API Routes / Standalone Express Router) | Shared TypeScript models across client/server, native async handling for concurrency, standard HTTP middleware pattern. |
| **Database & ORM** | SQLite / PostgreSQL via Prisma ORM | Supports ACID transactions (`BEGIN EXCLUSIVE` / strict isolation), strict foreign keys, unique constraints, zero-config local file locking across processes (WAL mode). |
| **Authentication & RBAC** | Cookie-based HTTP-only Session / Signed JWT | Enforced server-side via backend middleware (`ORGANIZER` vs `ATTENDEE` roles); blocks unauthorized API access at the router level. |
| **QR Payload & Generation** | Server-signed JWT / Opaque Token Hash (`qrcode` npm) | Unique token per registration, rotatable/expirable, prevents static QR copying across attendees. |
| **QR Camera Scanning** | `html5-qrcode` / `jsqr` with Canvas fallback | Accesses device camera safely with permission checks, handles rapid scanning, provides manual input fallback. |
| **Realtime Dashboard** | Server-Sent Events (SSE) or Socket.IO | Broadcasts instant count & attendee updates to organizer dashboards immediately after DB transactions commit. |
| **Offline Synchronization** | IndexedDB via Dexie.js outbox queue | Stores scan payloads offline with client-side UUID idempotency keys; automatically syncs and handles races on reconnect. |
| **3D Visual Presentation** | Three.js / React Three Fiber (R3F) or Canvas 3D Hero | Decorative particle constellation / animated orb hero section; fully decoupled from functional HTML UI with `prefers-reduced-motion` & WebGL fallback. |
| **AI Insights** | Server-side OpenAI/Gemini Client with Aggregation Pipeline | Backend queries SQL aggregates first, feeds exact structured facts to AI prompt; provides deterministic raw stats fallback if AI fails or times out. |
| **Concurrency Testing** | Node.js multi-process / `Promise.all` script (`scripts/concurrency-checkin.ts`) | Fires 100+ parallel check-in/registration requests across single/multi-port server instances to verify DB transaction locks. |

---

## 2. Database Schema & Integrity Constraints

### ER Schema (Prisma Blueprint)
```prisma
enum Role {
  ORGANIZER
  ATTENDEE
}

enum RegistrationStatus {
  REGISTERED
  CHECKED_IN
  CANCELLED
}

model User {
  id            String         @id @default(uuid())
  email         String         @unique
  passwordHash  String
  name          String
  role          Role           @default(ATTENDEE)
  createdAt     DateTime       @default(now())
  registrations Registration[]
  events        Event[]        @relation("OrganizerEvents")
  checkIns      CheckIn[]      @relation("OrganizerCheckIns")
}

model Event {
  id            String         @id @default(uuid())
  organizerId   String
  organizer     User           @relation("OrganizerEvents", fields: [organizerId], references: [id])
  title         String
  description   String
  date          DateTime
  capacity      Int
  createdAt     DateTime       @default(now())
  registrations Registration[]
  checkIns      CheckIn[]
}

model Registration {
  id                 String             @id @default(uuid())
  eventId            String
  event              Event              @relation(fields: [eventId], references: [id])
  attendeeId         String
  attendee           User               @relation(fields: [attendeeId], references: [id])
  qrToken            String             @unique
  qrTokenHash        String             @unique
  status             RegistrationStatus @default(REGISTERED)
  registeredAt       DateTime           @default(now())
  checkIn            CheckIn?

  @@unique([eventId, attendeeId]) // Prevents duplicate registration per attendee
}

model CheckIn {
  id                   String       @id @default(uuid())
  eventId              String
  event                Event        @relation(fields: [eventId], references: [id])
  registrationId       String       @unique // UNIQUE constraint guarantees max 1 check-in per registration
  registration         Registration @relation(fields: [registrationId], references: [id])
  scannedByOrganizerId String
  scannedBy            User         @relation("OrganizerCheckIns", fields: [scannedByOrganizerId], references: [id])
  idempotencyKey       String?      @unique // Prevents offline sync duplicates
  checkInTime          DateTime     @default(now())
  offlineCapturedAt    DateTime?
  deviceId             String?
}
```

### Key Database Guarantees
1. `@@unique([eventId, attendeeId])`: DB-enforced single registration per user per event.
2. `CheckIn.registrationId UNIQUE`: Guarantees DB level atomic duplicate rejection. If 100 concurrent scan requests hit the DB for the same registration, exactly ONE `INSERT INTO check_ins` succeeds; 99 trigger a unique constraint violation handled as an `ALREADY_CHECKED_IN` duplicate response.
3. **Atomic Capacity Check**: Event registrations execute within `IMMEDIATE/SERIALIZABLE` transactions. The transaction executes:
   - Locks the Event row / counts existing registrations.
   - Rejects with `EVENT_FULL` if `count >= capacity`.
   - Inserts registration if `count < capacity`.

---

## 3. Route & API Specification

| Endpoint | Method | Role | Description |
| --- | --- | --- | --- |
| `/api/auth/register` | `POST` | Public | Register new user (Organizer or Attendee). |
| `/api/auth/login` | `POST` | Public | Authenticate user, set HTTP-only cookie. |
| `/api/auth/me` | `GET` | Authenticated | Fetch current user session. |
| `/api/events` | `POST` | Organizer | Create event with capacity & date. |
| `/api/events` | `GET` | Authenticated | List all upcoming events. |
| `/api/events/:id` | `GET` | Authenticated | Get event details & registration counts. |
| `/api/events/:id/register` | `POST` | Attendee | Register for event (Capacity transaction safe). |
| `/api/tickets/me` | `GET` | Attendee | Fetch attendee's tickets and unique QR payload. |
| `/api/checkin` | `POST` | Organizer | Process atomic QR check-in scan. |
| `/api/checkin/sync` | `POST` | Organizer | Idempotent offline scan batch synchronization. |
| `/api/events/:id/dashboard` | `GET` / SSE | Organizer | Live dashboard state (capacity, checked-in, no-shows, peak time). |
| `/api/events/:id/export` | `GET` | Organizer | Download CSV check-in roster. |
| `/api/events/:id/insights` | `POST` | Organizer | AI insight prompt evaluation backed by DB facts. |

---

## 4. Seven Core User Flows

1. **Organizer Creation Flow**: Organizer logs in, navigates to dashboard, creates event with title, date, and max capacity.
2. **Attendee Registration Flow**: Attendee discovers event, requests registration. DB checks capacity atomically under transaction; returns ticket or `EVENT_FULL`.
3. **Unique QR Ticket Display Flow**: Attendee views ticket page; server generates dynamic/signed QR code containing attendee-specific token hash.
4. **Organizer Camera Scan Flow**: Organizer opens web scanner, camera decodes QR payload, sends check-in POST request to server.
5. **Duplicate Check-In Safeguard Flow**: Organizer scans an already checked-in QR token. API detects existing `CheckIn` record, rejects with status `409 ALREADY_CHECKED_IN`, returning original check-in timestamp.
6. **Offline Outbox & Reconnect Flow**: Scanner detects network drop, saves scan payload + UUID idempotency key to IndexedDB. Upon reconnect, outbox flushes to `/api/checkin/sync`.
7. **Live Dashboard, CSV & AI Insights Flow**: Organizer monitors SSE stream updates, queries server-side AI for natural language event summary (with raw fallback), and exports CSV roster.

---

## 5. Testing & Verification Strategy

- **Capacity Concurrency Test (`scripts/concurrency-registration.ts`)**: Fires 100 parallel registration requests for an event with capacity 10. Asserts exactly 10 registrations created, 90 rejected.
- **Duplicate Check-In Test (`scripts/concurrency-checkin.ts`)**: Fires 100 parallel scan requests for a single valid QR code. Asserts exactly 1 success, 99 duplicate responses.
- **Multi-Process Dual-Port Verification**: Spawns 2 server instances on port 3001 and port 3002 against the same SQLite database file. Fires concurrency script split across both ports.
- **Offline Outbox Sync & Race Verification**: Station A scans QR while offline; Station B scans same QR online. Station A reconnects; outbox sync yields `ALREADY_CHECKED_IN` without creating duplicate record.
- **AI Fallback Test**: Simulates OpenAI API key error/timeout; backend returns computed SQL statistics (`registeredCount`, `checkInCount`, `peakTime`) rendered cleanly in UI.

---

## 6. Implementation Checklist

- [x] Phase 0: Repository Discovery & Architecture Contract
- [ ] Phase 1: Scaffold, Configuration & Database Schema
- [ ] Phase 2: Authentication & Enforced Roles
- [ ] Phase 3: Event Creation, Registration & Capacity Safety
- [ ] Phase 4: Unique QR Ticket & Anti-Sharing Strategy
- [ ] Phase 5: Atomic Check-In & Duplicate Protection
- [ ] Phase 6: Functional Frontend (HTML/CSS UI)
- [ ] Phase 7: Camera Scanning & Offline Outbox
- [ ] Phase 8: Live Realtime Dashboard & CSV Export
- [ ] Phase 9: Server-Side AI Event Insights
- [ ] Phase 10: 3D Visual Enhancement & Motion Layer
- [ ] Phase 11: Final Verification, Evidence & Submission Polish
