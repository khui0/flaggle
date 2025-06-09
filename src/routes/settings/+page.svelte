<script lang="ts">
  import GameContainer from "$lib/components/ui/game-container.svelte";
  import { settings } from "$lib/settings.svelte";
  import BiGithub from "~icons/bi/github";
  import SettingsFieldContainer from "./settings-field-container.svelte";
  import SettingsField from "./settings-field.svelte";
  import ThemeSelector from "./theme-selector.svelte";
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
  </div>
  <div
    class="flex flex-wrap items-center justify-center gap-5 self-center font-semibold [&>*]:opacity-50 [&>*]:transition-opacity [&>*]:hover:opacity-100"
  >
    <p>Flaggle {import.meta.env.PACKAGE_VERSION}</p>
    <a
      href="https://github.com/khui0/flaggle"
      target="_blank"
      rel="noopener noreferrer"
      title="GitHub"
      class="text-lg"
    >
      <BiGithub></BiGithub>
    </a>
    <a href="http://" target="_blank" rel="noopener noreferrer"> kennyhui.dev </a>
  </div>
</GameContainer>
