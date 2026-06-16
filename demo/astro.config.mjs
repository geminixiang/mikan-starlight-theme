import mdx from "@astrojs/mdx";
import starlight from "@astrojs/starlight";
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
      title: "mikan",
      description: "A crisp editorial Starlight theme for modern product docs.",
      customCss: ["./src/styles/demo.css"],
      pagination: true,
      sidebar: [
        {
          label: "Start",
          items: [
            { label: "Overview", link: "/" },
            { label: "Install", link: "/guide/install/" },
          ],
        },
        {
          label: "Fixtures",
          items: [
            { label: "Markdown elements", link: "/guide/markdown/" },
            { label: "Code & commands", link: "/guide/code/" },
            { label: "Components & tables", link: "/guide/components/" },
          ],
        },
        {
          label: "Long sidebar",
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
      plugins: [mikanTheme(), mikanAgentMarkdown()],
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
