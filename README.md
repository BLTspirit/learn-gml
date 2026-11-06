# Learn GML

This is the skeleton of a learning resource I am building using Claude Code and Astro. The goal is to flesh it out with some tutorials that teach people how to code using GML (GameMaker Language).


  UI features

- Fixed sidebar with chapters + nested lessons, sorted by chapter/lesson number
- Collapsible sidebar — state persisted in localStorage
- Dark mode default + light mode toggle (ThemeToggle.astro)
- Per-lesson completion tracking via localStorage (completed:{lessonId}), rendered as indicators in the sidebar

  Content authoring

- Markdown (.md) lessons rendered through Astro content collections
- MDX lessons can import and embed Svelte 5 components

  Styling

- CSS custom properties derived from the free HTML5UP Phantom template
- Source Sans 3 via Google Fonts

  Build

- Static output (output: "static")
