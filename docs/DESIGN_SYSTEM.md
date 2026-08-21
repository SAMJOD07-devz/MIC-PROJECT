# OrbitCheck — Visual Design System & Component Tokens

## 1. Color Palette Tokens

OrbitCheck uses a deep midnight command-center theme with high-contrast typography, electric cyan/indigo core accents, and status-driven visual feedback.

| Token | Hex / HSL Value | Usage Purpose |
| :--- | :--- | :--- |
| `--bg-midnight` | `#070A12` / `hsl(225, 45%, 5%)` | Deep midnight main background |
| `--bg-surface-glass` | `rgba(15, 23, 42, 0.7)` | Translucent glass surface cards with backdrop filter |
| `--bg-surface-elevated` | `rgba(30, 41, 59, 0.85)` | Modal windows, elevated cards, and active dropdowns |
| `--border-subtle` | `rgba(51, 65, 85, 0.5)` | Soft structural dividing lines |
| `--border-accent-cyan` | `rgba(6, 182, 212, 0.4)` | Focus outlines, scanner frames, active tab borders |
| `--text-primary` | `#F8FAFC` | Main headings, primary values, active tab text |
| `--text-secondary` | `#94A3B8` | Subtitles, event descriptions, metadata labels |
| `--text-muted` | `#64748B` | Timestamps, secondary badge text, disabled labels |
| `--accent-cyan` | `#06B6D4` | Scanner target frames, active status indicators |
| `--accent-indigo` | `#6366F1` | Primary CTA buttons, AI insights branding |
| `--accent-violet` | `#8B5CF6` | Highlights, 3D orb node glow |
| `--status-success` | `#10B981` | Check-in successful (`201`), capacity open badge |
| `--status-warning` | `#F59E0B` | Offline queued outbox, registered (pending check-in) |
| `--status-error` | `#EF4444` | Duplicate scan rejected (`409`), event full (`409`), invalid token |

---

## 2. Typography Scale & Font Weights

- **Primary Font**: `Geist Sans`, `Inter`, system-ui
- **Monospace Font**: `Geist Mono`, `JetBrains Mono` (used for Token IDs, hashes, timestamps, and idempotency keys)

| Level | Size / Line Height | Font Weight | Applied Context |
| :--- | :--- | :--- | :--- |
| `Display Title` | 24px / 32px | `800 Extrabold` | Header brand mark, event hub hero title |
| `Section Heading`| 18px / 24px | `700 Bold` | Organizer Console, Event Discovery, Scanner Header |
| `Card Title` | 15px / 20px | `600 Semibold` | Event card title, metric card header, ticket title |
| `Body Text` | 13px / 18px | `400 Regular` | Event descriptions, form field labels, modal body |
| `Caption / Badge`| 11px / 14px | `600 Semibold` | Status badges, capacity counters, timestamp labels |
| `Code / Mono` | 11px / 14px | `500 Medium` | QR token IDs, SHA-256 hashes, idempotency keys |

---

## 3. Surface Elevation & Volumetric Glow Rules

```css
/* Glass Surface Elevation Level 1 */
.glass-panel {
  background: rgba(15, 23, 42, 0.7);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid rgba(51, 65, 85, 0.5);
  border-radius: 1rem;
}

/* Glass Surface Elevation Level 2 (Hover / Active) */
.glass-panel-elevated {
  background: rgba(30, 41, 59, 0.85);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border: 1px solid rgba(6, 182, 212, 0.3);
  box-shadow: 0 10px 30px -10px rgba(6, 182, 212, 0.15);
  border-radius: 1rem;
}

/* Restrained Volumetric Cyan Glow */
.glow-cyan {
  box-shadow: 0 0 25px -5px rgba(6, 182, 212, 0.25);
}
```

---

## 4. Reusable UI Primitives & Component Specifications

### 4.1 Button Variants
- **Primary CTA (`.btn-primary`)**: Gradient from `#2563EB` to `#4F46E5`, white bold text, cyan glow on hover, rounded `12px`.
- **Secondary CTA (`.btn-secondary`)**: Translucent background `rgba(30, 41, 59, 0.8)`, cyan text, cyan border, hover glow.
- **Danger CTA (`.btn-danger`)**: Translucent rose background `rgba(239, 68, 68, 0.1)`, red text, red border.

### 4.2 Status Badges
- **Success (`Checked In` / `Open`)**: Background `rgba(16, 185, 129, 0.1)`, text `#34D399`, border `rgba(16, 185, 129, 0.3)`.
- **Pending / Offline (`Registered` / `Queued`)**: Background `rgba(245, 158, 11, 0.1)`, text `#FBBF24`, border `rgba(245, 158, 11, 0.3)`.
- **Duplicate / Rejected (`Already Checked In` / `Full`)**: Background `rgba(239, 68, 68, 0.1)`, text `#F87171`, border `rgba(239, 68, 68, 0.3)`.

### 4.3 Capacity Progress Ring
- SVG circular ring showing `(registeredCount / capacity) * 100%`.
- Stroke color transitions from Cyan (`< 75%`), Indigo (`75-99%`), to Neon Rose (`100% FULL`).

### 4.4 Styled Empty & Loading States
- **Loading Skeleton**: Shimmering translucent pulse container (`animate-pulse bg-slate-800/50`).
- **Empty State Card**: Rendered with contextual SVG icon badge, title, subtitle explanation, and action button (e.g. "Browse Events").

---

## 5. Reduced-Motion & WebGL Fallback Rules

1. **Reduced Motion (`prefers-reduced-motion: reduce`)**:
   - Disables continuous rotation of the 3D event orb background canvas.
   - Disables pulse wave animations on check-in alerts and capacity rings.
2. **WebGL / Canvas Fallback**:
   - If WebGL or 2D canvas context is disabled/unsupported, falls back gracefully to CSS radial background gradients (`bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/20 via-slate-950 to-slate-950`).
