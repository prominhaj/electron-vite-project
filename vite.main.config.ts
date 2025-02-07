import { defineConfig } from "vite";
import { copy } from "fs-extra";

// https://vitejs.dev/config
export default defineConfig({
  base: "./",
  plugins: [
    {
      name: "copy-static",
      buildStart: async () => {
        await copy("public/splash.html", ".vite/build/splash.html");
      },
    },
  ],
});
