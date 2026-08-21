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
- **Anti-Sharing QR Strategy**: Server-bound opaque token payload containing registration UUID, event ID, attendee ID, and salt; stored as SHA-256 hash (`qrTokenHash`). Rendered dynamically via Base64 SVG/PNG DataURLs. One-time consumption enforced upon check-in.
- **Atomic Duplicate Check-In Strategy**: `CheckIn.registrationId UNIQUE` DB constraint + `$transaction` ensures that even across multiple parallel Node server processes, exactly 1 scan succeeds and all duplicate attempts return status `409 ALREADY_CHECKED_IN` with the original check-in timestamp.
- **UI Architecture**: Dark navy futuristic campus command center theme, glassmorphism containers, responsive role-based navigation, explicit state notifications (`SUCCESS`, `DUPLICATE`, `FULL`, `INVALID_TOKEN`).
- **Offline Outbox Architecture**: IndexedDB storage via `Dexie.js` storing scan events with client UUID idempotency keys (`idempotencyKey`), device ID, and timestamp. Reconnect auto-sync flushes to batch endpoint `/api/checkin/sync`. Server authority resolves Station A / Station B races cleanly.
- **Live Operations & CSV Export Architecture**: Realtime live metrics (Capacity, Registered, Checked In, No-Show Count, Check-In Rate %, Peak Check-In Time calculation), modest auto-polling interval with WebSocket/SSE ready foundation, and secure organizer-only CSV roster export endpoint `GET /api/events/[id]/export`.
- **AI Insights Architecture**: Ground-truth metric pre-computation via Prisma SQL injection, read-only LLM system prompt isolation, and deterministic rule-based fallback when LLM API keys are unconfigured/demo (`isFallback: true`).
- **3D Motion Canvas Architecture**: HTML5 Canvas particle & node vector mesh motion background component (`src/components/MotionBackground.tsx`). Placed at `z-index: 0` with `pointer-events: none`; 100% of interactive scanner controls, metrics, text elements, and buttons remain in standard semantic HTML/DOM.

## 2. Completed Work
- **Phase 0 (Discovery & Architecture Contract)**:
  - Runtime verified: Node v24.14.0, npm 11.9.0.
  - Created `docs/ARCHITECTURE.md` and `docs/ANTIGRAVITY_HANDOFF.md`.
- **Phase 1 (Foundation & Database Schema)**:
  - Confirmed existing Next.js App Router scaffold at `orbit-check/`.
  - Installed dependencies: `@prisma/client@7.9.1`, `prisma@7.9.1`, `zod`, `bcryptjs`, `dotenv`, `tsx`, `@types/bcryptjs`.
  - Created `prisma/schema.prisma` with PostgreSQL models for `User`, `Event`, `Registration`, `CheckIn`, and `IdempotencyRecord`.
  - Configured `prisma.config.ts`, `.env`, `.env.example`, `src/lib/env.ts`, `src/lib/prisma.ts`.
  - Created initial seed dataset in `prisma/seed.ts`.
- **Phase 2 (Authentication & Enforced Roles)**:
  - Built password hashing (`bcryptjs`) & JWT session manager (`jsonwebtoken`) in `src/lib/auth.ts`.
  - Created API endpoints: `/api/auth/register`, `/api/auth/login`, `/api/auth/logout`, `/api/auth/me`, `/api/organizer/protected-test`, `/api/attendee/protected-test`.
  - Implemented Next.js route protection middleware (`src/middleware.ts`).
  - Added automated test suite `tests/auth.test.ts` (6/6 passed).
- **Phase 3 (Event Creation, Registration & Capacity Safety)**:
  - Installed `@prisma/adapter-pg` & `pg`.
  - Built event endpoints: `POST /api/events`, `GET /api/events`, `GET /api/events/[id]`, `POST /api/events/[id]/register`.
  - Built 100+ concurrent registration capacity safety proof script (`scripts/concurrency-registration.ts`).
  - Added automated unit test suite `tests/events.test.ts` (3/3 passed).
- **Phase 4 (Unique QR Ticket & Anti-Sharing Strategy)**:
  - Installed `qrcode` and `@types/qrcode`.
  - Created QR generation & SHA-256 hashing helper in `src/lib/qr.ts`.
  - Created attendee personal tickets endpoint `GET /api/tickets/me` (renders Base64 QR DataURLs).
  - Created ticket validation service endpoint `POST /api/tickets/validate`.
  - Documented security tradeoffs & anti-sharing model in `docs/SECURITY.md`.
  - Added automated unit test suite `tests/qr.test.ts` (4/4 passed).
- **Phase 5 (Atomic Check-In & Duplicate Protection)**:
  - Implemented organizer check-in endpoint `POST /api/checkin` with atomic `$transaction` and `CheckIn.registrationId UNIQUE` protection.
  - Built 100+ duplicate scan concurrency proof script (`scripts/concurrency-checkin.ts`).
  - Created concurrency proof documentation in `docs/CONCURRENCY_PROOF.md`.
  - Added automated unit test suite `tests/checkin.test.ts` (3/3 passed).
- **Phase 6 (Functional Frontend User Flows)**:
  - Installed `lucide-react`.
  - Built `Header.tsx`, `AuthModal.tsx`, `OrganizerView.tsx`, `AttendeeView.tsx`, and `src/app/page.tsx`.
- **Phase 7 (Camera Scanning & Offline-First Outbox Sync)**:
  - Installed `dexie` and `html5-qrcode`.
  - Built IndexedDB outbox manager in `src/lib/offlineDb.ts`.
  - Built batch sync endpoint `POST /api/checkin/sync` with idempotency record caching.
  - Built live camera scanner component `src/components/CameraScanner.tsx`.
  - Documented Station A / Station B race resolution in `docs/OFFLINE_SYNC.md`.
  - Added automated unit test suite `tests/offline-sync.test.ts` (3/3 passed).
- **Phase 8 (Live Operations Dashboard & CSV Export)**:
  - Built organizer CSV export endpoint `GET /api/events/[id]/export`.
  - Built live dashboard metrics endpoint `GET /api/events/[id]/dashboard`.
  - Updated `OrganizerView.tsx` with live metric cards and 1-click CSV download.
  - Added automated unit test suite `tests/dashboard-export.test.ts` (4/4 passed).
- **Phase 9 (Server-Side AI Event Insights)**:
  - Built organizer AI insights endpoint `POST /api/events/[id]/insights`.
  - Authored documentation in `docs/AI_INSIGHTS.md`.
  - Added automated unit test suite `tests/ai-insights.test.ts` (3/3 passed).
- **Phase 10 (3D Visual Enhancement & Motion Layer)**:
  - Built node vector mesh Canvas background `MotionBackground.tsx`.
  - Mounted background canvas in `src/app/page.tsx` behind all DOM elements.

## 3. Environment Variables (Secret files like `.env` are git-ignored)
```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/orbitcheck?schema=public"
JWT_SECRET="orbitcheck-super-secret-jwt-key-2026"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
OPENAI_API_KEY="sk-demo-or-placeholder"
```

## 4. Key Commands
- **Development Server**: `cd orbit-check && npm run dev`
- **Typecheck**: `cd orbit-check && npx tsc --noEmit`
- **Push Phase 10 to GitHub**: `git add . && git commit -m "Phase 10: 3D Visual Enhancement and Motion Layer" && git push origin main`

## 5. Files Changed in Phase 10
- `orbit-check/src/components/MotionBackground.tsx`
- `orbit-check/src/app/page.tsx`
- `docs/ANTIGRAVITY_HANDOFF.md`

## 6. Next Incomplete Phase
- **Phase 11 — Final Verification, Evidence Suite & Polish**: Run complete end-to-end automated verification script covering all unit test suites (`tests/*.test.ts`), concurrency scripts (`scripts/*.ts`), typecheck (`tsc --noEmit`), and generate final evidence report in `docs/VERIFICATION_SUITE.md`.
