<script lang="ts">
  import { page } from "$app/stores";
  import { fly } from "svelte/transition";

  import LucideArrowLeft from "~icons/lucide/arrow-left";
  import LucideSettings from "~icons/lucide/settings";

  const modes = [
    { name: "Daily", path: "daily" },
    { name: "Classic", path: "classic" },
    { name: "Lightning", path: "lightning" },
  ];
</script>

{#if $page.url.pathname !== "/"}
  <nav
    in:fly={{ y: 48, duration: 300 }}
    out:fly={{ y: 48, duration: 300 }}
    class="bg-base-200 fixed bottom-0 left-0 z-50 flex h-12 w-full gap-1 p-2"
  >
    <a href="/" class="btn btn-sm btn-square text-lg" aria-label="Home">
      <LucideArrowLeft />
    </a>
    <div class="flex flex-1 items-center justify-center">
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
    </div>
    <a href="/settings" class="btn btn-sm btn-square text-lg" aria-label="Settings">
      <LucideSettings></LucideSettings>
    </a>
  </nav>
{/if}
