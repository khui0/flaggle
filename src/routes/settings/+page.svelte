<script lang="ts">
  import { settings } from "$lib/settings.svelte";

  import SettingsField from "./settings-field.svelte";

  import GameContainer from "$lib/components/ui/game-container.svelte";
  import BiGithub from "~icons/bi/github";
  import SettingsFieldContainer from "./settings-field-container.svelte";
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
  <a href="https://github.com/khui0/flaggle" title="GitHub" class="self-center text-lg">
    <BiGithub></BiGithub>
  </a>
</GameContainer>
