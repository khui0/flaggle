<script lang="ts">
  import { flags } from "$lib/content";
  import { db } from "$lib/db";
  import { onMount } from "svelte";
  import { fade } from "svelte/transition";
  import LucideDownload from "~icons/lucide/download";

  let isLoading: boolean = $state(false);
  let percentage: number = $state(25);
  let message = $state("");

  let startTime: number = 0;

  onMount(async () => {
    isLoading = true;
    startTime = Date.now();
    loadFlag(0);
  });

  async function loadFlag(index: number) {
    try {
      const code = flags[index].code;
      if (!(await db.assets.get(code))) {
        message = flags[index].name;

        const result = await fetch(`/flags/${flags[index].code}.png`);
        const blob = await result.blob();

        await db.assets.put({ code, blob });
      }

      if (index + 1 < flags.length) {
        percentage = Math.ceil((index / (flags.length - 1)) * 100);
        loadFlag(index + 1);
      } else {
        const elapsed = Date.now() - startTime;
        message = `Done ${(elapsed / 1000).toFixed(2)}s`;
        console.log("Download duration: ", elapsed);
        setTimeout(() => {
          isLoading = false;
        }, 3000);
      }
    } catch {
      console.error(index);
    }
  }
</script>

{#if isLoading}
  <div
    in:fade
    out:fade={{ delay: 1000 }}
    class="bg-base-200 rounded-field pointer-events-none fixed right-0 bottom-0 z-[100] m-5 mb-10 flex w-48 flex-col p-2 shadow-lg"
  >
    <div class="flex items-center gap-2 overflow-hidden p-0.5">
      <span><LucideDownload /></span>
      <p class="overflow-hidden leading-none text-ellipsis whitespace-nowrap">{message}</p>
    </div>
    <div class="bg-base-300 right-0 bottom-0 left-0 mt-1.5 h-1 overflow-hidden rounded-full">
      <div class="bg-accent h-full" style="width: {percentage}%;"></div>
    </div>
  </div>
{/if}
