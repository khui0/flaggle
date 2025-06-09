<script lang="ts">
  import Confirm from "$lib/components/modal/confirm.svelte";
  import Modal from "$lib/components/modal/modal.svelte";
  import { minutesToString } from "$lib/date";
  import { db } from "$lib/db";
  import { deserializeSave } from "$lib/stats";

  let modal: Modal;
  let confirm: Confirm | null = $state(null);

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

  async function importSave() {
    if (parsed === null) return;
    await db.stats.put({ name: "play-time", value: parsed.playTime.all });
    await db.stats.put({ name: "play-time/classic", value: parsed.playTime.classic });
    await db.stats.put({ name: "play-time/lightning", value: parsed.playTime.lightning });
    await db.stats.put({ name: "play-time/daily", value: parsed.playTime.daily });
    await db.stats.put({ name: "classic-streak", value: parsed.classic.streak });
    await db.stats.put({ name: "classic-max-streak", value: parsed.classic.maxStreak });
    await db.stats.put({ name: "lightning-streak", value: parsed.lightning.streak });
    await db.stats.put({ name: "lightning-max-streak", value: parsed.lightning.maxStreak });
    await db.classic.clear();
    await db.classic.bulkAdd(parsed.classic.history);
    await db.lightning.clear();
    await db.lightning.bulkAdd(parsed.lightning.history);
    await db.daily.clear();
    await db.daily.bulkAdd(parsed.daily.history);
    modal.close();
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
    <button class="btn btn-sm" disabled={parsed === null} onclick={confirm?.prompt}>Import</button>
  </div>
</Modal>

<Confirm
  bind:this={confirm}
  title="Are you sure you want to import?"
  body="This will permanently overwrite current stats."
  action="Import"
  onaccept={importSave}
/>
