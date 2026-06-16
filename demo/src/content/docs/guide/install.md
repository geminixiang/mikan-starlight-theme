---
title: Install
description: Add the mikan theme and agent Markdown plugin to a Starlight site.
---

Install the package next to Astro Starlight:

```sh
pnpm add @astrojs/starlight starlight-theme-mikan
```

Register the plugin in `astro.config.mjs`:

```js
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

## Theme options

```ts
mikanTheme({
  components: true, // override Header/Footer/MobileMenuFooter/Pagination
  customCss: true, // inject the crisp editorial design system
  expressiveCode: true, // apply the mikan light + dark code theme
});
```

## Agent Markdown options

```ts
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

For `template: splash` pages, the theme ships `Hero`, `Features`, and `CTA`
components (use them from `.mdx`):

```mdx
import Hero from "starlight-theme-mikan/components/Hero.astro";
import Features from "starlight-theme-mikan/components/Features.astro";
```
