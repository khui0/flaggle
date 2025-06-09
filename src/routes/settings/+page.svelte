<script lang="ts">
  import { settings } from "$lib/settings";

  import Confirm from "$lib/components/Confirm.svelte";
  import SettingsField from "./SettingsField.svelte";

  import Modal from "$lib/components/Modal.svelte";
  import { serializeSave } from "$lib/stats";
  import BiGithub from "~icons/bi/github";

  let confirm: Confirm;
  let exportModal: Modal;
  let exportString: string = "";

  interface Option {
    name: string;
    value: string;
  }

  const themes: Option[] = [
    { value: "auto", name: "Auto" },
    { value: "dark", name: "Dark" },
    { value: "light", name: "Light" },
  ];

  const version: string = import.meta.env.PACKAGE_VERSION;
</script>

<div class="flex flex-wrap items-center justify-between gap-4">
  <h1 class="font-[BigNoodleTitling] text-4xl italic">Settings</h1>
  <a href="https://github.com/khui0/flaggle" title="GitHub" class="self-center text-2xl">
    <BiGithub></BiGithub>
  </a>
</div>
<SettingsField type="select" title="Theme" options={themes} bind:value={$settings.theme}>
  Select a theme
</SettingsField>
<SettingsField type="toggle" title="Dark Background" bind:value={$settings.diffDarkBg}>
  Use a dark background behind the flag similarity regardless of theme
</SettingsField>
<SettingsField type="toggle" title="Allow identical flags" bind:value={$settings.identicalFlags}>
  Allow identical flags such as Norway, Bouvet Island, and Svalbard and Jan Mayen
</SettingsField>
<SettingsField type="toggle" title="Legacy tab behavior" bind:value={$settings.legacyTab}>
  When enabled, tab will insert the highlighted result instead of selecting the next one
</SettingsField>
<SettingsField
  type="button"
  title="Export Stats"
  text="Export"
  on:click={async () => {
    exportString = await serializeSave();
    exportModal.show();
  }}
>
  When enabled, tab will insert the highlighted result instead of selecting the next one
</SettingsField>

<Modal bind:this={exportModal} title="Export Stats">
  <textarea readonly class="textarea textarea-bordered resize-none" rows="6" value={exportString}
  ></textarea>
  <button
    class="btn"
    on:click={() => {
      navigator.clipboard.writeText(exportString);
    }}
  >
    Copy
  </button>
</Modal>

<Confirm bind:this={confirm}></Confirm>
