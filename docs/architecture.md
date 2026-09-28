# ShipIt Architecture

## Tech Stack
- **Framework**: Next.js (App Router likely, based on modern standards, but checking `src/app` or `src/pages` to confirm).
- **Language**: TypeScript (`.tsx`, `.ts`).
- **Styling**: Tailwind CSS for rapid utility classes. Vanilla CSS / globals.css for custom grid overlays, cursor styles, and marquee animations if needed.
- **Animations**: Framer Motion for scroll reveal animations and micro-interactions.

## Component Structure

- `src/components/`
  - `Navbar.tsx` (Sticky navigation with persistent CTA)
  - `Hero.tsx` (Level 00: Marquee, big bold headers)
  - `Manifesto.tsx` (Level 01: Mission statement)
  - `WhatWeDo.tsx` (Level 02: Card grid, projects, hacks)
  - `Experiences.tsx` (Level 03: Recurring events, photos)
  - `FinalBoss.tsx` (Level 04: Closing CTA, selectivity framing)
  - `Footer.tsx` (Simple footer)
  - `CustomCursor.tsx` (Mouse follower component)

## Design System

- **Typography**: Raw, monospace or heavy sans-serif. Large, bold, all-caps.
- **Colors**: Black, white, maybe a single high-contrast accent color (e.g., neon green or hazard orange). High contrast is a must.
- **Layout**: 
  - Subtle grid overlay background.
  - Numbered sections ("01 // ...").
  - Content should feel fast, snappy, and slightly brutalist.

## Performance & Accessibility

- Use `next/image` for any photos.
- Ensure text contrast ratios are sufficient.
- Add `aria-labels` to complex interactive elements.
- Respect `prefers-reduced-motion` for Framer Motion animations.
