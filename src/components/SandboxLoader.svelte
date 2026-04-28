<script lang="ts">
  let { name } = $props<{ name: string }>();

  const demos = import.meta.glob('./demos/*.svelte');

  async function load() {
    const path = `./demos/${name}.svelte`;
    const loader = demos[path];
    if (!loader) throw new Error(`Demo "${name}" not found at ${path}`);
    const mod = (await loader()) as { default: any };
    return mod.default;
  }
</script>

{#await load()}
  <p class="status">Loading {name}…</p>
{:then Component}
  <Component />
{:catch err}
  <p class="status error">Error: {err.message}</p>
{/await}

<style>
  .status {
    color: var(--text-muted);
    font-size: 0.9em;
    opacity: 0.7;
    text-align: center;
    padding: 2em;
  }
  .error {
    color: #ff6b6b;
  }
</style>
