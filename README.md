# mikan-starlight-theme

A reusable Astro Starlight theme package for mikan docs.

## What this repo contains

- `src/` — the `starlight-theme-mikan` package.
- `demo/` — a small Starlight docs site that exercises light/dark mode, mobile navigation, long sidebars, code blocks, admonitions, tables, search, and pagination.
- `/tmp/sentry-starlight-theme` was cloned as an implementation reference for Starlight plugin/package shape.

## Design direction

**Engineered-cosmic, unmarketed** — an interpretation of the xAI design language, adapted to work in both light and dark mode (the original is dark-only). Starlight stays the technical foundation; the visuals read as a research lab announcing its work rather than a SaaS marketing site:

- Near-black canvas (`#0a0a0a`) in dark mode, mirrored to a true ink-on-paper light mode — both first-class (ThemeSelect kept)
- **Ink-as-color**: the brand "color" is ink-on-canvas (white-on-black / black-on-white). The blue is demoted to a quiet link/active affordance; sunset/dusk/breeze accents are reserved for illustration
- **Pills everywhere** — every interactive element is a `9999px` pill with a translucent-white (or translucent-ink) outline. One filled pill (ink fill) is the rare primary CTA
- **Two-face type**: Inter for display/body at **weight 400** with tight negative tracking (the brand never bolds display); JetBrains Mono **UPPERCASE** with positive tracking for every eyebrow, section heading, table header, and label — reads like a code comment
- 1px hairline borders, 8px card radii — no glass, gradients, glow, or shadows
- Custom landing components (`Hero`, `Features`, `CTA`) for splash pages
- Agent Markdown: `.md` routes + a copy-for-LLM action below the table of contents

> The full extracted spec lives in [`DESIGN.md`](./DESIGN.md). This theme follows it except for the dark-only rule — mikan keeps a light counterpart.

## Usage

```js
// astro.config.mjs
import starlight from "@astrojs/starlight";
import mikanTheme, {
  mikanAgentMarkdown,
  mikanCodeTheme,
} from "starlight-theme-mikan";
import { defineConfig } from "astro/config";

export default defineConfig({
  integrations: [
    starlight({
      title: "mikan",
      plugins: [mikanTheme(), mikanAgentMarkdown()],
    }),
  ],
  markdown: {
    shikiConfig: { theme: mikanCodeTheme },
  },
});
```

### Options

```ts
mikanTheme({
  components: true, // override Header/Footer/MobileMenuFooter/Pagination
  customCss: true, // inject the design system
  expressiveCode: true, // apply the mikan light + dark code theme
});

mikanAgentMarkdown({
  markdownRoutes: true, // emit /index.md and /<slug>.md
  markdownActions: true, // add the "Copy as Markdown" ToC action
  contentNegotiation: false, // SSR only: serve .md by Accept header / ?format=md
});
```

### Landing components

For `template: splash` pages (use from `.mdx`):

```mdx
import Hero from "starlight-theme-mikan/components/Hero.astro";
import Features from "starlight-theme-mikan/components/Features.astro";
import CTA from "starlight-theme-mikan/components/CTA.astro";
```

## Development

```sh
pnpm install
pnpm dev          # run the demo site
pnpm test         # typecheck, Astro check, demo build, and package dry-run
```

## Project status

This is the first reusable package scaffold plus visual demo. The next step is to iterate against real mikan documentation content before publishing or applying it to mikan.
