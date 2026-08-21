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
- **3D Motion Canvas Architecture**: HTML5 Canvas particle & node vector mesh motion background component (`src/components/MotionBackground.tsx`) and 3D luminous event orb constellation (`src/components/EventOrbScene.tsx`). Placed at `z-index: 0` with `pointer-events: none`; 100% of interactive scanner controls, metrics, text elements, and buttons remain in standard semantic HTML/DOM.

## 2. Completed Work
- **Phase 0 (Discovery & Architecture Contract)**: Created architecture blueprints (`docs/ARCHITECTURE.md`, `docs/ANTIGRAVITY_HANDOFF.md`).
- **Phase 1 (Foundation & Database Schema)**: Prisma PostgreSQL schema (`User`, `Event`, `Registration`, `CheckIn`, `IdempotencyRecord`) and seed dataset.
- **Phase 2 (Authentication & Enforced Roles)**: Password hashing (`bcryptjs`), JWT cookies, route middleware guards, unit tests (`tests/auth.test.ts` 6/6 passed).
- **Phase 3 (Event Creation, Registration & Capacity Safety)**: Atomic capacity lock (`POST /api/events/[id]/register`), 100+ concurrency script (`scripts/concurrency-registration.ts`), unit tests (`tests/events.test.ts` 3/3 passed).
- **Phase 4 (Unique QR Ticket & Anti-Sharing Strategy)**: Server-issued QR tokens, SHA-256 token hashing, Base64 DataURLs, anti-sharing documentation (`docs/SECURITY.md`), unit tests (`tests/qr.test.ts` 4/4 passed).
- **Phase 5 (Atomic Check-In & Duplicate Protection)**: Organizer check-in transaction (`POST /api/checkin`), 100+ duplicate scan concurrency proof (`scripts/concurrency-checkin.ts`), proof documentation (`docs/CONCURRENCY_PROOF.md`), unit tests (`tests/checkin.test.ts` 3/3 passed).
- **Phase 6 (Functional Frontend User Flows)**: Built `Header.tsx`, `AuthModal.tsx`, `OrganizerView.tsx`, `AttendeeView.tsx`, and `src/app/page.tsx`.
- **Phase 7 (Camera Scanning & Offline-First Outbox Sync)**: IndexedDB outbox manager (`src/lib/offlineDb.ts`), batch sync (`POST /api/checkin/sync`), live camera scanner (`src/components/CameraScanner.tsx`), documentation (`docs/OFFLINE_SYNC.md`), unit tests (`tests/offline-sync.test.ts` 3/3 passed).
- **Phase 8 (Live Operations Dashboard & CSV Export)**: CSV export (`GET /api/events/[id]/export`), live dashboard metrics (`GET /api/events/[id]/dashboard`), unit tests (`tests/dashboard-export.test.ts` 4/4 passed).
- **Phase 9 (Server-Side AI Event Insights)**: AI insights route (`POST /api/events/[id]/insights`), ground-truth injection, documentation (`docs/AI_INSIGHTS.md`), unit tests (`tests/ai-insights.test.ts` 3/3 passed).
- **Phase 10 (3D Visual Enhancement & Motion Layer)**: HTML5 node vector mesh Canvas background (`MotionBackground.tsx`).
- **Phase 11 (Final Verification, Evidence Suite & Polish)**: Executed complete automated verification suite (26/26 unit tests passed, 2/2 concurrency scripts passed, zero `tsc` errors), authored evidence report in `docs/VERIFICATION_SUITE.md`.
- **UI Redesign Phase 1 (UI Audit)**: Documented UI component map, design deficiencies, accessibility issues, and redesign order in `docs/UI_AUDIT.md`.
- **UI Redesign Phase 2 (Design System & Tokens)**: Established design system tokens, color palettes, glass elevation levels, border radius, typography scale, component tokens, button variants, status badges, metric cards, skeleton states, and reduced-motion rules in `docs/DESIGN_SYSTEM.md`.
- **UI Redesign Phase 3 (Shared Shell & 3D Scene)**: Built 3D luminous node constellation scene (`src/components/EventOrbScene.tsx`) and futuristic responsive navigation header (`src/components/Header.tsx`).
- **UI Redesign Phase 4 (Attendee Event Hub)**: Redesigned attendee experience with hero banner, 3D orb card, styled empty state, capacity progress bars, and high-contrast personal QR ticket presentation (`src/components/AttendeeView.tsx`).
- **UI Redesign Phase 5 (Organizer Command Console)**: Redesigned organizer view into a 2-column operational command center with live metric cards, peak check-in calculation, capacity fill progress, live roster, and CSV download (`src/components/OrganizerView.tsx`).
- **UI Redesign Phase 6 (Scanner, Offline Outbox & AI Interactions)**: Redesigned camera scanner feed viewport, manual token testing input, IndexedDB outbox table, and AI Insights query panel with 4 suggested question chips (`src/components/CameraScanner.tsx`, `src/components/OrganizerView.tsx`).
- **UI Redesign Phase 7 & 8 (Motion QA, Verification & Final Delivery)**: Verified reduced-motion support, WebGL context loss fallback, mobile responsiveness (390px, 768px, 1280px, 1440px), 26/26 unit tests passed, zero TypeScript errors, authored `docs/UI_QA.md`.

## 3. Environment Variables (Secret files like `.env` are git-ignored)
```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/orbitcheck?schema=public"
JWT_SECRET="orbitcheck-super-secret-jwt-key-2026"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
OPENAI_API_KEY="sk-demo-or-placeholder"
```

## 4. Key Commands
- **Development Server**: `cd orbit-check && npm run dev`
- **Run All Unit Tests**: `cd orbit-check && npx tsx tests/auth.test.ts && npx tsx tests/events.test.ts && npx tsx tests/qr.test.ts && npx tsx tests/checkin.test.ts && npx tsx tests/offline-sync.test.ts && npx tsx tests/dashboard-export.test.ts && npx tsx tests/ai-insights.test.ts`
- **Typecheck**: `cd orbit-check && npx tsc --noEmit`
- **Push Final UI Redesign to GitHub**: `git add . && git commit -m "UI Redesign Complete: Futuristic Campus Command Center" && git push origin main`

## 5. Changed Files in UI Redesign Final Pass
- `orbit-check/src/components/EventOrbScene.tsx`
- `orbit-check/src/components/Header.tsx`
- `orbit-check/src/components/AttendeeView.tsx`
- `orbit-check/src/components/OrganizerView.tsx`
- `orbit-check/src/components/CameraScanner.tsx`
- `docs/UI_QA.md`
- `docs/ANTIGRAVITY_HANDOFF.md`

## 6. System Status
- **UI REDESIGN & PLATFORM STATUS**: 100% COMPLETE & FULLY VERIFIED
