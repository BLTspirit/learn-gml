<script lang="ts">
  type Cell = { x: number; y: number; wall: boolean };

  let { cols = 12, rows = 8, cellSize = 32 } = $props<{
    cols?: number;
    rows?: number;
    cellSize?: number;
  }>();

  let cells: Cell[] = $state(
    Array.from({ length: cols * rows }, (_, i) => ({
      x: i % cols,
      y: Math.floor(i / cols),
      wall: false,
    }))
  );

  let painting: 'add' | 'remove' | null = $state(null);

  function paint(c: Cell) {
    if (painting === 'add') c.wall = true;
    else if (painting === 'remove') c.wall = false;
  }

  function start(c: Cell) {
    painting = c.wall ? 'remove' : 'add';
    paint(c);
  }

  function reset() {
    cells.forEach((c) => (c.wall = false));
  }

  const width = cols * cellSize;
  const height = rows * cellSize;
</script>

<svelte:window onpointerup={() => (painting = null)} />

<figure class="demo">
  <svg
    viewBox="0 0 {width} {height}"
    role="img"
    aria-label="Interactive grid. Click and drag to toggle walls."
  >
    {#each cells as c (c.x + ',' + c.y)}
      <rect
        x={c.x * cellSize}
        y={c.y * cellSize}
        width={cellSize}
        height={cellSize}
        class:wall={c.wall}
        onpointerdown={(e) => {
          (e.target as Element).setPointerCapture?.(e.pointerId);
          start(c);
        }}
        onpointerenter={() => painting && paint(c)}
      />
    {/each}
  </svg>

  <div class="controls">
    <span class="hint">Click or drag to draw walls.</span>
    <button onclick={reset}>Reset</button>
  </div>
</figure>

<style>
  .demo {
    border: 1px solid var(--border);
    border-radius: var(--radius);
    margin: 1.5em 0;
    padding: 1em;
  }

  svg {
    display: block;
    width: 100%;
    height: auto;
    touch-action: none;
    user-select: none;
  }

  rect {
    fill: transparent;
    stroke: var(--border);
    stroke-width: 1;
    cursor: pointer;
    transition: fill var(--transition);
  }

  rect:hover {
    fill: color-mix(in srgb, var(--accent) 20%, transparent);
  }

  rect.wall {
    fill: var(--accent);
  }

  .controls {
    align-items: center;
    display: flex;
    gap: 1em;
    justify-content: space-between;
    margin-top: 0.75em;
  }

  .hint {
    color: var(--text-muted);
    font-size: 0.85em;
    opacity: 0.8;
  }

  button {
    background: transparent;
    border: 2px solid var(--accent);
    border-radius: var(--radius);
    color: var(--accent);
    cursor: pointer;
    font-family: var(--font);
    font-size: 0.85em;
    font-weight: 700;
    padding: 0.4em 0.9em;
    transition: background var(--transition), color var(--transition);
  }

  button:hover {
    background: var(--accent);
    color: #ffffff;
  }
</style>
