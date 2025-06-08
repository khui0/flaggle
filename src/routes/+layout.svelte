<script lang="ts">
  import "$lib/theme";
  import "@fontsource-variable/figtree";
  import "../app.css";

  import Navigation from "$lib/components/Navigation.svelte";
  import StatsModal from "$lib/components/StatsModal.svelte";
  import LucideBarChart3 from "~icons/lucide/bar-chart-3";

  let { children } = $props();

  let statsModal: StatsModal | null = $state(null);
</script>

<svelte:head>
  <title>Flaggle</title>
  <meta
    name="description"
    content="Flag guessing game inspired by Wordle. Test your knowledge of countries and flags!"
  />
</svelte:head>

<Navigation>
  <button class="btn btn-sm btn-square rounded-full" onclick={statsModal?.show} aria-label="Stats">
    <LucideBarChart3></LucideBarChart3>
  </button>
</Navigation>
<div class="mx-auto flex w-[min(100%,800px)] flex-col gap-4 p-4 pb-24">
  {@render children()}
</div>
<a
  target="_blank"
  rel="noopener noreferrer"
  class="fixed bottom-0 left-0 m-3 leading-none font-bold opacity-30 transition-transform active:scale-95"
  href="https://kennyhui.dev/"
>
  kennyhui.dev
</a>
<p class="fixed right-0 bottom-0 m-3 leading-none opacity-30">{import.meta.env.PACKAGE_VERSION}</p>
<StatsModal bind:this={statsModal}></StatsModal>
