# OrbitCheck — Antigravity Handoff Document

## 1. Architecture Decisions
- **Stack**: Next.js 16 (App Router, React 19, TypeScript 5), Tailwind CSS v4, Lucide React.
- **Database & Engine**: PostgreSQL via Prisma ORM (Prisma 7.9.1 with `@prisma/adapter-pg` driver adapter).
- **Database Constraints**:
  - `@@unique([eventId, attendeeId])` on `Registration` guarantees single event registration per attendee.
  - `registrationId` `@unique` on `CheckIn` enforces atomic database-level duplicate check-in prevention.
  - `qrToken` & `qrTokenHash` `@unique` on `Registration` enforces QR ticket uniqueness.
  - `idempotencyKey` `@unique` on `CheckIn` and `IdempotencyRecord` prevents offline batch duplicate retries.
- **Auth Strategy**: HTTP-only cookie-based JWT sessions with strict server-side middleware role guards (`ORGANIZER`, `ATTENDEE`).
- **Capacity Lock Strategy**: Atomic Prisma transaction (`$transaction`) counting existing registrations under database lock before insertion; returns `409 EVENT_FULL` when `currentCount >= capacity`.

## 2. Completed Work
- **Phase 0 (Discovery & Architecture Contract)**:
  - Runtime verified: Node v24.14.0, npm 11.9.0.
  - Created `docs/ARCHITECTURE.md` and `docs/ANTIGRAVITY_HANDOFF.md`.
- **Phase 1 (Foundation & Database Schema)**:
  - Confirmed existing Next.js App Router scaffold at `orbit-check/`.
  - Installed dependencies: `@prisma/client@7.9.1`, `prisma@7.9.1`, `zod`, `bcryptjs`, `dotenv`, `tsx`, `@types/bcryptjs`.
  - Created `prisma/schema.prisma` with PostgreSQL models for `User`, `Event`, `Registration`, `CheckIn`, and `IdempotencyRecord`.
  - Configured `prisma.config.ts`, `.env`, `.env.example`, `src/lib/env.ts`, `src/lib/prisma.ts`.
  - Created initial seed dataset in `prisma/seed.ts` (1 organizer, 3 attendees, 1 event with capacity 50, 3 registrations, 1 check-in).
  - Configured `"prisma": { "seed": "tsx prisma/seed.ts" }` in `package.json`.
  - Ran `npx prisma generate` (Generated Prisma Client v7.9.1) and verified `npx tsc --noEmit` cleanly (0 errors).
- **Phase 2 (Authentication & Enforced Roles)**:
  - Built password hashing (`bcryptjs`) & JWT session manager (`jsonwebtoken`) in `src/lib/auth.ts`.
  - Created API endpoints: `/api/auth/register`, `/api/auth/login`, `/api/auth/logout`, `/api/auth/me`, `/api/organizer/protected-test`, `/api/attendee/protected-test`.
  - Implemented Next.js route protection middleware (`src/middleware.ts`).
  - Added automated test suite `tests/auth.test.ts` (6/6 passed).
- **Phase 3 (Event Creation, Registration & Capacity Safety)**:
  - Installed PostgreSQL driver adapter `@prisma/adapter-pg` & `pg`.
  - Built event management endpoints:
    - `POST /api/events` (Organizer event creation with capacity & ISO date validation).
    - `GET /api/events` (Lists upcoming events with live capacity counts).
    - `GET /api/events/[id]` (Single event detail with remaining capacity).
    - `POST /api/events/[id]/register` (Attendee event registration with atomic transaction capacity lock).
  - Built 100+ concurrent registration capacity safety proof script (`scripts/concurrency-registration.ts`).
  - Added automated unit test suite `tests/events.test.ts` (3/3 passed).

## 3. Environment Variables (Secret files like `.env` are git-ignored)
```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/orbitcheck?schema=public"
JWT_SECRET="orbitcheck-super-secret-jwt-key-2026"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
OPENAI_API_KEY="sk-demo-or-placeholder"
```

## 4. Key Commands
- **Development Server**: `cd orbit-check && npm run dev`
- **Auth Unit Tests**: `cd orbit-check && npx tsx tests/auth.test.ts`
- **Events Unit Tests**: `cd orbit-check && npx tsx tests/events.test.ts`
- **100+ Concurrency Proof**: `cd orbit-check && npx tsx scripts/concurrency-registration.ts`
- **Typecheck**: `cd orbit-check && npx tsc --noEmit`
- **Push Phase 3 to GitHub**: `git add . && git commit -m "Phase 3: Event Creation, Registration, and Capacity Safety" && git push origin main`

## 5. Files Changed in Phase 3
- `orbit-check/package.json`
- `orbit-check/package-lock.json`
- `orbit-check/src/lib/prisma.ts`
- `orbit-check/src/app/api/events/route.ts`
- `orbit-check/src/app/api/events/[id]/route.ts`
- `orbit-check/src/app/api/events/[id]/register/route.ts`
- `orbit-check/prisma/seed.ts`
- `orbit-check/scripts/concurrency-registration.ts`
- `orbit-check/tests/events.test.ts`
- `docs/ANTIGRAVITY_HANDOFF.md`

## 6. Next Incomplete Phase
- **Phase 4 — Unique QR Ticket and Anti-Sharing Strategy**: Implement dynamic server-issued QR ticket payload generator, token rotation/hash verification, and attendee ticket portal endpoints.
