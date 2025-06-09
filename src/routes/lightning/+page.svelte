<script lang="ts">
  import Confirm from "$lib/components/modal/confirm.svelte";
  import GameContainer from "$lib/components/ui/game-container.svelte";
  import FlagInput from "$lib/components/widgets/flag-input.svelte";
  import LightningFeed from "$lib/components/widgets/lightning-feed.svelte";
  import Streak from "$lib/components/widgets/streak.svelte";
  import { flags, getRandomFlag, type Flag } from "$lib/content";
  import { db } from "$lib/db";
  import { lightningStreak } from "$lib/stats";
  import { onMount } from "svelte";
  import { fly } from "svelte/transition";

  let confirm: Confirm;

  interface Guess {
    win: boolean;
    name: string;
    code?: string;
  }

  // Game state
  let target: Flag;
  let items: Guess[] = [];
  let isGameOver: boolean = false;
  let answer: string = "";

  onMount(() => {
    const previous = parseInt(window.localStorage.getItem("unfinished-flaggle-lightning") || "");
    target = previous ? flags[previous] : getRandomFlag();
    // Play again on enter
    document.addEventListener("keydown", (e) => {
      if (e.key === "Enter" && isGameOver) {
        e.preventDefault();
        playAgain();
      }
    });
  });

  async function addGuess(flag: Flag) {
    if (isGameOver) return;
    const win = checkWin(flag);
    const guess: Guess = {
      win: win,
      name: flag.name,
      code: flag.code,
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

  function checkWin(guess: Flag): boolean {
    if (target.code === guess.code) {
      return true;
    }
    return false;
  }

  function playAgain() {
    target = getRandomFlag();
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

<GameContainer>
  {#if target}
    <div class="flex justify-center">
      <img
        src="./flags/{target?.code}.png"
        alt="Target flag"
        class="bg-base-100/50 pointer-events-none aspect-[3/2] w-1/2 max-w-sm"
      />
    </div>
  {/if}
  <div class="flex gap-2">
    {#if $lightningStreak > 0}
      <div class="flex items-center px-1 text-xl">
        <Streak value={$lightningStreak}></Streak>
      </div>
    {/if}
    {#if !isGameOver}
      <div class="flex-1">
        <FlagInput onsubmit={addGuess}></FlagInput>
      </div>
    {:else}
      <p in:fly={{ duration: 500, x: -50 }} class="font-[BigNoodleTitling] text-4xl italic">
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
      class="btn font-title self-center text-2xl opacity-50 transition-opacity hover:opacity-100"
      on:click={() => {
        confirm.prompt();
      }}
    >
      Give Up
    </button>
  {:else}
    <button class="btn font-title self-center text-2xl" on:click={playAgain}> Play Again </button>
  {/if}
</GameContainer>

<Confirm
  bind:this={confirm}
  title="Are you sure you want to give up?"
  body="This will reset your streak!"
  action="Give Up"
  onaccept={giveUp}
/>
