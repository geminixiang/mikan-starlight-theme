---
title: Add-ons
description: Add optional mikan features to a Starlight site.
---

Start with [Theme Setup](/guide/theme-setup/), then add these optional pieces when your docs need them.

## Agent Markdown

Add `mikanAgentMarkdown()` if you want generated `.md` routes and a copy-for-LLM action:

```js title="astro.config.mjs"
import starlight from "@astrojs/starlight";
import mikanTheme, { mikanAgentMarkdown } from "starlight-theme-mikan";
import { defineConfig } from "astro/config";

export default defineConfig({
  integrations: [
    starlight({
      title: "My docs",
      plugins: [mikanTheme(), mikanAgentMarkdown()],
    }),
  ],
});
```

```ts title="agent-markdown-options.ts"
mikanAgentMarkdown({
  markdownRoutes: true, // emit /index.md and /<slug>.md
  markdownActions: true, // add the "Copy as Markdown" ToC action
  contentNegotiation: false, // SSR only: serve .md by Accept header / ?format=md
});
```

Static deployments cannot vary a prebuilt HTML page by request headers, so keep
`contentNegotiation` disabled unless the site runs Astro middleware at request
time.

## Landing components

For `template: splash` pages, mikan ships `Hero`, `Features`, and `CTA` components:

```mdx title="src/content/docs/index.mdx"
import Hero from "starlight-theme-mikan/components/Hero.astro";
import Features from "starlight-theme-mikan/components/Features.astro";
import CTA from "starlight-theme-mikan/components/CTA.astro";
```
