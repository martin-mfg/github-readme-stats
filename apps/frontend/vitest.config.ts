import path from "node:path";

import { defineProject } from "vitest/config";

export default defineProject({
  resolve: {
    conditions: ["@stats/source"],
    alias: [
      {
        find: "../fetchers/wakatime.js",
        replacement: path.resolve(
          import.meta.dirname,
          "src/wakatime-override.ts",
        ),
      },
    ],
  },
  test: {
    dir: path.join(import.meta.dirname, "./src"),
  },
});
