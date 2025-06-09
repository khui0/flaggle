import { db, type DailyResult } from "$lib/db";
import { liveQuery } from "dexie";

import { getDeltaDay } from "$lib/date";
import { writable, type Writable } from "svelte/store";

export const streak: Writable<number> = writable(0);
liveQuery(() => db.stats.get("streak")).subscribe((stat) => {
  if (!stat) return;
  streak.set(stat.value);
});

export const maxStreak: Writable<number> = writable(0);
liveQuery(() => db.stats.get("max-streak")).subscribe((stat) => {
  if (!stat) return;
  maxStreak.set(stat.value);
});

export const classicWins: Writable<number> = writable(0);
export const classicLosses: Writable<number> = writable(0);
export const classicAverageGuesses: Writable<string> = writable("0");

export const classic = liveQuery(() => db.classic.toArray());
classic.subscribe((results) => {
  classicWins.set(results?.filter((result) => result.win).length);
  classicLosses.set(results?.filter((result) => !result.win).length);
  classicAverageGuesses.set(
    average(results?.filter((result) => result.win).map((result) => result.guesses))?.toFixed(2) ||
      "0",
  );
});

export const lightningStreak: Writable<number> = writable(0);
liveQuery(() => db.stats.get("lightning-streak")).subscribe((stat) => {
  if (!stat) return;
  lightningStreak.set(stat.value);
});

export const maxLightningStreak: Writable<number> = writable(0);
liveQuery(() => db.stats.get("max-lightning-streak")).subscribe((stat) => {
  if (!stat) return;
  maxLightningStreak.set(stat.value);
});

export const lightningWins: Writable<number> = writable(0);
export const lightningLosses: Writable<number> = writable(0);
export const lightningAverageGuesses: Writable<string> = writable("0");

export const lightning = liveQuery(() => db.lightning.toArray());
lightning.subscribe((results) => {
  lightningWins.set(results?.filter((result) => result.win).length);
  lightningLosses.set(results?.filter((result) => !result.win).length);
  lightningAverageGuesses.set(
    average(results?.filter((result) => result.win).map((result) => result.guesses))?.toFixed(2) ||
      "0",
  );
});

export const dailyStreak: Writable<number> = writable(0);

const daily = liveQuery(() => db.daily.toArray());
daily.subscribe((dates) => {
  dailyStreak.set(calculateDailyStreak(dates) || 0);
});

function calculateDailyStreak(dates: DailyResult[]) {
  let streak: number = 0;
  for (let i = dates.length - 1; i >= 0; i--) {
    const targetDelta = i - dates.length + 1;
    const currentDelta = getDeltaDay(dates[i].date);
    if (targetDelta === currentDelta) streak++;
  }
  return streak;
}

function average(array: number[]) {
  if (array.length === 0) return;
  return array.reduce((a, b) => a + b) / array.length;
}

export async function serializeSave(): Promise<string> {
  const data: string[] = [];

  data[0] = import.meta.env.PACKAGE_VERSION || "unknown_version";

  // Play time [all, classic, lightning, daily]
  data[1] = [0, 0, 0, 0].join(",");

  // Classic [streak, maxStreak, history]
  data[2] = [
    (await db.stats.get("streak"))?.value || 0,
    (await db.stats.get("max-streak"))?.value || 0,
    compressClassicLightningHistory(await db.classic.toArray()),
  ].join(",");

  // Lightning [streak, maxStreak, history]
  data[3] = [
    (await db.stats.get("lightning-streak"))?.value || 0,
    (await db.stats.get("max-lightning-streak"))?.value || 0,
    compressClassicLightningHistory(await db.lightning.toArray()),
  ].join(",");

  // Daily [history]
  data[4] = [compressDailyHistory(await db.daily.toArray())].join(",");

  return "FLAGGLE_" + btoa(data.join("|"));
}

function compressClassicLightningHistory(history: { win: boolean; guesses: number }[]): string {
  return history.map((item) => `${item.win ? "" : "-"}${item.guesses}`).join(":");
}

function compressDailyHistory(history: { date: string; guesses: number }[]): string {
  return history.map((item) => `${item.date}+${item.guesses}`).join(":");
}
