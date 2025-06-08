<script lang="ts">
  import { page } from "$app/stores";
  import { fly } from "svelte/transition";

  import LucideUndo2 from "~icons/lucide/undo-2";
  import LucideSettings from "~icons/lucide/settings";

  const modes = [
    { name: "Daily", path: "daily" },
    { name: "Classic", path: "classic" },
    { name: "Lightning", path: "lightning" },
  ];
</script>

{#if $page.url.pathname !== "/"}
  <nav
    in:fly={{ y: 100 }}
    out:fly={{ y: 100 }}
    class="bg-base-200 fixed bottom-0 left-1/2 z-50 mb-3 flex -translate-x-1/2 gap-1 rounded-full p-2 shadow-lg"
  >
    <a href="/" class="btn btn-sm btn-square rounded-full" aria-label="Settings">
      <LucideUndo2></LucideUndo2>
    </a>
    {#each modes as mode}
      {@const active = $page.url.pathname === "/" + mode.path}
      <a
        href="/{mode.path}"
        class="mx-1 font-[BigNoodleTitling] text-2xl italic transition-transform hover:scale-105 {active
          ? 'text-accent'
          : ''}"
      >
        {mode.name}
      </a>
    {/each}
    <slot></slot>
    <a href="/settings" class="btn btn-sm btn-square rounded-full" aria-label="Settings">
      <LucideSettings></LucideSettings>
    </a>
  </nav>
{/if}
