import mdx from "@astrojs/mdx";
import starlight from "@astrojs/starlight";
import starlightImageZoom from "starlight-image-zoom";
import mikanTheme, {
  mikanAgentMarkdown,
  mikanCodeTheme,
} from "starlight-theme-mikan";
import { defineConfig } from "astro/config";
import remarkGfm from "remark-gfm";

export default defineConfig({
  site: "https://mikan-starlight-theme.local",
  devToolbar: { enabled: false },
  integrations: [
    starlight({
      title: { en: "mikan", "zh-TW": "mikan" },
      description: "A crisp editorial Starlight theme for modern product docs.",
      locales: {
        root: { label: "English", lang: "en" },
        "zh-tw": { label: "繁體中文", lang: "zh-TW" },
      },
      customCss: ["./src/styles/demo.css"],
      pagination: true,
      sidebar: [
        {
          label: "Start",
          translations: { "zh-TW": "開始" },
          items: [
            { label: "Overview", translations: { "zh-TW": "總覽" }, link: "/" },
            {
              label: "Theme Setup",
              translations: { "zh-TW": "主題設定" },
              link: "/guide/theme-setup/",
            },
            { label: "Add-ons", translations: { "zh-TW": "附加功能" }, link: "/guide/add-ons/" },
            { label: "Design", translations: { "zh-TW": "設計" }, link: "/guide/design/" },
          ],
        },
        {
          label: "Fixtures",
          translations: { "zh-TW": "測試頁" },
          items: [
            {
              label: "Markdown elements",
              translations: { "zh-TW": "Markdown 元素" },
              link: "/guide/markdown/",
            },
            {
              label: "Code & commands",
              translations: { "zh-TW": "程式碼與指令" },
              link: "/guide/code/",
            },
            {
              label: "Components & tables",
              translations: { "zh-TW": "元件與表格" },
              link: "/guide/components/",
            },
          ],
        },
        {
          label: "Long sidebar",
          translations: { "zh-TW": "長側欄" },
          items: [{ autogenerate: { directory: "guide/reference" } }],
        },
      ],
      social: [
        {
          icon: "github",
          label: "GitHub",
          href: "https://github.com/geminixiang/mikan-starlight-theme",
        },
      ],
      plugins: [mikanTheme(), starlightImageZoom(), mikanAgentMarkdown()],
    }),
    mdx(),
  ],
  markdown: {
    // Global remark plugins merge with Starlight's (asides, etc.) and are
    // inherited by MDX, so .mdx tables parse without clobbering directives.
    remarkPlugins: [remarkGfm],
    shikiConfig: {
      theme: mikanCodeTheme,
    },
  },
});
