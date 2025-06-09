<script lang="ts">
  import { settings } from "$lib/settings.svelte";

  interface Country {
    code: string;
    name: string;
  }

  interface Guess extends Country {
    diff?: string;
    win?: boolean;
  }

  let { items }: { items: Guess[] } = $props();
</script>

<div class="relative z-0 flex flex-col gap-4">
  {#each items as guess, i}
    <div
      class={{
        "bg-base-200/50 rounded-box relative flex shrink-0 flex-col-reverse max-sm:items-center sm:flex-row sm:items-stretch": true,
        "text-accent-content": guess.win,
      }}
    >
      {#if guess.win}
        <div
          class="bg-accent absolute bottom-0 left-0 z-0 h-1/2 w-full rounded-[inherit] max-sm:mask-t-from-0% sm:h-full sm:w-1/2 sm:mask-r-from-0%"
        ></div>
      {/if}
      <p class="absolute top-0 left-0 z-30 m-4 max-sm:hidden">
        <span class="text-base-content/25 font-title text-5xl">
          {guess.diff ? items.length - i : "Answer"}
        </span>
      </p>
      <div class="z-30 flex w-full min-w-48 flex-1 items-end px-2.5 py-2 sm:px-3.5 sm:py-3">
        <p class="font-title w-full text-2xl leading-none">
          <span class="text-base-content/25 font-title mr-1 text-2xl leading-none sm:hidden">
            {guess.diff ? items.length - i : "Answer"}
          </span>
          {guess.name}
        </p>
      </div>
      <div class="z-30 grid grid-cols-2">
        <img
          src="./flags/{guess.code}.png"
          alt={guess.name}
          class="bg-base-100/50 ml-auto aspect-[3/2] h-full max-h-48"
        />
        <div
          class={{
            "z-30 aspect-[3/2] h-full max-h-48": true,
            "bg-[#1a1a1a]": $settings.diffDarkBg === "true",
            "bg-base-200": $settings.diffDarkBg !== "true",
          }}
        >
          {#if guess.diff}
            <img src={guess.diff} alt="{guess.name} difference" />
          {/if}
        </div>
      </div>
    </div>
  {/each}
</div>
