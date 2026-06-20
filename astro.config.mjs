import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";

export default defineConfig({
  site: "https://www.nikosbanis.com",
  integrations: [
    sitemap({
      filter: (page) => !page.includes("/playground/"),
    }),
  ],
  output: "static",
});
