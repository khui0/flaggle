<script lang="ts">
  import FlagBackground from "$lib/components/ui/flag-background.svelte";
  import MenuButton from "$lib/components/ui/menu-button.svelte";
  import LucideBookOpen from "~icons/lucide/book-open";
  import LucideCalendarDays from "~icons/lucide/calendar-days";
  import LucideFlag from "~icons/lucide/flag";
  import LucideSettings from "~icons/lucide/settings";
  import LucideZap from "~icons/lucide/zap";
</script>

<div class="fixed inset-0 z-0 flex items-center justify-center overflow-hidden">
  <FlagBackground />
</div>
<div class="fixed inset-0 z-10 flex flex-col items-center justify-center gap-5 p-10">
  <div class="flex items-center gap-5">
    <enhanced:img src="$lib/assets/branding/flaggle.svg" class="h-19 w-19 drop-shadow-lg drop-shadow-black/50" alt="Flaggle icon" />
    <h1 class="font-title text-8xl leading-none text-shadow-lg text-shadow-black/50">Flaggle</h1>
  </div>
  <div class="grid w-full max-w-4xl grid-cols-2 gap-2 md:grid-cols-5">
    <MenuButton href="/daily" label="Daily">
      <LucideCalendarDays />
    </MenuButton>
    <MenuButton href="/classic" label="Classic">
      <LucideFlag />
    </MenuButton>
    <MenuButton href="/lightning" label="Lightning">
      <LucideZap />
    </MenuButton>
    <MenuButton href="/reference" label="Reference">
      <LucideBookOpen />
    </MenuButton>
    <MenuButton href="/settings" label="Settings">
      <LucideSettings />
    </MenuButton>
  </div>
</div>
