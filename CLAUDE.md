# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this project is

A beginner-oriented GML (GameMaker Language) course website built with Astro 6. Lessons are written as Markdown files and rendered via Astro's content collections.

## Commands

```sh
npm run dev       # Start dev server at localhost:4321
npm run build     # Build to ./dist/
npm run preview   # Preview the production build locally
npx astro check  # Type-check .astro files
```

Node >=22.12.0 required.

## Architecture

**Content pipeline:** Lesson content lives in `src/content/lessons/` as Markdown files. Each file is validated against the schema in `src/content.config.ts`, which requires `chapter` (number), `lesson` (number), `title` (string), `description` (string), and optionally `draft` (boolean, defaults to false).

**Routing:** `src/pages/lessons/[...slug].astro` uses `getStaticPaths` to generate one page per lesson. The slug comes from the file's `id` (its path within `src/content/lessons/`, without the extension). Lesson files are named `{chapter}-{lesson}-{kebab-title}.md` (e.g., `01-01-hello-gamemaker.md`).

**No UI framework or CSS framework** is in use — pages are plain HTML rendered by Astro. TypeScript is in strict mode (`astro/tsconfigs/strict`).

## Adding a lesson

1. Create `src/content/lessons/{chapter}-{lesson}-{slug}.md` with the required frontmatter fields.
2. The page will be available at `/lessons/{chapter}-{lesson}-{slug}` automatically — no routing changes needed.
