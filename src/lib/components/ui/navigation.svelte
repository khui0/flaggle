<script lang="ts">
  import { page } from "$app/state";
  import { fly } from "svelte/transition";

  import LucideArrowLeft from "~icons/lucide/arrow-left";
  import LucideSettings from "~icons/lucide/settings";

  const modes = [
    { name: "Daily", path: "daily" },
    { name: "Classic", path: "classic" },
    { name: "Lightning", path: "lightning" },
  ];
</script>

<nav
  in:fly={{ y: 48, duration: 500, delay: 300 }}
  out:fly={{ y: 48, duration: 500 }}
  class="bg-base-200 fixed bottom-0 left-0 z-50 flex h-12 w-full gap-1 p-2 shadow-lg"
>
  <a
    href="/"
    class="btn btn-sm hover:bg-base-300 btn-square text-lg transition-colors"
    aria-label="Home"
  >
    <LucideArrowLeft />
  </a>
  <div class="flex flex-1 items-center justify-center">
    {#each modes as mode}
      {@const active = page.url.pathname === "/" + mode.path}
      <a
        href="/{mode.path}"
        class={{
          "btn btn-sm hover:bg-base-300 -mx-1 font-[BigNoodleTitling] text-2xl italic transition-colors hover:z-10": true,
          "text-accent": active,
        }}
      >
        {mode.name}
      </a>
    {/each}
  </div>
  <a
    href="/settings"
    class="btn btn-sm hover:bg-base-300 btn-square text-lg transition-colors"
    aria-label="Settings"
  >
    <LucideSettings />
  </a>
</nav>
