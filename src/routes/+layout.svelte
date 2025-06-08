<script lang="ts">
  import "$lib/theme";
  import "@fontsource-variable/rubik";
  import "../app.css";

  import Navigation from "$lib/components/Navigation.svelte";

  let { children } = $props();
</script>

<svelte:head>
  <title>Flaggle</title>
  <meta
    name="description"
    content="Flag guessing game inspired by Wordle. Test your knowledge of countries and flags!"
  />
</svelte:head>

<div class="mx-auto flex w-full max-w-4xl flex-col gap-4 p-4 pb-16">
  {@render children()}
</div>
<Navigation />
<p class="fixed right-0 bottom-0 m-3 leading-none font-semibold mix-blend-overlay">
  {import.meta.env.PACKAGE_VERSION}
</p>
