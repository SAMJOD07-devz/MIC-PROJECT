# Antigravity Prompt — OrbitCheck Landing Page

Paste the prompt below into Antigravity. It is written to produce a richer version of the supplied OrbitCheck screenshot, inspired by the editorial polish of high-end Shopify and studio landing pages without copying any specific site.

```text
Build a production-quality, responsive React landing page for a campus events and QR check-in platform named OrbitCheck.

PROJECT GOAL
The supplied reference shows a very clean SaaS hero with a compact top navigation, a large display headline, a magenta-violet gradient phrase, and role-based demo buttons. Improve it so it feels less empty and more like a premium editorial design-studio case study. The final page should feel inhabited by real campus-event signals: rooms, clubs, capacity states, live arrivals, and attendee/organizer context.

DESIGN DIRECTION
Use a Kinetic Editorial Gallery aesthetic. Combine a dark graphite canvas (#16151a), warm ivory paper panels (#f0ede7 and #fbfaf6), Orbit Magenta (#e443b4), electric violet (#7a54ff), cobalt (#4b79ff), and vermilion (#f06f48). Use color as information: magenta for brand and active signals, violet for emphasis, cobalt for discovery/location, and vermilion only for urgency, capacity, check-in, or status. Do not use purple gradients everywhere, glassmorphism everywhere, or a generic centered SaaS layout.

TYPOGRAPHY
Use Syne for oversized editorial headlines, Space Grotesk for readable interface copy, and IBM Plex Mono for small labels and operational metrics. Headlines should be tight, oversized, and slightly irregular in an editorial way. Use uppercase mono labels such as “FIELD PREVIEW / CAMPUS LOOP”, “LIVE SIGNAL”, “HALL B CAPACITY”, and “FIELD NOTE 01”.

BRAND
Create a compact orbital O mark using two interlocking rounded loops and a small orbit dot; do not use the company name as the logo. Pair the mark with the wordmark “OrbitCheck”, with “Orbit” in white or graphite and “Check” in Orbit Magenta. Repeat the mark in the header, footer, modal, and a section stamp. Keep the identity recognizable even at favicon size.

PAGE STRUCTURE
1. Sticky or absolute top navigation over the hero. Include the OrbitCheck mark and wordmark, links for Platform, Live signal, and How it works, a sound toggle, Organizer demo, Attendee demo, and Sign in.
2. Hero section with a split asymmetric layout. On the left, use the eyebrow “LIVE EVENT OPERATING SYSTEM / EST. 2024”, the headline “Make every arrival count.” with only “arrival” in a magenta-to-violet gradient, short supporting copy, two role-based buttons, and the note “Built for the moment before the room fills.”
3. On the right, create a live campus event map / orbit field, not outer-space imagery. Use orbital paths and floating UI fragments, but make the dominant read campus-specific: “HALL B”, “NORTH QUAD”, “ROOM 04”, “DESIGN SOCIETY”, “82% capacity”, “+18 arrivals”, and “00:14 avg. scan”. A central live capacity signal should read 82%.
4. Add a dense live signal strip immediately below the hero with concrete metrics: “03 clubs live now”, “82% Hall B capacity”, “00:14 average check-in”, and “24/7 campus signal”. Keep this strip editorial and lightly structured, not a set of generic cards.
5. Add a warm paper section titled “Less queue. More campus.” with an asymmetric layout. Include three metrics: “01 shared event link”, “∞ ways to discover”, “0 duplicate entries”. The visual should be a deterministic campus live-map artifact made from HTML/CSS or SVG, with buildings, roads, pins, club names, and a highlighted live event rather than a stock image.
6. Add a dark organizer-control section titled “Know what is happening now.” Include a compact status card for “Design Society — Hall B”, “82%”, “156 checked in”, and “34 spots left”. Beside it, use three editorial feature rows: “Duplicate-proof by default”, “Capacity you can actually use”, and “A better front door for attendees”.
7. Add a paper workflow section titled “From signal to shared moment.” Show four offset field-note plates connected by thin hairlines and arrows: “Create the moment”, “Share one clear pass”, “Scan the arrival”, and “See the room”. Avoid a standard equal card grid; use stepped vertical offsets and asymmetric spacing.
8. Add a final warm editorial CTA panel on a dark section. Use “Make arrival feel effortless.” with two actions: “Open organizer demo” and “I’m here to attend”.
9. End with a dark footer containing the brand mark, a short note “Built for the people who make campus feel alive.”, compact links, system status, and “Made for the moment in between.”

INTERACTIONS
Use local demo behavior so no button is dead. Organizer demo, Attendee demo, and Sign in should open a modal role selector with Organizer and Attendee options. The modal should show role-specific copy and a Continue action. Navigation links should smooth-scroll to sections. The sound toggle should visibly switch between muted and active states even if no audio is connected. Add a subtle pointer-based parallax to the orbit field using CSS variables, clamped to a few pixels. Add gentle antigravity drift to floating signal fragments. Keep UI transitions between 160ms and 280ms and honor prefers-reduced-motion.

RESPONSIVE BEHAVIOR
On desktop, use a split hero with the orbit field on the right. On mobile, stack the copy above the orbit field, keep the hero headline readable, collapse the navigation to a menu button, keep the signal strip in two columns, stack the workflow plates vertically, and keep all buttons full-width where useful. Verify at 390px, 768px, and 1280px widths.

ACCESSIBILITY
Use semantic landmarks, meaningful button labels, keyboard-visible focus rings, aria-labels for icon buttons, sufficient contrast, and a dialog role for the modal. Do not rely on color alone to communicate status. Decorative orbit lines and imagery must be aria-hidden.

IMPLEMENTATION RULES
Use React with TypeScript and Tailwind or a clean CSS module system. Use lucide-react for interface icons. Keep major sections modular. Put the global style reminder at the top of every page/component/style file: “Kinetic Editorial Gallery — graphite + warm paper, editorial mono labels, Orbit Magenta signals, asymmetric layout, restrained antigravity motion.” Do not add fake testimonials, fake customer reviews, ratings, or invented user quotes. Do not use a generic hero stock photo. Do not use a repetitive 3-column SaaS card grid. Use generated visuals only as secondary accents; build the campus live-map artifact with code so labels stay crisp and editable.

QUALITY CHECK
Run typecheck and production build. Check that there are no dead buttons, no broken asset URLs, no horizontal overflow on mobile, and no unreadable text over backgrounds. The final result should feel like a real, premium campus-event product with a clear visual point of view rather than a template.
```

## Existing implementation handoff

The working project already contains a React/Tailwind implementation under `/home/ubuntu/orbitcheck-landing`. The main page is in `client/src/pages/Home.tsx`, the visual system is in `client/src/index.css`, the app shell is in `client/src/App.tsx`, and the font metadata is in `client/index.html`. The project has local demo interactions for organizer/attendee roles, smooth section navigation, a sound-state toggle, a CSS/SVG-style live campus map, responsive breakpoints, and reduced-motion behavior.

Generated visual assets are referenced by the working page with these project-lifecycle URLs:

| Asset | URL |
|---|---|
| Hero reference background | `/manus-storage/orbitcheck-hero-reference_1ed4a51f.png` |
| Orbit accent | `/manus-storage/orbitcheck-orb-accent_56bfb536.png` |
| Transparent orbital mark | `/manus-storage/orbitcheck-mark_5739bed4.png` |

If you move the project outside Manus, download or replace those assets before deployment. The transparent mark is intended for the header, footer, and favicon treatment.
