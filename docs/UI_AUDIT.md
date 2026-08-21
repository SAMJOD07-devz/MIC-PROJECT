# OrbitCheck — UI Audit & Redesign Roadmap

## 1. Current Component Map & Render Locations

| UI Section / Feature | Component File | Description & State Handling |
| :--- | :--- | :--- |
| **Shared Shell & Navigation** | [`orbit-check/src/components/Header.tsx`](file:///c:/Users/SAUMYA/Desktop/WORK/MIC/orbit-check/src/components/Header.tsx)<br>[`orbit-check/src/app/page.tsx`](file:///c:/Users/SAUMYA/Desktop/WORK/MIC/orbit-check/src/app/page.tsx) | Sticky top navigation bar with logo, tab links (`events`, `tickets`, `organizer`, `scanner`), user profile info, logout button, and quick demo login shortcuts. |
| **Authentication Modal** | [`orbit-check/src/components/AuthModal.tsx`](file:///c:/Users/SAUMYA/Desktop/WORK/MIC/orbit-check/src/components/AuthModal.tsx) | Modal overlay handling email/password login, role registration (`ATTENDEE` / `ORGANIZER`), quick demo fills, and error banner notifications. |
| **Attendee Event Hub & Discovery** | [`orbit-check/src/components/AttendeeView.tsx`](file:///c:/Users/SAUMYA/Desktop/WORK/MIC/orbit-check/src/components/AttendeeView.tsx) | Top hero banner, available campus events grid cards with remaining capacity badges (`AVAILABLE` vs `EVENT FULL`), and 1-click atomic registration buttons. |
| **Attendee Personal QR Tickets** | [`orbit-check/src/components/AttendeeView.tsx`](file:///c:/Users/SAUMYA/Desktop/WORK/MIC/orbit-check/src/components/AttendeeView.tsx) | Rendered QR ticket cards with Base64 PNG images (`renderQrCodeDataUrl`), raw token IDs, event titles, and live check-in status badges (`REGISTERED` vs `CHECKED IN`). |
| **Organizer Command Console** | [`orbit-check/src/components/OrganizerView.tsx`](file:///c:/Users/SAUMYA/Desktop/WORK/MIC/orbit-check/src/components/OrganizerView.tsx) | Top action bar, active event selector list (left column), metric cards grid (right column), and event creation modal (`showCreateModal`). |
| **Live Metrics Cards & Roster** | [`orbit-check/src/components/OrganizerView.tsx`](file:///c:/Users/SAUMYA/Desktop/WORK/MIC/orbit-check/src/components/OrganizerView.tsx) | Displays Total Capacity, Registered Count, Checked-In Count, Check-In Rate %, No-Show Count, Peak Check-In Time, 3-second auto-polling stream, and live attendee roster list. |
| **QR Code Check-In Console** | [`orbit-check/src/components/OrganizerView.tsx`](file:///c:/Users/SAUMYA/Desktop/WORK/MIC/orbit-check/src/components/OrganizerView.tsx)<br>[`orbit-check/src/components/CameraScanner.tsx`](file:///c:/Users/SAUMYA/Desktop/WORK/MIC/orbit-check/src/components/CameraScanner.tsx) | Manual scan text input console inside `OrganizerView`, and full webcam scanner feed using `html5-qrcode` inside `CameraScanner`. Handles `201 SUCCESS`, `409 DUPLICATE`, and `404 INVALID` banners. |
| **Offline Outbox Queue** | [`orbit-check/src/components/CameraScanner.tsx`](file:///c:/Users/SAUMYA/Desktop/WORK/MIC/orbit-check/src/components/CameraScanner.tsx)<br>[`orbit-check/src/lib/offlineDb.ts`](file:///c:/Users/SAUMYA/Desktop/WORK/MIC/orbit-check/src/lib/offlineDb.ts) | IndexedDB (`Dexie.js`) outbox queue table displaying pending items, client idempotency keys, captured timestamps, network state badge (`Online` vs `Offline`), and auto-sync triggers (`/api/checkin/sync`). |
| **AI Insights Panel** | [`orbit-check/src/components/OrganizerView.tsx`](file:///c:/Users/SAUMYA/Desktop/WORK/MIC/orbit-check/src/components/OrganizerView.tsx)<br>[`orbit-check/src/app/api/events/[id]/insights/route.ts`](file:///c:/Users/SAUMYA/Desktop/WORK/MIC/orbit-check/src/app/api/events/[id]/insights/route.ts) | Sparkles button triggering `/api/events/[id]/insights`, rendering AI operational summary, actionable recommendations list, and ground-truth deterministic fallback badge (`isFallback: true`). |
| **Background Motion Layer** | [`orbit-check/src/components/MotionBackground.tsx`](file:///c:/Users/SAUMYA/Desktop/WORK/MIC/orbit-check/src/components/MotionBackground.tsx) | Floating 2D canvas particle & interconnecting node vector mesh background at `z-index: 0`. |

---

## 2. Current Design & Layout Deficiencies

1. **Heavy Dark Bordered Panels**: The current interface relies heavily on dark rectangular containers with uniform slate borders (`border-slate-800 bg-slate-900/60`), creating a boxed layout rather than a cohesive futuristic command center.
2. **Disconnected Motion Background**: The current particle background (`MotionBackground.tsx`) is purely decorative and does not reflect event network dynamics (node state, live check-in pulses, or orbital rings).
3. **Attendee Hub Spacing & Hierarchy**: The attendee view has large unused gaps, generic text cards, and lacks a visual visual focal point (e.g. an interactive 3D event orb / live ticket stage).
4. **Organizer Dashboard Visual Density**: The organizer view stacks event selection, metrics, AI insights, and scanner inputs without clear elevation layers, focal emphasis, or capacity ring progress charts.
5. **Visually Weak Empty States**: Empty outbox logs, event lists, and roster states use plain text strings (`"No events found"`) rather than styled empty states with contextual illustrations or call-to-action cards.
6. **Mobile Layout Constraints**: Scanner view and header tabs condense abruptly on smaller mobile screens (< 400px), requiring dedicated touch-friendly controls and responsive drawer navigation.

---

## 3. Reusable Components & Logic to Preserve Strictly

- **Authentication & Cookie State**: `useAuth`, `AuthModal.tsx`, JWT HTTP-only cookies, and role guards (`ORGANIZER` vs `ATTENDEE`).
- **Prisma PostgreSQL Data Flow**: Real API calls to `/api/events`, `/api/events/[id]/register`, `/api/tickets/me`, `/api/checkin`, `/api/checkin/sync`, `/api/events/[id]/export`, and `/api/events/[id]/insights`.
- **Atomic Concurrency Protection**: `CheckIn.registrationId UNIQUE` constraint error handling and 100+ race protection logic.
- **IndexedDB Offline Engine**: `Dexie.js` outbox schema (`src/lib/offlineDb.ts`) and idempotency key protocol.
- **Camera Decoder**: `html5-qrcode` integration and permission state handling in `CameraScanner.tsx`.

---

## 4. Accessibility & Responsive Issues

1. **Focus Rings & Contrast**: Input focus rings (`focus:border-cyan-500`) need higher contrast border outlines for keyboard navigation.
2. **Reduced Motion**: Motion background does not currently check `window.matchMedia('(prefers-reduced-motion: reduce)')`.
3. **Canvas Fallback**: 3D canvas layer must guarantee zero text clipping or button obstruction if WebGL fails or canvas context is unavailable.
4. **Touch Target Sizing**: Mobile buttons in `Header.tsx` and `CameraScanner.tsx` require minimum 44px touch targets.

---

## 5. Phase-by-Phase Redesign Order (Minimizing Regressions)

1. **Phase 2 — Design System & Tokens**: Define color tokens (midnight navy, electric cyan, violet, neon green/amber), glass surfaces, typography scale, capacity rings, status badges, and documentation in `docs/DESIGN_SYSTEM.md`.
2. **Phase 3 — Shared Shell & 3D Focal Scene**: Build responsive command center layout shell, brand mark, navigation tabs, and a 3D rotating event orb/constellation scene with WebGL fallback and reduced-motion support.
3. **Phase 4 — Attendee Event Hub Redesign**: Transform attendee view with event discovery cards, capacity rings, 1-click registration, and personal QR ticket presentation.
4. **Phase 5 — Organizer Command Console Redesign**: Build futuristic 2-column command console with live metrics cards, capacity progress ring, attendee roster, and CSV download.
5. **Phase 6 — Scanner, Offline Outbox & AI Insights Polish**: Enhance webcam scanner viewport, IndexedDB outbox queue status badges, Station A / Station B conflict alerts, and AI insights panel with suggested question chips.
6. **Phase 7 — Motion, Microinteractions & Responsive QA**: Add subtle card hover lifts, check-in pulse confirmation animations, reduced-motion overrides, and responsive QA at 390px, 768px, 1280px, 1440px.
7. **Phase 8 — Final Visual & Functional Verification**: Run full test suites, build production bundle, create `docs/UI_QA.md`, and complete handoff.
