# Architecture

## Tech Stack
- Framework: Next.js 15 (App Router)
- Language: TypeScript
- Styling: Tailwind CSS
- Animation: Framer Motion
- Hosting: Vercel / Firebase Hosting
- BaaS: Firebase (Analytics, etc.)

## Folder Structure
- `src/app`: Next.js pages and layouts
- `src/components`: Reusable UI components
- `src/lib`: Utilities and Firebase config
- `docs/`: Project documentation and guides
- `public/`: Static assets (images, fonts)

## Data Flow
Static content will be hardcoded in the components for this version to ensure speed. Firebase is initialized for Analytics.

## State Management
- `framer-motion` for complex scroll reveals and animations.
- Custom cursor state managed via a React Context or a top-level layout wrapper using `useState`/`useEffect` attached to window events.
