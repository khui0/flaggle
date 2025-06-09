<script lang="ts">
  import Modal from "$lib/components/modal/modal.svelte";
  import { minutesToString } from "$lib/date";
  import { deserializeSave } from "$lib/stats";

  let modal: Modal;
  let textarea: HTMLTextAreaElement | null = $state(null);
  let saveString: string = $state("");

  let parsed = $derived.by(() => {
    try {
      return deserializeSave(saveString.trim());
    } catch {
      return null;
    }
  });

  $inspect(parsed);

  export const show = async () => {
    modal.show();
  };

  function onclick() {
    console.log(parsed);
  }
</script>

<Modal title="Import Save" bind:this={modal}>
  <div class="text-base-content/80 text-sm">
    <p>
      Parsed version: {parsed === null ? "" : parsed.version}
    </p>
    <p>Play time: {parsed === null ? "" : minutesToString(parsed.playTime.all)}</p>
  </div>
  <textarea
    bind:this={textarea}
    class="textarea w-full resize-none"
    rows="5"
    bind:value={saveString}
    spellcheck="false"
  ></textarea>
  <div class="my-1 flex w-full items-end justify-between gap-2">
    <p class="text-base-content/50 text-sm leading-none">
      Paste your save string here. (It should start with FLAGGLE_)
    </p>
    <button class="btn btn-sm" {onclick}>Import</button>
  </div>
</Modal>
