import { enhancedImages } from "@sveltejs/enhanced-img";
import { sveltekit } from "@sveltejs/kit/vite";
import tailwindcss from "@tailwindcss/vite";
import Icons from "unplugin-icons/vite";
import { defineConfig } from "vite";
import version from "vite-plugin-package-version";

export default defineConfig({
  plugins: [
    Icons({
      compiler: "svelte",
    }),
    enhancedImages(),
    tailwindcss(),
    version(),
    sveltekit(),
  ],
});
