# OrbitCheck Landing Page — Design Direction

## Three stylistic approaches

### Theme Name: Kinetic Editorial Gallery
Very brief intro: A dark, paper-textured, gallery-like landing page that treats campus events as cultural artifacts. The hero feels calm and substantial, while orbiting markers, editorial captions, and asymmetric modules add motion and density.
Probability: 0.04

### Theme Name: Sunlit Campus Ledger
Very brief intro: A warm off-white, cobalt, and ink-blue direction inspired by printed campus newspapers and wayfinding systems. It feels human, trustworthy, and information-rich without becoming corporate.
Probability: 0.07

### Theme Name: Color-Block Field Notes
Very brief intro: A bold Swiss-editorial system with oversized type, crisp panels, red-orange callouts, and generous asymmetric rules. It makes operational detail feel collectible and easy to scan.
Probability: 0.03

## Selected direction: Kinetic Editorial Gallery

### Design Movement
Contemporary digital editorial design with gallery-catalog composition, tactile paper texture, and restrained motion-design principles. The page should feel like a design studio case study for a product that happens to be useful every day.

### Core Principles
1. **Make the page feel inhabited.** Replace empty hero space with an orbiting constellation of real interface moments, event signals, captions, and contextual labels.
2. **Build hierarchy through scale and contrast.** Use a large display headline, small editorial annotations, and short data-led statements instead of repeated rounded cards.
3. **Keep the system tactile.** Use paper grain, hairline rules, imperfect circles, translucent material, and controlled shadows to make the interface feel physical.
4. **Use motion as orientation.** Antigravity-style floating elements should respond to pointer movement and scroll, but never compete with the headline or reduce readability.

### Color Philosophy
The base is a near-black graphite rather than pure black so the page feels printed and material. Warm ivory creates the editorial paper moments. Magenta-violet is the ownable brand energy, cobalt provides navigational clarity, and vermilion appears only as a signal color for check-in, capacity, or urgency. Bright color is used as information, not decoration.

### Layout Paradigm
Use an asymmetric, full-bleed editorial composition. The first viewport is split between a left copy rail and a right orbit field instead of a centered hero. Subsequent sections alternate between dark canvases and warm paper panels, with oversized numerals, offset captions, a diagonal event strip, and one wide feature image. Avoid repeated 3-column card grids; use staggered modules and horizontal flows instead.

### Signature Elements
- A thin orbital path that connects event markers across the hero and reappears as section dividers.
- Small mono editorial labels such as `LIVE / 07:42`, `CAPACITY / 82%`, and `FIELD NOTE 01`.
- Floating UI fragments with glass borders and a subtle gravitational wobble, layered over a dark canvas.

### Interaction Philosophy
Every action should feel like entering a live event system. Buttons respond with a short magnetic lift, event markers reveal context on hover, and the demo CTA opens a compact role selector rather than navigating to a dead link. Hover states should reveal more information with opacity, translation, and border-color changes; do not rely on color alone.

### Animation
Use a soft 12–18 second ambient drift for hero orbital objects with different phase offsets. Add a 180–240ms pointer-lift interaction on buttons and cards. Apply a low-amplitude parallax shift to the orbit field based on pointer position, clamped to a few pixels. Stagger section reveals by 40–70ms when they enter the viewport. Respect `prefers-reduced-motion` by removing drift and parallax while retaining instant state changes and focus rings.

### Typography System
Use `Syne` for display headlines, `Space Grotesk` for interface text, and `IBM Plex Mono` for labels and metrics. Headlines should be 72–132px on desktop with tight tracking and an italic or gradient emphasis only on one phrase. Body copy should be 16–19px with a 1.5 line-height. Mono labels should be 10–12px, uppercase, and letter-spaced.

### Brand Essence
OrbitCheck is the live operating layer for campus events, built for organizers and attendees who want check-in to feel immediate, social, and dependable. Personality: **observant, kinetic, reassuring**.

### Brand Voice
Headlines are direct, slightly cinematic, and grounded in real behavior. CTAs are specific and active. Microcopy uses short operational phrases that feel like field notes.

Example lines:
- “Turn the crowd into a clear signal.”
- “Scan in. Find your people. Keep moving.”

### Wordmark & Logo
Use the generated orbital O mark as a compact symbol. Pair it with a custom wordmark treatment: `Orbit` in bold display type and `Check` in a lighter italic or violet accent. The mark should sit in a small square tile with a subtle offset magenta/cobalt split so it remains recognizable at favicon scale.

### Signature Brand Color
**Orbit Magenta — `#E443B4`**. It is vivid enough to own the brand, but softened by graphite, cobalt, and warm ivory so the overall identity feels editorial rather than fluorescent.

## Page content map

1. Sticky navigation with mark, compact nav links, sound toggle, `Organizer demo`, `Attendee demo`, and a high-contrast sign-in action.
2. Hero: “The check-in layer for campus life.” Left-side copy rail; right-side orbit field with floating event cards, capacity metrics, and a live check-in pulse.
3. Live signal band: a dense horizontal strip of location, attendee, and capacity signals to establish that this is a living system.
4. Product story: alternating editorial sections for organizer control, attendee discovery, and duplicate-proof check-in.
5. Feature visual: wide image-backed module with a caption and three proof points.
6. Workflow section: `Create → Share → Scan → See the room` shown as a diagonal path rather than a standard card grid.
7. Final CTA: a warm paper panel with a large direct line and two role-specific actions.
8. Footer with compact navigation, product status, and a small no-fluff closing note.

## Implementation notes

- Use the provided generated visual asset URLs directly in React; do not copy assets into `client/public` or `client/src/assets`.
- Use CSS custom properties for the palette and clamp-based type sizes.
- Implement the hero parallax with a small pointer listener and CSS variables rather than a heavy animation library.
- All buttons must have working local behavior: demo buttons open a role selector, nav links scroll to sections, and the sound toggle visibly changes state.
- Add a small floating accessibility / reduced-motion control only if it can remain quiet and useful.

## Style Decisions

- The hero orbit field must read as a live campus event map, not outer-space imagery; orbital paths and floating UI fragments are acceptable only when room names, club activity, capacity, and check-in states remain the leading read.
- Orbit Magenta is the primary brand signal. Vermilion is reserved for urgency, capacity, check-in, or status moments and is not used as a broad decorative field.
- Major sections must carry at least one concrete campus/event artifact such as a room, club, role, capacity state, arrival signal, or field-note label.
- Workflow modules should feel like offset field-note plates with hairlines and diagonal continuity rather than a conventional SaaS feature-card grid.
