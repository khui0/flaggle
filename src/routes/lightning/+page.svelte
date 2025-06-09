<script lang="ts">
  import { browser } from "$app/environment";
  import Confirm from "$lib/components/modal/confirm.svelte";
  import GameContainer from "$lib/components/ui/game-container.svelte";
  import FlagInput from "$lib/components/widgets/flag-input.svelte";
  import LightningFeed from "$lib/components/widgets/lightning-feed.svelte";
  import Streak from "$lib/components/widgets/streak.svelte";
  import { getRandomFlag, type Flag } from "$lib/content";
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

  interface GameState {
    target: Flag | null;
    guesses: Guess[];
    isGameOver: boolean;
  }

  const defaultGameState: GameState = {
    target: null,
    guesses: [],
    isGameOver: false,
  };

  const storedGameState: GameState =
    browser && JSON.parse(localStorage.getItem("lightning-game-state") || "{}");

  let gameState: GameState = $state(Object.assign({}, defaultGameState, storedGameState));

  $effect(() => {
    localStorage.setItem("lightning-game-state", JSON.stringify(gameState));
  });

  onMount(() => {
    if (gameState.target === null) {
      playAgain();
    }
  });

  async function addGuess(flag: Flag) {
    if (gameState.isGameOver) return;
    const win = checkWin(flag);
    const guess: Guess = {
      win: win,
      name: flag.name,
      code: flag.code,
    };
    gameState.guesses = [...gameState.guesses, guess];
    if (gameState.guesses.length === 6) {
      gameState.isGameOver = true;
      return;
    }
    if (win) {
      // Record game as win
      db.lightning.add({
        win,
        guesses: gameState.guesses.length,
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
      gameState.isGameOver = true;
    }
  }

  function checkWin(guess: Flag): boolean {
    if (gameState.target === null) return false;
    if (gameState.target.code === guess.code) {
      return true;
    }
    return false;
  }

  function playAgain() {
    gameState = Object.assign({}, defaultGameState);
    gameState.target = getRandomFlag();
  }

  function giveUp() {
    if (gameState.target === null) return;
    // Reset streak to 0
    db.stats.put({ name: "lightning-streak", value: 0 });
    // Record game as loss
    db.lightning.add({
      win: false,
      guesses: gameState.guesses.length,
    });
    // Update state
    gameState.isGameOver = true;
  }
</script>

<svelte:document
  onkeydown={(e) => {
    if (e.key === "Enter" && gameState.isGameOver) {
      e.preventDefault();
      playAgain();
    }
  }}
/>

<GameContainer>
  {#if gameState.target !== null}
    <div class="flex justify-center">
      <img
        src="./flags/{gameState.target.code}.png"
        alt="Target flag"
        class="bg-base-100/50 pointer-events-none aspect-[3/2] w-1/2 max-w-sm"
      />
    </div>
  {/if}
  <div class="flex gap-2">
    {#if $lightningStreak > 0}
      <div class="gameState.guesses-center flex px-1 text-xl">
        <Streak value={$lightningStreak}></Streak>
      </div>
    {/if}
    {#if !gameState.isGameOver}
      <div class="flex-1">
        <FlagInput onsubmit={addGuess}></FlagInput>
      </div>
    {:else}
      <p in:fly={{ duration: 500, x: -50 }} class="font-title">
        {gameState.target?.name}
      </p>
    {/if}
  </div>
  <LightningFeed items={gameState.guesses}></LightningFeed>
  {#if !gameState.isGameOver}
    <button
      class="btn font-title self-center text-2xl opacity-50 transition-opacity hover:opacity-100"
      onclick={() => {
        confirm.prompt();
      }}
    >
      Give Up
    </button>
  {:else}
    <button class="btn font-title self-center text-2xl" onclick={playAgain}> Play Again </button>
  {/if}
</GameContainer>

<Confirm
  bind:this={confirm}
  title="Are you sure you want to give up?"
  body="This will reset your streak!"
  action="Give Up"
  onaccept={giveUp}
/>
