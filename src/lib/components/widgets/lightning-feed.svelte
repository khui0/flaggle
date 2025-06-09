<script lang="ts">
  interface Guess {
    win: boolean;
    name: string;
    code?: string;
  }

  export let items: Guess[] = [];
</script>

<div class="flex flex-col gap-2 overflow-auto">
  {#each Array(6) as _, i}
    {@const guess = items[i]}
    {#if guess}
      <div
        class="bg-base-200/50 rounded-field flex h-8 items-center justify-center gap-4"
        class:correct={guess?.win}
        class:incorrect={!guess?.win}
      >
        {#if guess.code}
          <img
            src="./flags/{guess.code}.png"
            alt={guess.name}
            class="bg-base-100/50 aspect-[3/2] h-full"
          />
        {/if}
        <p>{guess.name}</p>
      </div>
    {:else}
      <div class="bg-base-200/50 rounded-field flex h-8 items-center justify-center gap-4"></div>
    {/if}
  {/each}
</div>

<style>
  @reference "../../../app.css";

  .correct {
    @apply bg-primary text-primary-content;
  }
  .incorrect {
    @apply bg-base-300;
  }
</style>
