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

export async function serializeSave(): Promise<string> {
  const data: string[] = [];

  data[0] = import.meta.env.PACKAGE_VERSION || "unknown_version";

  // Play time [all, classic, lightning, daily]
  data[1] = [
    (await db.stats.get("play-time"))?.value || 0,
    (await db.stats.get("play-time/classic"))?.value || 0,
    (await db.stats.get("play-time/lightning"))?.value || 0,
    (await db.stats.get("play-time/daily"))?.value || 0,
  ].join(",");

  // Classic [streak, maxStreak, history]
  data[2] = [
    (await db.stats.get("classic-streak"))?.value || 0,
    (await db.stats.get("classic-max-streak"))?.value || 0,
    compressClassicLightningHistory(await db.classic.toArray()),
  ].join(",");

  // Lightning [streak, maxStreak, history]
  data[3] = [
    (await db.stats.get("lightning-streak"))?.value || 0,
    (await db.stats.get("lightning-max-streak"))?.value || 0,
    compressClassicLightningHistory(await db.lightning.toArray()),
  ].join(",");

  // Daily [history]
  data[4] = [compressDailyHistory(await db.daily.toArray())].join(",");

  return "FLAGGLE_" + btoa(data.join("|"));
}

export function deserializeSave(save: string) {
  const prefix = "FLAGGLE_";
  if (!save.startsWith(prefix)) throw new Error("bad structure");

  save = save.substring(prefix.length);

  const sections = atob(save).split("|");

  const playTimeParts = sections[1].split(",").map((s) => parseInt(s));
  const playTime = {
    all: playTimeParts[0],
    classic: playTimeParts[1],
    lightning: playTimeParts[2],
    daily: playTimeParts[3],
  };
  const classicParts = sections[2].split(",");
  const classic = {
    streak: parseInt(classicParts[0]),
    maxStreak: parseInt(classicParts[1]),
    history: decompressClassicLightningHistory(classicParts[2]),
  };
  const lightningParts = sections[3].split(",");
  const lightning = {
    streak: parseInt(lightningParts[0]),
    maxStreak: parseInt(lightningParts[1]),
    history: decompressClassicLightningHistory(lightningParts[2]),
  };
  const daily = {
    history: decompressDailyHistory(sections[4].split(",")[0]),
  };

  return {
    version: sections[0],
    playTime,
    classic,
    lightning,
    daily,
  };
}

function compressClassicLightningHistory(history: { win: boolean; guesses: number }[]): string {
  return history.map((item) => `${item.win ? "" : "-"}${item.guesses}`).join(":");
}

function decompressClassicLightningHistory(
  compressed: string,
): { win: boolean; guesses: number }[] {
  return compressed.split(":").map((item) => {
    const loss = item.startsWith("-");
    const guesses = parseInt(item.substring(loss ? 1 : 0));
    return {
      win: !loss,
      guesses,
    };
  });
}

function compressDailyHistory(history: { date: string; guesses: number }[]): string {
  return history.map((item) => `${item.date}+${item.guesses}`).join(":");
}

function decompressDailyHistory(compressed: string): { date: string; guesses: number }[] {
  return compressed.split(":").map((item) => {
    const parts = item.split("+");
    return {
      date: parts[0],
      guesses: parseInt(parts[1]),
    };
  });
}
