<script lang="ts">
  import { browser } from "$app/environment";
  import data from "$lib/assets/flags/data.json";
  import CopyButton from "$lib/components/ui/copy-button.svelte";
  import GameContainer from "$lib/components/ui/game-container.svelte";
  import ClassicFeed from "$lib/components/widgets/classic-feed.svelte";
  import FlagInput from "$lib/components/widgets/flag-input.svelte";
  import { flags, type Flag } from "$lib/content";
  import { db } from "$lib/db";
  import { generateDiff } from "$lib/diff";
  import { dailyStats } from "$lib/stats";
  import { sha256 } from "@oslojs/crypto/sha2";
  import dayjs from "dayjs";
  import { liveQuery } from "dexie";
  import pluralize from "pluralize";
  import { onMount } from "svelte";
  import { fade } from "svelte/transition";

  interface Guess extends Flag {
    diff?: string;
    win?: boolean;
  }

  interface GameState {
    date: string;
    target: Flag | null;
    guesses: Guess[];
  }

  const defaultGameState: GameState = {
    date: dayjs().format("YYYY-MM-DD"),
    target: null,
    guesses: [],
  };

  const storedGameState: GameState =
    browser && JSON.parse(localStorage.getItem("daily-game-state") || "{}");

  let gameState: GameState = $state(Object.assign({}, defaultGameState, storedGameState));

  $effect(() => {
    localStorage.setItem("daily-game-state", JSON.stringify(gameState));
  });

  const streak = dailyStats.streak;

  const previous = liveQuery(() => db.daily.get(dailyFlaggleDate));
  const dailyFlaggleNumber = dayjs().diff(dayjs("2024-06-06"), "day") + 1;
  const dailyFlaggleDate = $derived(dayjs().format("YYYY-MM-DD"));
  const shareString = $derived(
    `🏁 Flaggle #${dailyFlaggleNumber} ${dayjs().format("dddd, MMMM D")} in ${pluralize("guess", $previous?.guesses || gameState.guesses.length, true)}! 👉 https://flaggle.kennyhui.dev/daily`,
  );

  let solved: boolean = $state(false);

  previous.subscribe((record) => {
    if (record?.guesses) solved = true;
  });

  onMount(async () => {
    gameState.target = getDailyTarget();

    // Reset state if it's for a different date
    if (gameState.date !== dailyFlaggleDate) {
      gameState = Object.assign({}, defaultGameState);
    }
  });

  function getDailyTarget(): Flag {
    const hash = sha256(new TextEncoder().encode(dailyFlaggleDate));
    const rnd = (hash[0] + hash[1]) / (255 * 2);
    const index = Math.floor(rnd * data.length);
    return flags[index];
  }

  async function addGuess(flag: Flag) {
    if (gameState.target === null) return;

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
      solved = true;
      // Record today's game as win if there is not existing record
      if ($previous === undefined)
        db.daily.put(
          { date: dailyFlaggleDate, guesses: gameState.guesses.length },
          dailyFlaggleDate,
        );
    }
  }

  function checkWin(guess: Flag): boolean {
    if (gameState.target === null) return false;
    if (gameState.target.code === guess.code) {
      return true;
    }
    return false;
  }
</script>

<GameContainer>
  {#snippet title()}
    Flaggle <span class="text-base-content/50">#{dailyFlaggleNumber}</span>
  {/snippet}
  {#snippet header()}
    {#if !$previous?.guesses}
      <FlagInput onsubmit={addGuess} />
    {/if}
  {/snippet}
  <ClassicFeed items={gameState.guesses} />
</GameContainer>

{#if solved}
  <div
    in:fade={{ delay: 1000 }}
    class="bg-base-100 absolute inset-0 flex flex-col items-center justify-center gap-4"
  >
    <p>You solved today's <b>Flaggle #{dailyFlaggleNumber}</b> in</p>
    <p class="font-title mb-2 text-5xl">
      {pluralize("guess", $previous?.guesses || gameState.guesses.length, true)}
    </p>
    <p>You now have a <b>{$streak} day</b> streak!</p>
    <CopyButton content={shareString}>Copy Results</CopyButton>
  </div>
{/if}
