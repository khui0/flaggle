<script lang="ts">
  import type { Snippet } from "svelte";

  let {
    title,
    header,
    children,
  }: {
    title?: Snippet;
    header?: Snippet;
    children?: Snippet;
  } = $props();
</script>

<div class="relative z-0 flex h-full flex-col overflow-auto px-4">
  {#if title || header}
    <div
      class="from-base-100 sticky top-0 z-10 mx-auto flex w-full max-w-4xl flex-col gap-3 bg-gradient-to-b to-transparent py-4"
    >
      {#if title}
        <h1 class="font-title text-center">
          {@render title?.()}
        </h1>
      {/if}
      {@render header?.()}
    </div>
  {/if}
  <div class="mx-auto flex w-full max-w-4xl flex-col gap-4 py-4">
    {@render children?.()}
  </div>
</div>
