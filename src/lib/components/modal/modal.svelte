<script lang="ts">
  import type { Snippet } from "svelte";
  import LucideX from "~icons/lucide/x";

  let {
    title,
    onshow,
    onclose,
    children,
  }: {
    title?: string;
    onshow?: () => void;
    onclose?: () => void;
    children: Snippet;
  } = $props();

  let modal: HTMLDialogElement;

  export const show = () => {
    onshow?.();
    modal.showModal();
  };

  export const close = () => {
    onclose?.();
    modal.close();
  };
</script>

<dialog class="modal backdrop:bg-transparent" bind:this={modal} {onclose}>
  <div class="modal-box p-4">
    <form method="dialog">
      <button class="btn btn-square btn-ghost absolute top-3 right-3 text-xl" aria-label="Close">
        <LucideX />
      </button>
    </form>
    <div class="mx-1 flex flex-col gap-2">
      <h1 class="font-title">{title}</h1>
      {@render children()}
    </div>
  </div>
  <form method="dialog" class="modal-backdrop bg-black/20">
    <button>close</button>
  </form>
</dialog>
