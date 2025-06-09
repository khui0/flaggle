import { browser } from "$app/environment";

type Settings = Record<string, string>;

const storedSettings: Settings = browser
  ? JSON.parse(localStorage.getItem("settings") || "{}")
  : {};

const defaultValues = { theme: "auto" };

// Initialize settings with default values
export let settings: { current: Settings } = $state({
  current: Object.assign({}, defaultValues, storedSettings),
});

export function resetSettings() {
  settings.current = Object.assign({}, defaultValues);
}
