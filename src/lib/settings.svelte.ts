import { writable, type Writable } from "svelte/store";
import { browser } from "$app/environment";

interface Settings {
  [key: string]: string;
}

const storedSettings = browser && localStorage.getItem("settings");

const defaultSettings: Settings = { theme: "auto" };

// Initialize store with default settings
export const settings: Writable<Settings> = writable(
  (storedSettings && JSON.parse(storedSettings)) || defaultSettings,
);

export function resetSettings() {
  settings.set(defaultSettings);
}

settings.subscribe((value) => {
  if (browser) {
    return (localStorage.settings = JSON.stringify(value));
  }
});
