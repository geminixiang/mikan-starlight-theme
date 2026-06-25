---
title: "Theme Setup"
description: "Install and configure the mikan Starlight theme."
url: "https://mikan-starlight-theme.local/guide/theme-setup/"
---

Install the package with Starlight and Astro:

```sh
pnpm add starlight-theme-mikan @astrojs/starlight astro
```

Add the theme plugin to `starlight()` and use the exported mikan code theme:

```js title="astro.config.mjs"
import starlight from "@astrojs/starlight";
import mikanTheme, { mikanCodeTheme } from "starlight-theme-mikan";
import { defineConfig } from "astro/config";

export default defineConfig({
  integrations: [
    starlight({
      title: "My docs",
      plugins: [mikanTheme()],
    }),
  ],
  markdown: {
    shikiConfig: {
      theme: mikanCodeTheme,
    },
  },
});
```

## Theme Plugin

`mikanTheme()` installs the shared CSS, component overrides, Expressive Code defaults, and image click-to-zoom.

- `components` (boolean): Replace Starlight's header, footer, mobile menu footer, and pagination. Defaults to `true`.
- `customCss` (boolean): Load the mikan design tokens and component skin. Defaults to `true`.
- `expressiveCode` (boolean): Use the paired mikan light/dark Expressive Code themes. Defaults to `true`.
- Image click-to-zoom is always enabled for Markdown and MDX content.

```js title="theme-options.js"
mikanTheme({
  components: true,
  customCss: true,
  expressiveCode: true,
});
```

## Local CSS

Project `customCss` stays available for product-specific adjustments. Use it for local docs tweaks, not shared theme behavior.

```js title="custom-css.js"
starlight({
  customCss: ["./src/styles/docs.css"],
  plugins: [mikanTheme()],
});
```

## Theme Toggle

mikan keeps Starlight's initial theme behavior: first visit follows the user's system preference, then explicit light/dark choices are stored in `localStorage`.

The visible control is a two-state light/dark toggle instead of Starlight's default light/dark/auto dropdown.

## Navigation

- [Docs home](https://mikan-starlight-theme.local/index.md)
- [Parent: Overview](https://mikan-starlight-theme.local/index.md)
- [Next: Add-ons](https://mikan-starlight-theme.local/guide/add-ons.md)
