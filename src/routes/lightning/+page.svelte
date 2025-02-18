<script lang="ts">
  import { lightningStreak } from "$lib/stats";
  import Streak from "$lib/components/Streak.svelte";

  import GameInput from "$lib/components/GameInput.svelte";
  import LightningFeed from "$lib/components/LightningFeed.svelte";
  import Confirm from "$lib/components/Confirm.svelte";

  import data from "$lib/data.json";

  import { db } from "$lib/db";
  import { onMount } from "svelte";
  import { settings } from "$lib/settings";
  import { fly } from "svelte/transition";

  let confirm: Confirm;

  interface Country {
    code: string;
    name: string;
  }

  interface Guess {
    win: boolean;
    name: string;
    code?: string;
  }

  // Game state
  let target: Country;
  let items: Guess[] = [];
  let isGameOver: boolean = false;
  let answer: string = "";

  onMount(() => {
    const flags =
      $settings?.identicalFlags === "true" ? data : data.filter((item) => !item.duplicate);
    const previous = parseInt(window.localStorage.getItem("unfinished-flaggle-lightning") || "");
    target = previous ? flags[previous] : getRandomTarget();
    // Play again on enter
    document.addEventListener("keydown", (e) => {
      if (e.key === "Enter" && isGameOver) {
        e.preventDefault();
        playAgain();
      }
    });
  });

  async function addGuess(e: CustomEvent) {
    if (isGameOver) return;
    const country: Country = e.detail;
    const win = checkWin(country);
    const guess: Guess = {
      win: win,
      name: country.name,
      code: country.code,
    };
    items = [...items, guess];
    if (items.length === 6) {
      giveUp();
      return;
    }
    if (win) {
      // Record game as win
      db.lightning.add({
        win,
        guesses: items.length,
      });
      // Increment streak
      const currentStreak = (await db.stats.get("lightning-streak"))?.value || 0;
      const maxStreak = (await db.stats.get("max-lightning-streak"))?.value || 0;
      db.stats.put({ name: "lightning-streak", value: currentStreak + 1 });
      if (currentStreak + 1 > maxStreak) {
        // Record current streak as max streak
        db.stats.put({ name: "max-lightning-streak", value: currentStreak + 1 });
      }
      // Remove unfinished game state
      window.localStorage.removeItem("unfinished-flaggle-lightning");
      // Mark game as over
      isGameOver = true;
    }
  }

  function checkWin(guess: Country): boolean {
    if (target.code === guess.code) {
      return true;
    }
    return false;
  }

  function getRandomTarget(): Country {
    const flags =
      $settings?.identicalFlags === "true" ? data : data.filter((item) => !item.duplicate);
    const max = flags.length;
    let index;
    do {
      index = Math.floor(Math.random() * max);
    } while (flags[index] === target);
    // Store game state
    window.localStorage.setItem("unfinished-flaggle-lightning", index.toString());
    return flags[index];
  }

  function playAgain() {
    target = getRandomTarget();
    items = [];
    isGameOver = false;
    answer = "";
  }

  function giveUp() {
    // Display correct answer
    answer = target.name;
    // Record game as loss
    db.lightning.add({
      win: false,
      guesses: items.length,
    });
    // Reset streak to 0
    db.stats.put({ name: "lightning-streak", value: 0 });
    // Remove unfinished game state
    window.localStorage.removeItem("unfinished-flaggle-lightning");
    isGameOver = true;
  }
</script>

{#if target}
  <div class="h-[20vw] min-h-20 max-h-48 flex justify-center">
    <img
      src="./flags/{target?.code}.png"
      alt="Target flag"
      class="bg-base-100/50 aspect-[3/2] pointer-events-none"
    />
  </div>
{/if}
<div class="flex gap-2">
  {#if $lightningStreak > 0}
    <div class="text-xl flex items-center px-1">
      <Streak value={$lightningStreak}></Streak>
    </div>
  {/if}
  {#if !isGameOver}
    <div class="flex-1">
      <GameInput on:submit={addGuess}></GameInput>
    </div>
  {:else}
    <p in:fly={{ duration: 500, x: -50 }} class="font-[BigNoodleTitling] italic text-4xl">
      {target.name}
    </p>
  {/if}
</div>
{#if answer !== ""}
  <p class="mx-auto">Answer: {answer}</p>
{/if}
<LightningFeed {items}></LightningFeed>
{#if !isGameOver}
  <button
    class="font-[BigNoodleTitling] italic text-2xl text-base-content/50 hover:text-error transition-colors btn self-center"
    on:click={() => {
      confirm
        .prompt("Are you sure you want to give up?", "This will reset your streak!", "Give Up")
        .then(giveUp);
    }}>Give Up</button
  >
{:else}
  <button
    class="font-[BigNoodleTitling] font-normal italic text-2xl btn self-center"
    on:click={playAgain}
  >
    Play Again
  </button>
{/if}
<Confirm bind:this={confirm}></Confirm>
