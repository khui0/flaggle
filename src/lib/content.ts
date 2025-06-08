import data from "$lib/assets/flags/data.json";

export interface Flag {
  code: string;
  name: string;
  duplicate?: boolean;
}

export const flags: Flag[] = data;
