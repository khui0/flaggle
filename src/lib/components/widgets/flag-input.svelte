<script lang="ts">
  import { browser } from "$app/environment";
  import { flags, type Flag } from "$lib/content";
  import Fuse from "fuse.js";
  import { fly } from "svelte/transition";
  import LucideArrowRight from "~icons/lucide/arrow-right";

  let { onsubmit }: { onsubmit?: (flag: Flag) => void } = $props();

  const fuse = new Fuse(flags, {
    includeScore: true,
    shouldSort: true,
    keys: ["code", "name"],
  });

  let touch: boolean = $derived(browser && window.matchMedia("(pointer: coarse)").matches);

  let container: HTMLElement;
  let input: HTMLInputElement;

  let query: string = $state("");
  let results: Flag[] = $derived(
    fuse
      .search(query)
      .map((result) => result.item)
      .slice(0, 10),
  );
  let focused: boolean = $state(false);
  let selectedIndex: number = $state(0);

  function submitQuery() {
    if (!results[selectedIndex]) return;
    const target = flags.find(
      (flag) => flag.name.toLowerCase() === results[selectedIndex].name.toLowerCase(),
    );
    if (target) {
      submitGuess(target);
    }
  }

  function highlightNext() {
    const MAX = results.length - 1;
    selectedIndex++;
    if (selectedIndex > MAX) {
      selectedIndex = 0;
    }
  }

  function highlightPrev() {
    const MAX = results.length - 1;
    selectedIndex--;
    if (selectedIndex < 0) {
      selectedIndex = MAX;
    }
  }

  function submitGuess(flag: Flag) {
    onsubmit?.(flag);
    resetInput();
  }

  function resetInput() {
    query = "";
    selectedIndex = 0;
  }
</script>

<svelte:document
  onclick={(e) => {
    if (container?.contains(e.target as Node)) {
      focused = true;
    } else {
      focused = false;
    }
  }}
  onkeydown={(e: KeyboardEvent) => {
    if (e.key.length === 1 || e.key === "Backspace") {
      input?.focus();
      focused = true;
      if (e.key.match(/[0-9]/)) {
        e.preventDefault();
        const index = (parseInt(e.key) + 9) % 10;
        if (results.length > 0 && index < results.length) {
          selectedIndex = index;
        }
      } else {
        selectedIndex = 0;
      }
    } else {
      if (!(results.length > 0 && focused)) return;
      if (e.key === "ArrowDown") {
        highlightNext();
      } else if (e.key === "ArrowUp") {
        highlightPrev();
      }
    }
  }}
/>

{#snippet suggestions()}
  <div
    in:fly={{ duration: 100, y: -10 }}
    out:fly={{ duration: 100, y: -10 }}
    class="bg-base-200 rounded-field absolute top-[calc(100%+1rem)] left-0 z-10 flex w-full flex-col overflow-hidden shadow-xl"
  >
    {#each results as flag, i}
      <button
        class={{
          "font-title flex items-center justify-between px-3 py-1 text-start text-2xl": true,
          "bg-primary text-primary-content": i === selectedIndex,
          "hover:bg-base-100/50 active:bg-base-100/50": i !== selectedIndex,
          "py-3": touch,
        }}
        onclick={() => {
          submitGuess(flag);
        }}
      >
        <span class="inline-flex items-center gap-2">
          {#if !touch}
            <span class="w-3 text-center opacity-50">{(i + 1) % 10}</span>
          {/if}
          {flag.name}
        </span>
        <span class="opacity-50">{flag.code}</span></button
      >
    {/each}
  </div>
{/snippet}

<label
  bind:this={container}
  class="input bg-base-200 rounded-field relative flex w-full items-center gap-1 border-none pr-1 shadow-xl [--input-color:var(--color-accent))]!"
>
  <input
    bind:value={query}
    bind:this={input}
    type="text"
    class="font-title min-w-0 flex-1 bg-transparent text-2xl"
    placeholder="Guess a flag!"
    onkeydown={(e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        e.stopPropagation();
        submitQuery();
      } else if (e.key === "Tab") {
        e.preventDefault();
        if (e.shiftKey) {
          highlightPrev();
        } else {
          highlightNext();
        }
      }
    }}
  />
  <button
    class="btn btn-square btn-ghost btn-sm text-lg"
    onclick={submitQuery}
    aria-label="submit guess"
  >
    <LucideArrowRight />
  </button>
  {#if results.length > 0 && focused}
    {@render suggestions()}
  {/if}
</label>
