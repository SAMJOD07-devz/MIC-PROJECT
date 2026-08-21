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

## 3. Environment Variables
```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/orbitcheck?schema=public"
JWT_SECRET="orbitcheck-super-secret-jwt-key-2026"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
OPENAI_API_KEY="sk-demo-or-placeholder"
```

## 4. Key Commands
- **Development Server**: `cd orbit-check && npm run dev`
- **Generate Prisma Client**: `cd orbit-check && npx prisma generate`
- **Database Push / Seed**: `cd orbit-check && npx prisma db push && npx prisma db seed`
- **Typecheck**: `cd orbit-check && npx tsc --noEmit`
- **Push to GitHub**: `git add . && git commit -m "Phase 1: Foundation & Database Schema" && git push origin main`

## 5. Files Changed in Phase 1
- `orbit-check/package.json`
- `orbit-check/prisma/schema.prisma`
- `orbit-check/prisma.config.ts`
- `orbit-check/.env`
- `orbit-check/.env.example`
- `orbit-check/src/lib/env.ts`
- `orbit-check/src/lib/prisma.ts`
- `orbit-check/src/app/layout.tsx`
- `orbit-check/prisma/seed.ts`
- `docs/ANTIGRAVITY_HANDOFF.md`

## 6. Next Incomplete Phase
- **Phase 2 — Authentication and Enforced Roles**: Implement authentication endpoints (`/api/auth/register`, `/api/auth/login`, `/api/auth/me`), HTTP-only JWT cookies, and role-based authorization guards on the server side.
