<script lang="ts">
  import type { Snippet } from "svelte";
  import { fade } from "svelte/transition";

  let {
    class: classList,
    content,
    children,
  }: {
    class?: string;
    content: string;
    children?: Snippet;
  } = $props();

  let timeout: number = 0;
  let showCopied: boolean = $state(false);

  function onclick() {
    navigator.clipboard.writeText(content);

    showCopied = true;
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      showCopied = false;
    }, 3000);
  }
</script>

<button class="btn relative overflow-hidden {classList}" {onclick}>
  {@render children?.()}
  {#if showCopied}
    <div in:fade out:fade class="bg-base-200 absolute inset-0 flex items-center justify-center">
      <p>Copied!</p>
    </div>
  {/if}
</button>
