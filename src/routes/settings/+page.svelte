<script lang="ts">
  import GameContainer from "$lib/components/ui/game-container.svelte";
  import { settings } from "$lib/settings.svelte";
  import BiGithub from "~icons/bi/github";
  import SettingsFieldContainer from "./settings-field-container.svelte";
  import SettingsField from "./settings-field.svelte";
  import ThemeSelector from "./theme-selector.svelte";
  import ExportSaveModal from "./export-save-modal.svelte";
  import ImportSaveModal from "./import-save-modal.svelte";

  let exportSaveModal: ExportSaveModal | null = $state(null);
  let importSaveModal: ImportSaveModal | null = $state(null);
</script>

<GameContainer>
  {#snippet title()}
    Settings
  {/snippet}
  <div class="flex flex-col">
    <SettingsFieldContainer>
      {#snippet title()}
        Theme
      {/snippet}
      {#snippet description()}
        Select a theme
      {/snippet}
      <ThemeSelector />
    </SettingsFieldContainer>
    <SettingsField type="toggle" title="Dark Background" bind:value={settings.current.diffDarkBg}>
      Use a dark background behind the flag similarity regardless of theme
    </SettingsField>
    <SettingsField
      type="toggle"
      title="Allow identical flags"
      bind:value={settings.current.allowDuplicates}
    >
      Allow identical flags such as Norway, Bouvet Island, and Svalbard and Jan Mayen
    </SettingsField>
    <SettingsFieldContainer>
      {#snippet title()}
        Export Stats
      {/snippet}
      {#snippet description()}
        Save a copy of your statistics (settings and game state will not be preserved)
      {/snippet}
      <div class="flex items-center gap-1">
        <button class="btn-sm btn h-auto" onclick={exportSaveModal?.show}>Export</button>
        <button class="btn-sm btn h-auto" onclick={importSaveModal?.show}>Import</button>
      </div>
    </SettingsFieldContainer>
  </div>
  <div
    class="flex max-w-md flex-wrap items-center justify-center gap-5 self-center text-center font-semibold [&>*]:opacity-50 [&>*]:transition-opacity [&>*]:hover:opacity-100"
  >
    <p>&copy; 2025 Kenny Hui</p>
    <p>Flaggle {import.meta.env.PACKAGE_VERSION}</p>
    <a href="https://kennyhui.dev" target="_blank" rel="noopener noreferrer">kennyhui.dev</a>
    <a
      href="https://github.com/khui0/flaggle"
      target="_blank"
      rel="noopener noreferrer"
      title="GitHub"
      class="inline-flex items-center gap-1.5"
    >
      <BiGithub />
      Source
    </a>
    <a href="https://flagpedia.net/index" target="_blank" rel="noopener noreferrer">
      Flags from Flagpedia.net
    </a>
  </div>
</GameContainer>

<ExportSaveModal bind:this={exportSaveModal} />
<ImportSaveModal bind:this={importSaveModal} />
