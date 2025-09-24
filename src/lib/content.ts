import data from "$lib/flags/data.json";
import { db } from "./db";
import { settings } from "./settings.svelte";

export interface Flag {
  code: string;
  name: string;
  duplicate?: boolean;
  us?: boolean;
}

export const flags: Flag[] = data.sort((a, b) => {
  const nameA = a.name.toUpperCase();
  const nameB = b.name.toUpperCase();
  if (nameA < nameB) return -1;
  if (nameA > nameB) return 1;
  return 0;
});

export function getRandomFlag(): Flag {
  const allowDuplicates = settings.current.allowDuplicates === "true";
  const filtered = (allowDuplicates ? flags : flags.filter((flag) => !flag.duplicate)).filter(
    (flag) => !flag.us,
  );
  return filtered[Math.floor(Math.random() * filtered.length)];
}

export async function fetchImageURL(code: string): Promise<string> {
  const blob =
    (await db.assets.get(code))?.blob || (await (await fetch(`/flags/${code}.png`)).blob());
  return window.URL.createObjectURL(blob);
}
