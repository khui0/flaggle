<script lang="ts">
  import data from "$lib/assets/flags/data.json";
  import CopyButton from "$lib/components/ui/copy-button.svelte";
  import GameContainer from "$lib/components/ui/game-container.svelte";
  import ClassicFeed from "$lib/components/widgets/classic-feed.svelte";
  import FlagInput from "$lib/components/widgets/flag-input.svelte";
  import type { Flag } from "$lib/content";
  import { getDeltaDay } from "$lib/date";
  import { db } from "$lib/db";
  import { generateDiff } from "$lib/diff";
  import { dailyStreak } from "$lib/stats";
  import { sha256 } from "@oslojs/crypto/sha2";
  import { liveQuery } from "dexie";
  import pluralize from "pluralize";
  import { onMount } from "svelte";

  interface Guess extends Flag {
    diff?: string;
    win?: boolean;
  }

  const dailyNumber = getDeltaDay("2024-06-06") * -1 + 1;

  const date = new Date().toLocaleDateString("en-US", {
    month: "numeric",
    day: "2-digit",
    year: "numeric",
  });

  let ISODate: string;

  // Game state
  let target: Flag | null = $state(null);
  let items: Guess[] = $state([]);
  let isGameOver: boolean = $state(false);
  let guesses: number = $state(0);
  let solved: boolean = $state(false);

  const daily = liveQuery(() => db.daily.get(ISODate));

  let shareString = $derived(
    `🏁 Flaggle #${dailyNumber} ${date} in ${pluralize("guess", $daily?.guesses || guesses, true)}! 👉 https://flaggle.kennyhui.dev/daily`,
  );

  onMount(async () => {
    // Generate a random number by hashing date and using the first 3 characters as a hex number
    const tzo = new Date().getTimezoneOffset() * 60_000;
    const date = new Date(Date.now() - tzo).toISOString().split("T")[0];
    ISODate = date;
    const hash = await sha256(new TextEncoder().encode(date));
    const rnd = (hash[0] + hash[1]) / (255 * 2);
    const index = Math.floor(rnd * data.length);
    target = data[index];

    // Fill previously guessed items
    const previouslyGuessed: Guess[] = JSON.parse(
      localStorage.getItem("daily-prev-guessed") || "[]",
    );
    const previouslyGuessedDate = localStorage.getItem("daily-prev-guessed-date");
    // Different day; reset
    if (!previouslyGuessedDate || previouslyGuessedDate != ISODate) {
      localStorage.removeItem("daily-prev-guessed");
    } else if (previouslyGuessed) {
      items = previouslyGuessed;
    }
  });

  // Show results if today has already been played
  daily.subscribe((daily) => {
    if (daily?.guesses) solved = true;
  });

  async function addGuess(flag: Flag) {
    if (isGameOver) return;
    if (target === null) return;
    const diff = await generateDiff(flag, target);
    const win = checkWin(flag);
    const guess: Guess = {
      code: flag.code,
      name: flag.name,
      diff: diff,
      win: win,
    };
    items = [guess, ...items];
    guesses++;
    if (win) {
      // Record today as win if there is not existing record
      const exists = (await db.daily.get(ISODate)) !== undefined;
      if (!exists) db.daily.put({ date: ISODate, guesses: items.length }, ISODate);
      // Show results modal
      solved = true;
    }
    // Store guess history
    localStorage.setItem("daily-prev-guessed", JSON.stringify(items));
    localStorage.setItem("daily-prev-guessed-date", ISODate);
  }

  function checkWin(guess: Flag): boolean {
    if (target?.code === guess.code) {
      isGameOver = true;
      return true;
    }
    return false;
  }
</script>

{#if solved}
  <div class="bg-base-100 absolute inset-0 flex flex-col items-center justify-center gap-4">
    <p>You solved today's <b>Flaggle #{dailyNumber}</b> in</p>
    <p class="mb-2 font-[BigNoodleTitling] text-5xl italic">
      {pluralize("guess", $daily?.guesses || guesses, true)}
    </p>
    <p>You now have a <b>{$dailyStreak} day</b> streak!</p>
    <CopyButton content={shareString}>Copy Results</CopyButton>
  </div>
{:else}
  <GameContainer>
    {#snippet title()}
      Flaggle <span class="text-base-content/50">#{dailyNumber}</span>
    {/snippet}
    {#snippet header()}
      {#if !(isGameOver || $daily?.guesses)}
        <FlagInput onsubmit={addGuess}></FlagInput>
      {/if}
    {/snippet}
    <ClassicFeed {items}></ClassicFeed>
  </GameContainer>
{/if}
