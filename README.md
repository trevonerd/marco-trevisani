# Marco Trevisani

[![CI](https://github.com/trevonerd/marco-trevisani/actions/workflows/ci.yml/badge.svg?branch=master)](https://github.com/trevonerd/marco-trevisani/actions/workflows/ci.yml)

Personal one-page site for [marcotrevisani.com](https://www.marcotrevisani.com), built as a modern Bun monorepo with a small internal design system.

## Stack

- Bun 1.3+
- Node 24
- Next.js 16
- React 19
- TypeScript
- Vitest
- Biome
- Husky
- Netlify
- `packages/alien-ui` design system primitives

## Scripts

```bash
bun install
bun run dev
bun run lint
bun run typecheck
bun run test
bun run build
```

## Structure

```txt
apps/site            Next.js app ready for Netlify
packages/alien-ui    Shared UI primitives and CSS tokens
```

## Deployment

Netlify builds from the repository root using Bun:

```bash
bun install --frozen-lockfile && bun run build
```

The exported Next.js output is published from `apps/site/out`.
