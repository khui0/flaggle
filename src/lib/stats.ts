import { db } from "$lib/db";
import dayjs from "dayjs";
import { liveQuery } from "dexie";

export const playTime = {
  all: liveQuery(() => db.stats.get("play-time").then((v) => v?.value || 0)),
  daily: liveQuery(() => db.stats.get("play-time/daily").then((v) => v?.value || 0)),
  classic: liveQuery(() => db.stats.get("play-time/classic").then((v) => v?.value || 0)),
  lightning: liveQuery(() => db.stats.get("play-time/lightning").then((v) => v?.value || 0)),
};

export const classicStats = {
  streak: liveQuery(() => db.stats.get("classic-streak").then((v) => v?.value || 0)),
  maxStreak: liveQuery(() => db.stats.get("classic-max-streak").then((v) => v?.value || 0)),
  wins: liveQuery(() => db.classic.filter((o) => o.win).count()),
  losses: liveQuery(() => db.classic.filter((o) => !o.win).count()),
  averageGuesses: liveQuery(() =>
    db.classic
      .filter((o) => o.win)
      .toArray()
      .then((arr) => average(arr.map((result) => result.guesses)) || 0),
  ),
};

export const lightningStats = {
  streak: liveQuery(() => db.stats.get("lightning-streak").then((v) => v?.value || 0)),
  maxStreak: liveQuery(() => db.stats.get("lightning-max-streak").then((v) => v?.value || 0)),
  wins: liveQuery(() => db.lightning.filter((o) => o.win).count()),
  losses: liveQuery(() => db.lightning.filter((o) => !o.win).count()),
  averageGuesses: liveQuery(() =>
    db.lightning
      .filter((o) => o.win)
      .toArray()
      .then((arr) => average(arr.map((result) => result.guesses)) || 0),
  ),
};

export const dailyStats = {
  streak: liveQuery(() =>
    db.daily
      .toArray()
      .then(
        (arr) =>
          arr.toReversed().findLastIndex((v, i) => dayjs().diff(dayjs(v.date), "day") === i) + 1,
      ),
  ),
  averageGuesses: liveQuery(() =>
    db.daily.toArray().then((arr) => average(arr.map((result) => result.guesses)) || 0),
  ),
};

function average(array: number[]): number {
  if (array.length === 0) return 0;
  return array.reduce((a, b) => a + b) / array.length;
}
