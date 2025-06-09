<script lang="ts">
  import { theme } from "$lib/theme";
  import TablerSun from "~icons/tabler/sun";
  import TablerMoon from "~icons/tabler/moon";
  import TablerDeviceDesktop from "~icons/tabler/device-desktop";
</script>

<div aria-label="theme selector" role="radiogroup" class="grid grid-cols-3">
  <button
    role="radio"
    aria-label="follow system theme"
    aria-checked={$theme === "auto"}
    class={{
      "focus-ring hover:bg-base-content/10 rounded-field text-base-content/50 p-1 text-[16px] transition-colors duration-300": true,
      "text-base-content/100 dark:drop-shadow-[0_0_2px_white]": $theme === "auto",
    }}
    onclick={() => {
      $theme = "auto";
    }}
  >
    <TablerDeviceDesktop />
  </button>
  <button
    role="radio"
    aria-label="dark theme"
    aria-checked={$theme === "light"}
    class={{
      "focus-ring hover:bg-base-content/10 rounded-field text-base-content/50 p-1 text-[16px] transition-colors duration-300": true,
      "text-base-content/100": $theme === "light",
    }}
    onclick={() => {
      $theme = "light";
    }}
  >
    <TablerSun />
  </button>
  <button
    role="radio"
    aria-label="light theme"
    aria-checked={$theme === "dark"}
    class={{
      "focus-ring hover:bg-base-content/10 rounded-field text-base-content/50 p-1 text-[16px] transition-colors duration-300": true,
      "text-base-content/100 drop-shadow-[0_0_2px_white]": $theme === "dark",
    }}
    onclick={() => {
      $theme = "dark";
    }}
  >
    <TablerMoon />
  </button>
</div>
