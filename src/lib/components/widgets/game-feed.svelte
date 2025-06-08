<script lang="ts">
  import { settings } from "$lib/settings";

  interface Country {
    code: string;
    name: string;
  }

  interface Guess extends Country {
    diff?: string;
    win?: boolean;
  }

  export let items: Guess[] = [];
</script>

<div class="flex flex-col gap-4 overflow-auto">
  {#each items as guess, i}
    <div
      class="bg-base-200/50 rounded-box relative flex h-[20vw] max-h-48 min-h-20 items-end rounded-r-none {guess.win
        ? 'from-accent via-base-200 to-base-200 bg-gradient-to-r'
        : ''}"
    >
      <p class="absolute top-0 left-0 m-4 text-5xl">
        <span class="text-base-content/25 font-[BigNoodleTitling] italic"
          >{guess.diff ? items.length - i : "Answer"}</span
        >
        {guess.win ? "" : ""}
      </p>
      <p class="mx-4 my-3 font-[BigNoodleTitling] text-2xl italic">{guess.name}</p>
      <img
        src="./flags/{guess.code}.png"
        alt={guess.name}
        class="bg-base-100/50 ml-auto aspect-[3/2] h-full"
      />
      {#if guess.diff}
        <img
          src={guess.diff}
          alt="{guess.name} diff"
          class="{$settings.diffDarkBg === 'true'
            ? 'bg-[#1a1a1a]'
            : 'bg-base-100/50'} ml-2 aspect-[3/2] h-full"
        />
      {/if}
    </div>
  {/each}
</div>
