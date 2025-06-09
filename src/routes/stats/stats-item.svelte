<script lang="ts">
  import type { Snippet } from "svelte";

  let {
    label,
    children,
  }: {
    label: string;
    children?: Snippet;
  } = $props();
</script>

<li class="grid grid-cols-2 text-lg">
  <p class="text-center">{label}</p>
  <div class="text-center">
    {@render children?.()}
  </div>
</li>
