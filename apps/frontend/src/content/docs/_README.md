# Why `docs/docs`

Starlight fixes its content collection at `src/content/docs/`, and maps that folder to the **site root** (`/frontend`), which the card wizard occupies (`src/pages/index.astro`).

The pages therefore sit one level down, in `docs/`, so they publish at `/frontend/docs/`.
Nothing else can be renamed: the outer name is Starlight's, the inner one is the URL segment.

Flattening this needs a custom `generateId` on the loader, which is the one thing `starlight-links-validator` cannot follow.
It derives valid routes from file paths, so every internal link would be reported broken.
The nesting buys build-time dead-link checking.

Starlight ignores files starting with `_`, which is why this note isn't published.

See <https://starlight.astro.build/guides/pages/#pages-from-markdown>.
