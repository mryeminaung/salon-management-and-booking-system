# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

SalonHub — a premium salon management and booking system. Next.js 16 (App Router) + React 19 frontend with Tailwind CSS v4, shadcn/ui (base-nova style), and next-themes for dark/blush theme switching.

## Commands

```bash
pnpm dev          # Start dev server (http://localhost:3000)
pnpm build        # Production build
pnpm lint         # ESLint
```

## Architecture

### Feature-Based Folder Structure

```
src/
├── app/                    # Next.js App Router pages
├── components/             # Shared only (ui/, layout, theme)
│   ├── ui/                 # shadcn/ui components
│   ├── theme-provider.tsx
│   └── theme-toggle.tsx
├── features/               # Feature modules
│   └── <feature-name>/
│       ├── components/     # Feature-specific components
│       ├── api/            # API client functions
│       ├── hooks/          # Feature-specific hooks
│       └── index.ts        # Barrel export
├── lib/                    # Utilities (cn helper)
└── types/                  # Shared TypeScript types
```

**Rule:** `src/components/` = shared, layout, shadcn/ui only. Feature-specific code goes in `src/features/<name>/`.

### Imports

```typescript
// From feature barrel (preferred)
import { Hero, Navbar } from "@/features/landing";

// From shared UI
import { buttonVariants } from "@/components/ui/button";
```

### Key Technical Details

- **Tailwind CSS v4**: No `tailwind.config.ts`. Theme is configured in `src/app/globals.css` via `@theme inline` directive. Custom colors: `gold` (#D4AF37), `gold-light` (#8B6F47).
- **Themes**: Two palettes via next-themes — "dark" (default, Luxe Dark) and "blush" (Elegant Blush). Dark mode toggled via `.dark` class.
- **Fonts**: Playfair Display (`--font-sans`), Geist Mono (`--font-geist-mono`). Custom font file at `src/app/_fonts/InstrumentSans.ttf`.
- **shadcn/ui**: base-nova style, lucide icons. Add new components via `pnpm dlx shadcn@latest add <component>`.
- **Path alias**: `@/*` maps to `./src/*`.
- **Remote images**: Only `images.unsplash.com` allowed (configured in `next.config.ts`).
- **Package manager**: pnpm (not a workspace monorepo).

## Contributing

See [CONTRIBUTING.md](../CONTRIBUTING.md) for branch naming, commit conventions, and PR guidelines.
