# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this project is

A beginner-oriented GML (GameMaker Language) course website built with Astro 6. Lessons are Markdown files rendered via Astro's content collections. The site is a companion to [noahs.games](https://noahs.games) and will live on a subdomain of it, hosted on Netlify.

## Commands

```sh
npm run dev       # Start dev server at localhost:4321
npm run build     # Build to ./dist/
npm run preview   # Preview the production build locally
npx astro check  # Type-check .astro files (requires @astrojs/check)
```

Node >=22.12.0 required.

## Architecture

### Content collections

Two collections defined in `src/content.config.ts`:

- **`lessons`** — `src/content/lessons/*.md`. Required frontmatter: `chapter` (number), `lesson` (number), `title`, `description`, `draft` (boolean, default false). Files named `{chapter}-{lesson}-{kebab-title}.md`.
- **`chapters`** — `src/content/chapters/*.md`. Required frontmatter: `chapter` (number), `title`, `description`. One file per chapter.

### Routing

- `/lessons/[...slug]` — `src/pages/lessons/[...slug].astro`. Slug is the lesson file's `id` (path without extension). Uses `getStaticPaths` over the `lessons` collection.
- Chapter pages (`/chapters/[n]`) are deferred — not yet implemented.

### Layouts

- `src/layouts/BaseLayout.astro` — HTML shell. Imports `global.css`, runs the theme script inline (no defer) to prevent flash of wrong theme, accepts `title` and `description` props.
- `src/layouts/LessonLayout.astro` — Fetches all chapters and lessons at build time, renders `<Sidebar>` + a main content slot. Used by every lesson page.

### Components

- `src/components/Sidebar.astro` — Fixed left nav. Renders chapters sorted by `chapter` number, with lessons nested and sorted by `lesson` number. Highlights the current lesson via `aria-current="page"`. A client-side `<script>` reads `localStorage` keys (`completed:{lessonId}`) and adds a `.completed` class for completed lessons.
- `src/components/ThemeToggle.astro` — Button inside the sidebar. Toggles `data-theme` on `<html>` and persists the choice to `localStorage`.

### Styling

`src/styles/global.css` uses CSS custom properties derived from the [HTML5UP Phantom template](https://html5up.net/phantom) to match the visual language of noahs.games:

| Variable | Value | Source |
|---|---|---|
| `--sidebar-bg` | `#585858` | Phantom menu color |
| `--sidebar-accent` | `#f2849e` | Phantom accent (pink) |
| `--bg` (dark) | `#1e1e1e` | Extended dark surface |
| `--bg` (light) | `#ffffff` | Phantom light bg |
| `--font` | Source Sans 3 | Phantom's font (via Google Fonts) |
| `--radius` | `4px` | Phantom border-radius |
| `--transition` | `0.2s ease` | Phantom transition |

Dark mode is the default. The sidebar always uses `#585858` in both modes. Light mode only changes `--bg` (main content area).

### Theme system

`src/scripts/theme.ts` is a two-line script inlined into `<head>` via `is:inline set:html`. It reads `localStorage('theme')` and sets `data-theme` on `<html>` before first paint. The toggle button updates the attribute and re-saves to localStorage.

### Lesson completion tracking

Stored in `localStorage` with keys `completed:{lessonId}` = `'true'`. Read client-side in `Sidebar.astro` to show completion indicators. No backend required.

## Adding a lesson

1. Create `src/content/lessons/{chapter}-{lesson}-{slug}.md` with the required frontmatter.
2. The page appears at `/lessons/{chapter}-{lesson}-{slug}` automatically.

## Adding a chapter

1. Create `src/content/chapters/{n}-{slug}.md` with `chapter`, `title`, and `description` frontmatter.
2. The chapter will appear in the sidebar automatically. The chapter intro page (`/chapters/{n}`) is not yet implemented.
