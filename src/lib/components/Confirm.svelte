<script lang="ts">
  import { DeferredPromise } from "@open-draft/deferred-promise";
  import Modal from "./Modal.svelte";

  let modal: Modal;

  let result: DeferredPromise<string> | null;

  let titleText: string;
  let bodyText: string;
  let actionText: string;

  export function prompt(title: string, body: string, action: string) {
    result = new DeferredPromise();
    titleText = title;
    bodyText = body;
    actionText = action;
    modal.show();
    return result;
  }
</script>

<Modal
  title={titleText}
  bind:this={modal}
  on:close={() => {
    result?.reject();
  }}
>
  <p>{bodyText}</p>
  <form method="dialog" class="flex gap-2 my-1">
    <button class="btn btn-sm flex-1">Cancel</button>
    <button
      class="btn btn-sm flex-1"
      on:click={() => {
        result?.resolve("");
      }}>{actionText}</button
    >
  </form>
</Modal>
