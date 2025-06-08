<script lang="ts">
  import MainMenuItem from "$lib/components/MainMenuItem.svelte";

  import LucideCalendarDays from "~icons/lucide/calendar-days";
  import LucideFlag from "~icons/lucide/flag";
  import LucideZap from "~icons/lucide/zap";
  import LucideBookOpen from "~icons/lucide/book-open";
  import LucideSettings from "~icons/lucide/settings";
</script>

<div class="flex items-center gap-3">
  <enhanced:img src="$lib/assets/branding/flaggle.svg" class="h-12 w-auto" alt="Flaggle icon" />
  <h1 class="font-[BigNoodleTitling] text-6xl italic">Flaggle</h1>
</div>
<MainMenuItem href="/daily" title="Daily">
  A new flag every day
  <span slot="icon"><LucideCalendarDays></LucideCalendarDays></span>
</MainMenuItem>
<MainMenuItem href="/classic" title="Classic">
  Match colors and shapes
  <span slot="icon"><LucideFlag></LucideFlag></span>
</MainMenuItem>
<MainMenuItem href="/lightning" title="Lightning">
  Fast-paced quick identification
  <span slot="icon"><LucideZap></LucideZap></span>
</MainMenuItem>
<MainMenuItem href="/reference" title="Reference">
  View all flags
  <span slot="icon"><LucideBookOpen></LucideBookOpen></span>
</MainMenuItem>
<MainMenuItem href="/settings" title="Settings">
  Manage preferences
  <span slot="icon"><LucideSettings></LucideSettings></span>
</MainMenuItem>
