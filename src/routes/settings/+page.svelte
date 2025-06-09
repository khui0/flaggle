<script lang="ts">
  import { settings } from "$lib/settings.svelte";

  import SettingsField from "./settings-field.svelte";
  import Confirm from "$lib/components/modal/confirm.svelte";

  import BiGithub from "~icons/bi/github";
  import GameContainer from "$lib/components/ui/game-container.svelte";

  let confirm: Confirm;

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

<GameContainer>
  {#snippet title()}
    Settings
  {/snippet}
  <div class="flex flex-col">
    <SettingsField type="select" title="Theme" options={themes} bind:value={$settings.theme}>
      Select a theme
    </SettingsField>
    <SettingsField type="toggle" title="Dark Background" bind:value={$settings.diffDarkBg}>
      Use a dark background behind the flag similarity regardless of theme
    </SettingsField>
    <SettingsField
      type="toggle"
      title="Allow identical flags"
      bind:value={$settings.identicalFlags}
    >
      Allow identical flags such as Norway, Bouvet Island, and Svalbard and Jan Mayen
    </SettingsField>
    <SettingsField type="toggle" title="Legacy tab behavior" bind:value={$settings.legacyTab}>
      When enabled, tab will insert the highlighted result instead of selecting the next one
    </SettingsField>
  </div>
  <a href="https://github.com/khui0/flaggle" title="GitHub" class="self-center text-2xl">
    <BiGithub></BiGithub>
  </a>
</GameContainer>

<Confirm bind:this={confirm}></Confirm>
