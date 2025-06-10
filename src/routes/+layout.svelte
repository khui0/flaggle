<script lang="ts">
  import "$lib/theme";
  import "@fontsource-variable/rubik";
  import "../app.css";

  import { page } from "$app/state";
  import AssetLoader from "$lib/components/asset-loader.svelte";
  import FlagBackground from "$lib/components/ui/flag-background.svelte";
  import MenuButton from "$lib/components/ui/menu-button.svelte";
  import Navigation from "$lib/components/ui/navigation.svelte";
  import { db } from "$lib/db";
  import { settings } from "$lib/settings.svelte";
  import { onMount } from "svelte";
  import { fade, scale } from "svelte/transition";
  import LucideBookOpen from "~icons/lucide/book-open";
  import LucideCalendarDays from "~icons/lucide/calendar-days";
  import LucideFlag from "~icons/lucide/flag";
  import LucideSettings from "~icons/lucide/settings";
  import LucideTrophy from "~icons/lucide/trophy";
  import LucideZap from "~icons/lucide/zap";

  let { children } = $props();

  $effect(() => {
    localStorage.settings = JSON.stringify(settings.current);
    console.log("settings updated");
  });

  onMount(async () => {
    setInterval(async () => {
      const all = await db.stats.get("play-time").then((v) => v?.value || 0);
      db.stats.put({ name: "play-time", value: all + 1 });

      const current = await db.stats
        .get("play-time" + page.url.pathname)
        .then((v) => v?.value || 0);
      db.stats.put({ name: "play-time" + page.url.pathname, value: current + 1 });
    }, 60000);
  });
</script>

<svelte:head>
  <title>Flaggle</title>
  <meta
    name="description"
    content="Flag guessing game inspired by Wordle. Test your knowledge of countries and flags!"
  />
</svelte:head>

{#if page.url.pathname === "/"}
  <div
    out:scale={{ start: 1.1 }}
    in:scale={{ start: 1.1 }}
    class="fixed inset-0 z-10 flex items-center justify-center overflow-hidden"
  >
    <FlagBackground />
    <div class="bg-accent absolute bottom-0 left-0 z-0 h-1/5 w-full mask-t-from-0%"></div>
  </div>
  <div
    in:fade
    out:fade
    class="fixed inset-0 z-20 flex flex-col items-center justify-center gap-5 p-5"
  >
    <div class="flex items-center gap-3 md:gap-5">
      <enhanced:img
        src="$lib/assets/branding/flaggle.svg"
        class="h-15 w-auto drop-shadow-lg md:h-19"
        alt="Flaggle icon"
      />
      <h1 class="font-title text-7xl leading-none text-white text-shadow-lg md:text-8xl">
        Flaggle
      </h1>
    </div>
    <div class="grid w-full max-w-4xl grid-cols-2 gap-2 md:grid-cols-3">
      <MenuButton href="/daily" label="Daily">
        <LucideCalendarDays />
      </MenuButton>
      <MenuButton href="/classic" label="Classic">
        <LucideFlag />
      </MenuButton>
      <MenuButton href="/lightning" label="Lightning">
        <LucideZap />
      </MenuButton>
      <MenuButton href="/reference" label="Reference">
        <LucideBookOpen />
      </MenuButton>
      <MenuButton href="/stats" label="Stats">
        <LucideTrophy />
      </MenuButton>
      <MenuButton href="/settings" label="Settings">
        <LucideSettings />
      </MenuButton>
    </div>
  </div>
  <div
    class="fixed right-0 bottom-0 left-0 z-20 m-3 flex justify-between leading-none font-semibold text-white [&>*]:opacity-50 [&>*]:transition-opacity [&>*]:hover:opacity-100"
  >
    <p>
      <a href="https://kennyhui.dev" target="_blank" rel="noopener noreferrer">kennyhui.dev</a>
    </p>
    <p>
      {import.meta.env.PACKAGE_VERSION}
    </p>
  </div>
{:else}
  <div class="h-full overflow-x-hidden pb-12">
    {@render children()}
  </div>
  <Navigation />
{/if}

<AssetLoader />
