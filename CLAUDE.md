# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Interactive showcase site for ICS UI Kit components — a gallery of example components with live previews and code viewing. Built with React 19, TypeScript, TanStack Start (with TanStack Router), and Vite 8.

Reference designs: shadcn/ui Blocks (file trees), Mantine UI (category pages), Radix Themes (theme switching), Tremor (complexity categories).

## Commands

- `pnpm dev` — Start dev server (port 3000)
- `pnpm build` — Build for production

No test runner or linter is configured yet.

## Architecture

**Framework**: TanStack Start — full-stack React framework with SSR, file-based routing, and server functions (`createServerFn`).

**Vite config** (`vite.config.ts`): Uses `tanstackStart()` plugin followed by `@vitejs/plugin-react`.

**Routing** (`src/router.tsx`): Creates router via `createRouter` from `@tanstack/react-router` using auto-generated route tree (`src/routeTree.gen.ts`).

**Routes** (`src/routes/`): File-based routing convention:
- `__root.tsx` — Root layout with `<html>`, `<head>`, `<body>` shell
- `index.tsx` — Home page, loads component data via server function

**Data layer** (`data/`): Server-side utilities for reading component examples from disk:
- `components.ts` — Scans `lib/` directory for component folders, reads source files and `attributes.json` metadata
- `types.ts` — Shared type definitions

**Component examples** (`lib/`): Each subfolder is a component example with `.tsx` source files and an `attributes.json` for metadata (category, changelog, etc.).

## Key Conventions

- Package manager: **pnpm** (packageManager field in package.json)
- Data fetching via TanStack Start server functions (`createServerFn`) called from route loaders
- Slugs are derived from PascalCase component names (e.g., `ButtonDemo` → `button-demo`)
- Component categories use three complexity levels: Controls (Контролы), Blocks (Блоки), Pages (Страницы)
