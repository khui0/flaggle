import { themeName } from "$lib/theme";
import type { Handle } from "@sveltejs/kit";

export const handle: Handle = async ({ event, resolve }) => {
  let theme = event.cookies.get("theme");

  if (!theme || !(theme in themeName)) {
    theme = "light";
  }

  return await resolve(event, {
    transformPageChunk: ({ html }) => {
      return html.replace(`data-theme=""`, `data-theme="${themeName[theme as "light" | "dark"]}"`);
    },
  });
};
