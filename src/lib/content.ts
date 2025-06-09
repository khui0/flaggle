import data from "$lib/assets/flags/data.json";

export interface Flag {
  code: string;
  name: string;
  duplicate?: boolean;
}

export const flags: Flag[] = data.sort((a, b) => {
  const nameA = a.name.toUpperCase();
  const nameB = b.name.toUpperCase();
  if (nameA < nameB) return -1;
  if (nameA > nameB) return 1;
  return 0;
});

export function getRandomFlag(allowDuplicates: boolean = false): Flag {
  const filtered = allowDuplicates ? flags : flags.filter((flag) => !flag.duplicate);
  return filtered[Math.floor(Math.random() * filtered.length)];
}
