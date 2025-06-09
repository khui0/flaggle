import Dexie, { type Table } from "dexie";

interface Stat {
  name: string;
  value: number;
}

export interface DailyResult {
  date: string;
  guesses: number;
}

export interface Result {
  win: boolean;
}

export interface ClassicResult extends Result {
  guesses: number;
}

export interface LightningResult extends Result {
  guesses: number;
}

export interface FlagImageData {
  code: string;
  blob: Blob;
}

export class Database extends Dexie {
  stats!: Table<Stat>;
  daily!: Table<DailyResult>;
  classic!: Table<ClassicResult>;
  lightning!: Table<LightningResult>;
  assets!: Table<FlagImageData>;

  constructor() {
    super("database");
    this.version(2).stores({
      stats: "name, value",
      daily: "date, guesses",
      classic: "++, win, guesses",
      lightning: "++, win, guesses",
      assets: "++code",
    });
  }
}

export const db = new Database();
