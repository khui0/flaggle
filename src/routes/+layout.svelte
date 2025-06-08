<script lang="ts">
  import "$lib/theme";
  import "@fontsource-variable/rubik";
  import "../app.css";

  import Navigation from "$lib/components/Navigation.svelte";
  import FlagBackground from "$lib/components/ui/flag-background.svelte";
  import MenuButton from "$lib/components/ui/menu-button.svelte";
  import LucideBookOpen from "~icons/lucide/book-open";
  import LucideCalendarDays from "~icons/lucide/calendar-days";
  import LucideFlag from "~icons/lucide/flag";
  import LucideSettings from "~icons/lucide/settings";
  import LucideZap from "~icons/lucide/zap";
  import { page } from "$app/state";
  import { fade, scale } from "svelte/transition";

  let { children } = $props();
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
    class="fixed inset-0 z-0 flex items-center justify-center overflow-hidden"
  >
    <FlagBackground />
  <div class="bg-accent absolute bottom-0 left-0 z-0 h-1/5 w-full mask-t-from-0%"></div>
  </div>
  <div
    in:fade
    out:fade
    class="fixed inset-0 z-10 flex flex-col items-center justify-center gap-5 p-5"
  >
    <div class="flex items-center gap-3 md:gap-5">
      <enhanced:img
        src="$lib/assets/branding/flaggle.svg"
        class="h-13 w-auto drop-shadow-lg md:h-19"
        alt="Flaggle icon"
      />
      <h1 class="font-title text-6xl leading-none text-white text-shadow-lg md:text-8xl">
        Flaggle
      </h1>
    </div>
    <div class="grid w-full max-w-4xl grid-cols-2 gap-2 md:grid-cols-5">
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
      <MenuButton href="/settings" label="Settings">
        <LucideSettings />
      </MenuButton>
    </div>
  </div>
  <div
    class="fixed right-0 bottom-0 left-0 z-20 m-3 flex justify-between leading-none font-semibold text-white mix-blend-overlay"
  >
    <p>
      <a href="http://kennyhui.dev" target="_blank" rel="noopener noreferrer">kennyhui.dev</a>
    </p>
    <p>
      {import.meta.env.PACKAGE_VERSION}
    </p>
  </div>
{:else}
  <div class="mx-auto flex w-full max-w-4xl flex-col gap-4 p-4 pb-16">
    {@render children()}
  </div>
  <Navigation />
{/if}
