<script lang="ts">
  import type { Snippet } from "svelte";

  let {
    title,
    icon,
    children,
  }: {
    title?: Snippet;
    icon?: Snippet;
    children?: Snippet;
  } = $props();
</script>

<div class="bg-base-200 rounded-box flex flex-col items-center p-4">
  <span class="text-4xl">{@render icon?.()}</span>
  <h2 class="font-title">{@render title?.()}</h2>
  <ul class="flex w-full max-w-sm flex-col">
    {@render children?.()}
  </ul>
</div>
