import { defineCollection } from "astro:content";

import { docsLoader } from "@astrojs/starlight/loaders";
import { docsSchema } from "@astrojs/starlight/schema";

/*
 * Starlight fixes this collection at `src/content/docs/` and maps it to the site root,
 * which the wizard owns — hence the pages sitting one level down, in `docs/`.
 * https://starlight.astro.build/guides/pages/#pages-from-markdown
 */
export const collections = {
  docs: defineCollection({ loader: docsLoader(), schema: docsSchema() }),
};
