<script lang="ts">
  import type { Snippet } from "svelte";

  let {
    title,
    description,
    children,
  }: {
    title: Snippet;
    description: Snippet;
    children?: Snippet;
  } = $props();
</script>

<div class="flex flex-col gap-2">
  <div class="rounded-box bg-base-200 p-2 pl-4">
    <div class="flex items-center justify-between gap-2 p-1">
      <span class="label-text text-base">{@render title()}</span>
      {@render children?.()}
    </div>
  </div>
  <p class="text-base-content/50 mx-4 mb-4 text-sm">{@render description()}</p>
</div>
