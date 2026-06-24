---
title: "主題設定"
description: "安裝並設定 mikan Starlight 主題。"
url: "https://mikan-starlight-theme.local/zh-tw/guide/theme-setup/"
---

先安裝套件：

```sh
pnpm add starlight-theme-mikan @astrojs/starlight astro
```

把 theme plugin 加到 `starlight()`，並使用匯出的 mikan 程式碼主題：

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

`mikanTheme()` 會安裝共用 CSS、元件覆寫與 Expressive Code 預設值。

- `components`：覆寫 Starlight 的 header、footer、mobile menu footer 與 pagination。預設 `true`。
- `customCss`：載入 mikan 設計 token 與元件樣式。預設 `true`。
- `expressiveCode`：使用 mikan 亮暗雙程式碼主題。預設 `true`。

## 多語言

這個 template 使用 Starlight 原生 i18n：在 `locales` 宣告語言，並把翻譯頁放到對應資料夾，例如 `src/content/docs/zh-tw/`。

```js title="astro.config.mjs"
starlight({
  title: { en: "mikan", "zh-TW": "mikan" },
  locales: {
    root: { label: "English", lang: "en" },
    "zh-tw": { label: "繁體中文", lang: "zh-TW" },
  },
  sidebar: [
    {
      label: "Start",
      translations: { "zh-TW": "開始" },
      items: [{ label: "Overview", translations: { "zh-TW": "總覽" }, link: "/" }],
    },
  ],
});
```

## 導覽

- [文件首頁](https://mikan-starlight-theme.local/zh-tw/index.md)
- [上一層：總覽](https://mikan-starlight-theme.local/zh-tw/index.md)
- [下一頁：附加功能](https://mikan-starlight-theme.local/zh-tw/guide/add-ons.md)
