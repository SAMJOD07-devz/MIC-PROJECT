# OrbitCheck — Antigravity Handoff Document

## 1. Architecture Decisions
- **Stack**: Next.js 16 (App Router, React 19, TypeScript 5), Tailwind CSS v4, Lucide React.
- **Database & Engine**: PostgreSQL via Prisma ORM (Prisma 7.9.1 with `prisma.config.ts`).
- **Database Constraints**:
  - `@@unique([eventId, attendeeId])` on `Registration` guarantees single event registration per attendee.
  - `registrationId` `@unique` on `CheckIn` enforces atomic database-level duplicate check-in prevention.
  - `qrToken` & `qrTokenHash` `@unique` on `Registration` enforces QR ticket uniqueness.
  - `idempotencyKey` `@unique` on `CheckIn` and `IdempotencyRecord` prevents offline batch duplicate retries.
- **Auth Strategy**: HTTP-only cookie-based JWT sessions with strict server-side middleware role guards (`ORGANIZER`, `ATTENDEE`).

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
  - Created API endpoints:
    - `POST /api/auth/register` (Registers user, sets HTTP-only session cookie).
    - `POST /api/auth/login` (Authenticates credentials, sets session cookie).
    - `POST /api/auth/logout` (Clears session cookie).
    - `GET /api/auth/me` (Returns current user session).
    - `GET /api/organizer/protected-test` (Organizer role guard test).
    - `GET /api/attendee/protected-test` (Attendee role guard test).
  - Implemented Next.js route protection middleware (`src/middleware.ts`).
  - Added automated test suite `tests/auth.test.ts` (6/6 passed: unauthenticated 401 rejection, attendee->organizer 403 rejection, role authorization).

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
- **Typecheck**: `cd orbit-check && npx tsc --noEmit`
- **Push Phase 2 to GitHub**: `git add . && git commit -m "Phase 2: Authentication and Enforced Roles" && git push origin main`

## 5. Files Changed in Phase 2
- `.gitignore` (Root secret shield)
- `orbit-check/src/lib/auth.ts`
- `orbit-check/src/lib/env.ts`
- `orbit-check/src/middleware.ts`
- `orbit-check/src/app/api/auth/register/route.ts`
- `orbit-check/src/app/api/auth/login/route.ts`
- `orbit-check/src/app/api/auth/logout/route.ts`
- `orbit-check/src/app/api/auth/me/route.ts`
- `orbit-check/src/app/api/organizer/protected-test/route.ts`
- `orbit-check/src/app/api/attendee/protected-test/route.ts`
- `orbit-check/tests/auth.test.ts`
- `docs/ANTIGRAVITY_HANDOFF.md`

## 6. Next Incomplete Phase
- **Phase 3 — Event Creation, Registration, and Capacity Safety**: Implement organizer event creation and attendee event registration with atomic database-level capacity enforcement (`SERIALIZABLE` isolation / locked transaction) and 100+ concurrent registration proof script.
