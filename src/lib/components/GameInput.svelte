<script lang="ts">
  import Fuse from "fuse.js";
  import data from "$lib/data.json";
  import { createEventDispatcher, onMount } from "svelte";

  import LucideFlag from "~icons/lucide/flag";

  const dispatch = createEventDispatcher();

  const fuse = new Fuse(data, {
    includeScore: true,
    shouldSort: true,
    keys: ["code", "name"],
  });

  interface Country {
    code: string;
    name: string;
  }

  let container: HTMLDivElement;
  let input: HTMLInputElement;

  let query: string = "";
  let results: Country[] = [];
  let focused: boolean = false;

  $: query,
    (() => {
      results = fuse
        .search(query)
        .map((result) => result.item)
        .slice(0, 10);
    })();

  onMount(() => {
    document.addEventListener("click", (e) => {
      if (container?.contains(e.target as Node)) {
        focused = true;
      } else {
        focused = false;
      }
    });

    document.addEventListener("keydown", (e) => {
      if (e.key.length === 1) {
        input?.focus();
        focused = true;
      }
    });
  });

  function submitQuery() {
    const country = data.find((country) => country.name.toLowerCase() === query.toLowerCase());
    if (country) {
      submitGuess(country);
    }
    dispatch("enterkey");
  }

  function fillFirstResult() {
    query = results[0].name;
  }

  function submitGuess(country: Country) {
    dispatch("submit", country);
    resetInput();
  }

  function resetInput() {
    query = "";
  }
</script>

<div bind:this={container} class="relative flex gap-1 bg-base-200 rounded-btn">
  <input
    bind:value={query}
    bind:this={input}
    type="text"
    class="input flex-1 min-w-0 bg-transparent"
    placeholder="Guess a flag!"
    on:keydown={(e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        submitQuery();
      } else if (e.key === "Tab") {
        if (results.length > 0) {
          e.preventDefault();
          fillFirstResult();
        }
      }
    }}
  />
  <button class="btn btn-square" on:click={submitQuery} aria-label="Guess">
    <LucideFlag></LucideFlag>
  </button>
  {#if results.length > 0 && focused}
    <div
      class="absolute z-10 top-[calc(100%+1rem)] w-full bg-base-200 rounded-btn flex flex-col shadow-lg"
    >
      {#each results as country}
        <button
          class="text-start flex justify-between px-3 py-2 hover:bg-base-100/50"
          on:click={() => {
            submitGuess(country);
          }}>{country.name}<span class="text-base-content/50">{country.code}</span></button
        >
      {/each}
    </div>
  {/if}
</div>
