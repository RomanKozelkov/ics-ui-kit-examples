# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Interactive showcase site for ICS UI Kit components — a gallery of example components with live previews and code viewing. Built with React 19, TypeScript, Vite, Tailwind CSS 4, and React Router 7.

Reference designs: shadcn/ui Blocks (file trees), Mantine UI (category pages), Radix Themes (theme switching), Tremor (complexity categories).

## Commands

- `npm run dev` — Start Vite dev server with HMR
- `npm run build` — Type-check (`tsc -b`) then bundle with Vite
- `npm run lint` — ESLint across the project
- `npm run preview` — Preview production build locally

No test runner is configured yet.

## Architecture

**Routing** (`src/router.tsx`): Uses `createBrowserRouter` with a shared `Layout` wrapper. Three routes: `/` (HomePage), `/category/:slug` (CategoryPage), `/component/:slug` (ComponentPage).

**Layout** (`src/components/Layout.tsx`): Sticky header with navigation, renders child routes via `<Outlet>`.

**Pages** (`src/pages/`): Currently placeholder components that read URL params. Will be fleshed out per the roadmap stages.

**Examples** (`examples/`): Directory for component example source files. A prebuild script (not yet implemented) will scan this folder and generate `src/data/manifest.json` with metadata, file contents, and slugs.

**Scripts** (`scripts/`): Intended for the prebuild manifest generator.

## Key Conventions

- Tailwind CSS utilities applied directly to JSX elements (no CSS-in-JS, no separate CSS modules)
- Strict TypeScript: `noUnusedLocals`, `noUnusedParameters`, `noFallthroughCasesInSwitch` enabled
- ESLint flat config (v9) with typescript-eslint, react-hooks, and react-refresh plugins
- Component categories use three complexity levels: Controls (Контролы), Blocks (Блоки), Pages (Страницы)
- Slugs are derived from PascalCase component names (e.g., `ButtonDemo` → `button-demo`)

## Roadmap Context

The project follows staged implementation defined in `roadmap.md`. Stage 0 (scaffold) is complete. Upcoming stages: prebuild script → homepage → category page → component detail page → Shiki syntax highlighting → styling polish → deployment.
