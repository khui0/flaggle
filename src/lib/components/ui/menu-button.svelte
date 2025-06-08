<script lang="ts">
  import type { Snippet } from "svelte";

  let {
    label,
    href,
    onclick,
    children,
  }: {
    label: string;
    href?: string;
    onclick?: () => void;
    children?: Snippet;
  } = $props();
</script>

{#snippet content()}
  <div
    class="border-base-content group-hover:border-accent group-hover: absolute inset-0 m-1 overflow-hidden rounded-[calc(var(--radius-box)-4px)] border-3 opacity-10 transition-all group-hover:opacity-100"
  >
    <span
      class="text-base-content group-hover:text-accent absolute right-0 -bottom-4 -rotate-10 text-6xl transition-colors"
    >
      {@render children?.()}
    </span>
  </div>
  <span class="relative z-10">{label}</span>
{/snippet}

{#if href}
  <a
    aria-label={label}
    {href}
    {onclick}
    class="font-title group btn btn-lg rounded-box relative p-10 shadow-lg max-md:last:col-span-2"
  >
    {@render content()}
  </a>
{:else}
  <button
    aria-label={label}
    {onclick}
    class="font-title group btn btn-lg rounded-box relative p-10 shadow-lg max-md:last:col-span-2"
  >
    {@render content()}
  </button>
{/if}
