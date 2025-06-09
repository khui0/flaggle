<script lang="ts">
  import Modal from "$lib/components/modal/modal.svelte";
  import CopyButton from "$lib/components/ui/copy-button.svelte";
  import { serializeSave } from "$lib/stats";

  let modal: Modal;
  let textarea: HTMLTextAreaElement | null = $state(null);
  let saveString: string = $state("");

  export const show = async () => {
    saveString = await serializeSave();
    modal.show();
  };
</script>

<Modal title="Export Save" bind:this={modal}>
  <textarea
    bind:this={textarea}
    readonly
    class="textarea w-full resize-none"
    rows="5"
    value={saveString}
    spellcheck="false"
    onfocus={() => {
      textarea?.select();
    }}
  ></textarea>
  <div class="my-1 flex w-full items-end justify-between gap-2">
    <p class="text-base-content/50 text-sm leading-none">
      Keep this safe somewhere to backup or transfer your stats
    </p>
    <CopyButton class="btn-sm" content={saveString}>Copy</CopyButton>
  </div>
</Modal>
