<script lang="ts">
  import { browser } from "$app/environment";
  import Confirm from "$lib/components/modal/confirm.svelte";
  import GameContainer from "$lib/components/ui/game-container.svelte";
  import ClassicFeed from "$lib/components/widgets/classic-feed.svelte";
  import FlagInput from "$lib/components/widgets/flag-input.svelte";
  import Streak from "$lib/components/widgets/streak.svelte";
  import { getRandomFlag, type Flag } from "$lib/content";
  import { db } from "$lib/db";
  import { generateDiff } from "$lib/diff";
  import { streak } from "$lib/stats";
  import { onMount } from "svelte";
  import { fly } from "svelte/transition";

  interface Guess extends Flag {
    diff?: string;
    win?: boolean;
  }

  let confirm: Confirm;

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
    browser && JSON.parse(localStorage.getItem("classic-game-state") || "{}");

  let gameState: GameState = $state(Object.assign({}, defaultGameState, storedGameState));

  $effect(() => {
    localStorage.setItem("classic-game-state", JSON.stringify(gameState));
  });

  onMount(() => {
    if (gameState.target === null) {
      playAgain();
    }
  });

  async function addGuess(flag: Flag) {
    if (gameState.target === null) return;
    if (gameState.isGameOver) return;

    const diff = await generateDiff(flag, gameState.target);
    const win = checkWin(flag);
    const guess: Guess = {
      code: flag.code,
      name: flag.name,
      diff: diff,
      win: win,
    };
    gameState.guesses = [guess, ...gameState.guesses];

    if (win) {
      // Record game as win
      db.classic.add({
        win,
        guesses: gameState.guesses.length,
      });
      // Increment streak
      const currentStreak = (await db.stats.get("streak"))?.value || 0;
      const maxStreak = (await db.stats.get("max-streak"))?.value || 0;
      db.stats.put({ name: "streak", value: currentStreak + 1 });
      if (currentStreak + 1 > maxStreak) {
        // Record current streak as max streak
        db.stats.put({ name: "max-streak", value: currentStreak + 1 });
      }
      // Remove unfinished game state
      window.localStorage.removeItem("unfinished-flaggle-classic");
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
    db.stats.put({ name: "classic-streak", value: 0 });
    // Record game as loss
    db.classic.add({
      win: false,
      guesses: gameState.guesses.length,
    });
    // Update state
    gameState.isGameOver = true;
    gameState.guesses = [gameState.target, ...gameState.guesses];
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
  {#snippet header()}
    <div class="flex gap-2">
      {#if $streak > 0}
        <div class="flex items-center px-1 text-xl">
          <Streak value={$streak}></Streak>
        </div>
      {/if}
      <div class="flex flex-1 items-center justify-between">
        {#if !gameState.isGameOver}
          <FlagInput onsubmit={addGuess}></FlagInput>
        {:else}
          <p in:fly={{ duration: 500, x: -50 }} class="font-title">
            {gameState.target?.name}
          </p>
          <button class="btn font-title text-2xl" onclick={playAgain}> Play Again </button>
        {/if}
      </div>
    </div>
  {/snippet}
  <ClassicFeed items={gameState.guesses} />
  {#if gameState.guesses.length > 0 && !gameState.isGameOver}
    <button
      class="btn font-title self-center text-2xl opacity-50 transition-opacity hover:opacity-100"
      onclick={() => {
        confirm.prompt();
      }}
    >
      Give Up
    </button>
  {/if}
</GameContainer>

<Confirm
  bind:this={confirm}
  title="Are you sure you want to give up?"
  body="This will reset your streak!"
  action="Give Up"
  onaccept={giveUp}
/>
