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

- **`lessons`** — `src/content/lessons/*.{md,mdx}`. Required frontmatter: `chapter` (number), `lesson` (number), `title`, `description`, `draft` (boolean, default false). Files named `{chapter}-{lesson}-{kebab-title}.{md,mdx}`. Use `.mdx` when the lesson embeds interactive Svelte demos.
- **`chapters`** — `src/content/chapters/*.md`. Required frontmatter: `chapter` (number), `title`, `description`. One file per chapter.

### Routing

- `/lessons/[...slug]` — `src/pages/lessons/[...slug].astro`. Slug is the lesson file's `id` (path without extension). Uses `getStaticPaths` over the `lessons` collection, filters out drafts, and sorts by chapter+lesson to wire prev/next nav buttons.
- `/chapters/[n]` — `src/pages/chapters/[n].astro`. Renders a chapter intro page from `src/content/chapters/`.
- `/sandbox` and `/sandbox/[demo]` — Dev-only playground for iterating on demo components (see "Interactive demos" below).

### Layouts

- `src/layouts/BaseLayout.astro` — HTML shell. Imports `global.css`, runs the theme script inline in `<head>` (no defer) to prevent flash of wrong theme, accepts `title` and `description` props. A second inline script at the top of `<body>` restores `data-sidebar-collapsed` from localStorage before paint.
- `src/layouts/LessonLayout.astro` — Fetches all chapters and lessons at build time, renders `<Sidebar>` + a main content slot. Owns the sidebar collapse toggle button (`#sidebar-toggle`) which slides the sidebar off-screen via `body[data-sidebar-collapsed]`.

### Components

- `src/components/Sidebar.astro` — Fixed left nav. Renders chapters sorted by `chapter` number, with lessons nested and sorted by `lesson` number. Highlights the current lesson via `aria-current="page"`. A client-side `<script>` reads `localStorage` keys (`completed:{lessonId}`) and adds a `.completed` class for completed lessons.
- `src/components/ThemeToggle.astro` — Button inside the sidebar. Toggles `data-theme` on `<html>` and persists the choice to `localStorage`.
- `src/components/SandboxLoader.svelte` — Svelte wrapper that dynamically imports a demo by name via `import.meta.glob`. Used by `/sandbox/[demo]` so Astro only needs to hydrate one statically-known Svelte island.

### Interactive demos

Lessons can embed interactive components via Svelte 5 + MDX (integrations: `@astrojs/svelte`, `@astrojs/mdx`).

- All demo components live in `src/components/demos/*.svelte` — single source of truth, used by both the sandbox and lessons.
- The sandbox at `/sandbox` auto-discovers every `.svelte` file in that folder via `import.meta.glob` and lists them. Each demo gets an isolated full-page route at `/sandbox/{name}` (`client:load` for instant hydration while iterating).
- Files starting with `_` (e.g. `_template.svelte.txt`) are ignored — used for templates/scratch.
- To use a demo in a lesson: rename the lesson to `.mdx`, then `import Demo from '../../components/demos/Demo.svelte';` and use `<Demo client:visible />`.
- Astro can't determine the renderer for components passed dynamically through props — this is why dynamic resolution lives inside `SandboxLoader.svelte` rather than the Astro page itself.

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

1. Create `src/content/lessons/{chapter}-{lesson}-{slug}.md` (or `.mdx` for interactive demos) with the required frontmatter.
2. The page appears at `/lessons/{chapter}-{lesson}-{slug}` automatically. Sidebar entry and prev/next buttons wire up by chapter+lesson order.

## Adding a chapter

1. Create `src/content/chapters/{n}-{slug}.md` with `chapter`, `title`, and `description` frontmatter.
2. The chapter appears in the sidebar and at `/chapters/{n}` automatically.

## Adding an interactive demo

1. Drop a new `MyDemo.svelte` file into `src/components/demos/`.
2. Iterate at `/sandbox/MyDemo` — HMR updates on every save.
3. To use it in a lesson, rename that lesson to `.mdx`, then add `import MyDemo from '../../components/demos/MyDemo.svelte';` after the frontmatter and `<MyDemo client:visible />` in the body.

## Operational notes

- Content collections cache aggressively in `.astro/`. After renaming files, changing `content.config.ts`, or switching extensions (e.g. `.md` → `.mdx`), restart `npm run dev` and clear `.astro/` + `node_modules/.vite/` if changes don't show up.
- If a stale dev server is bound to port 4321 (often after editing config), `taskkill //F //PID <pid>` it before restarting — pkill from Git Bash often misses Windows node processes.
