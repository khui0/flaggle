<script lang="ts">
  import { streak } from "$lib/stats";
  import Streak from "$lib/components/widgets/streak.svelte";
  import FlagInput from "$lib/components/widgets/flag-input.svelte";
  import ClassicFeed from "$lib/components/widgets/classic-feed.svelte";
  import Confirm from "$lib/components/modal/confirm.svelte";
  import { generateDiff } from "$lib/diff";
  import data from "$lib/assets/flags/data.json";
  import { db } from "$lib/db";
  import { onMount } from "svelte";
  import { settings } from "$lib/settings";
  import { fly } from "svelte/transition";
  import GameContainer from "$lib/components/ui/game-container.svelte";
  import type { Flag } from "$lib/content";

  interface Guess extends Flag {
    diff?: string;
    win?: boolean;
  }

  let confirm: Confirm;

  // Game state
  let target: Flag;
  let items: Guess[] = [];
  let isGameOver: boolean = false;

  onMount(() => {
    const flags =
      $settings?.identicalFlags === "true" ? data : data.filter((item) => !item.duplicate);
    const previous = parseInt(window.localStorage.getItem("unfinished-flaggle-classic") || "");
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
    const country: Flag = e.detail;
    const diff = await generateDiff(country, target);
    const win = checkWin(country);
    const guess: Guess = {
      code: country.code,
      name: country.name,
      diff: diff,
      win: win,
    };
    items = [guess, ...items];
    if (win) {
      // Record game as win
      db.classic.add({
        win,
        guesses: items.length,
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
      isGameOver = true;
    }
  }

  function checkWin(guess: Flag): boolean {
    if (target.code === guess.code) {
      return true;
    }
    return false;
  }

  function getRandomTarget(): Flag {
    const flags =
      $settings?.identicalFlags === "true" ? data : data.filter((item) => !item.duplicate);
    const max = flags.length;
    let index;
    do {
      index = Math.floor(Math.random() * max);
    } while (flags[index] === target);
    // Store game state
    window.localStorage.setItem("unfinished-flaggle-classic", index.toString());
    return flags[index];
  }

  function playAgain() {
    target = getRandomTarget();
    items = [];
    isGameOver = false;
  }

  function giveUp() {
    isGameOver = true;
    // Display correct answer
    const guess: Guess = {
      code: target.code,
      name: target.name,
    };
    // Record game as loss
    db.classic.add({
      win: false,
      guesses: items.length,
    });
    // Reset streak to 0
    db.stats.put({ name: "streak", value: 0 });
    items = [guess, ...items];
    // Remove unfinished game state
    window.localStorage.removeItem("unfinished-flaggle-classic");
  }
</script>

<GameContainer>
  {#snippet header()}
    <div class="flex gap-2">
      {#if $streak > 0}
        <div class="flex items-center px-1 text-xl">
          <Streak value={$streak}></Streak>
        </div>
      {/if}
      <div class="flex flex-1 items-center justify-between">
        {#if !isGameOver}
          <FlagInput on:submit={addGuess}></FlagInput>
        {:else}
          <p in:fly={{ duration: 500, x: -50 }} class="font-[BigNoodleTitling] text-4xl italic">
            {target.name}
          </p>
          <button class="btn font-title text-2xl" on:click={playAgain}> Play Again </button>
        {/if}
      </div>
    </div>
  {/snippet}
  <ClassicFeed {items} />
  {#if items.length > 0 && !isGameOver}
    <button
      class="btn font-title self-center text-2xl opacity-50 transition-opacity hover:opacity-100"
      on:click={() => {
        confirm
          .prompt("Are you sure you want to give up?", "This will reset your streak!", "Give Up")
          .then(giveUp);
      }}
    >
      Give Up
    </button>
  {/if}
</GameContainer>

<Confirm bind:this={confirm}></Confirm>
