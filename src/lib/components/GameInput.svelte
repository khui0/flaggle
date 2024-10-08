<script lang="ts">
  import Fuse from "fuse.js";
  import data from "$lib/data.json";
  import { createEventDispatcher, onMount } from "svelte";

  import { fly } from "svelte/transition";

  import LucideArrowRight from "~icons/lucide/arrow-right";

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

  let touch: boolean = false;

  let container: HTMLElement;
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
    touch = window.matchMedia("(pointer: coarse)").matches;

    document.addEventListener("click", (e) => {
      if (container?.contains(e.target as Node)) {
        focused = true;
      } else {
        focused = false;
      }
    });

    document.addEventListener("keydown", (e) => {
      if (e.key.length === 1 || e.key === "Backspace") {
        input?.focus();
        focused = true;
        if (e.key.match(/[0-9]/)) {
          e.preventDefault();
          const index = (parseInt(e.key) + 9) % 10;
          if (results.length > 0 && index < results.length) {
            query = results[index].name;
          }
        }
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

<label
  bind:this={container}
  class="input relative flex items-center gap-1 bg-base-200 rounded-btn pr-2"
>
  <input
    bind:value={query}
    bind:this={input}
    type="text"
    class="flex-1 min-w-0 bg-transparent"
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
  <button class="btn btn-square btn-sm" on:click={submitQuery} aria-label="Guess">
    <LucideArrowRight></LucideArrowRight>
  </button>
  {#if results.length > 0 && focused}
    <div
      in:fly={{ duration: 100, y: -10 }}
      out:fly={{ duration: 100, y: -10 }}
      class="absolute z-10 top-[calc(100%+1rem)] left-0 w-full bg-base-200 rounded-btn flex flex-col shadow-lg"
    >
      {#each results as country, i}
        <button
          class="text-start flex justify-between px-3 {touch ? 'py-4' : 'py-2'}
            hover:bg-base-100/50 active:bg-base-100/50"
          on:click={() => {
            submitGuess(country);
          }}
        >
          <span class="inline-flex gap-2">
            {#if !touch}
              <span class="text-base-content/50 w-3 text-center">{(i + 1) % 10}</span>
            {/if}
            {country.name}
          </span>
          <span class="text-base-content/50">{country.code}</span></button
        >
      {/each}
    </div>
  {/if}
</label>
