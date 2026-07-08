---
title: 附加功能
description: 在 Starlight 站台加入可選的 mikan 功能。
---

先完成[主題設定](/zh-tw/guide/theme-setup/)，需要時再加入下列功能。

## Agent Markdown

如果需要產生 `.md` 路由與複製給 LLM 的按鈕，加入 `mikanAgentMarkdown()`：

```js title="astro.config.mjs"
import starlight from "@astrojs/starlight";
import mikanTheme, { mikanAgentMarkdown } from "@geminixiang/mikan-starlight-theme";
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
  markdownRoutes: true, // 產生 /index.md 與 /<slug>.md
  markdownActions: true, // 在目錄下加入「Copy as Markdown」動作
  contentNegotiation: false, // 只適合 SSR：依 Accept header / ?format=md 回傳 Markdown
});
```

靜態部署無法依 request header 改變已建好的 HTML，所以除非站台在 request time 執行 Astro middleware，否則請維持 `contentNegotiation` 關閉。

## Landing components

`template: splash` 頁面可使用 mikan 內建的 `Hero`、`Features` 與 `CTA` 元件：

```mdx title="src/content/docs/index.mdx"
import Hero from "@geminixiang/mikan-starlight-theme/components/Hero.astro";
import Features from "@geminixiang/mikan-starlight-theme/components/Features.astro";
import CTA from "@geminixiang/mikan-starlight-theme/components/CTA.astro";
```
