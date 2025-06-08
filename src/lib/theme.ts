import { browser } from "$app/environment";
import { writable, type Writable } from "svelte/store";

const ONE_YEAR = 60 * 60 * 24 * 365;

export const themeName = {
  light: "flaggle-light",
  dark: "flaggle-dark",
};

export type Theme = keyof typeof themeName | "auto";

export const theme: Writable<Theme | null> = writable(null);
export const parsedTheme: Writable<string> = writable("dark");

let currentTheme: Theme;

theme.subscribe((value) => {
  if (value === null) return;
  setTheme(value);
  currentTheme = value;
});

if (browser) {
  theme.set((localStorage.getItem("theme") as Theme) || "auto");

  window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", () => {
    setTheme(currentTheme);
  });

  window.matchMedia("print").addEventListener("change", (e) => {
    const print = e.matches;
    setTheme(print ? "light" : currentTheme, false);
  });
}

export function setTheme(value: Theme, save: boolean = true) {
  if (!browser || value === null) return;
  if (!(value in themeName || value === "auto")) {
    throw new Error(`theme must be ${[...Object.keys(themeName)].join(", ")}, or auto`);
  }

  const initialValue = value;

  if (value === "auto") {
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    value = prefersDark ? "dark" : "light";
  }

  parsedTheme.set(value);

  if (save) {
    theme.set(initialValue);
    localStorage.setItem("theme", initialValue);
    document.cookie = `theme=${value}; max-age=${ONE_YEAR}; path=/; SameSite=Strict;`;
    document.documentElement.setAttribute("data-theme", themeName[value]);
  }
}
