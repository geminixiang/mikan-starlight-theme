import { mikanCodeThemes } from "./themes/mikan";
import {
  setStarlightComponentOverride,
  type StarlightComponentOverrides,
} from "./starlight-components";

export {
  mikanCodeTheme,
  mikanCodeThemeDark,
  mikanCodeThemeLight,
  mikanCodeThemes,
} from "./themes/mikan";
export {
  mikanAgentMarkdown,
  type MikanAgentMarkdownOptions,
} from "./agent-markdown";

const packageName = "starlight-theme-mikan";
const themeCss = `${packageName}/styles/index.css`;
const footerComponent = `${packageName}/components/Footer.astro`;
const headerComponent = `${packageName}/components/Header.astro`;
const mobileMenuFooterComponent = `${packageName}/components/MobileMenuFooter.astro`;
const paginationComponent = `${packageName}/components/Pagination.astro`;
const pageTitleComponent = `${packageName}/components/PageTitle.astro`;

type ExpressiveCodeConfig = Exclude<
  StarlightUserConfig["expressiveCode"],
  boolean | undefined
>;
type ExpressiveCodeStyleOverrides = Record<string, unknown> & {
  frames?: Record<string, unknown>;
};

interface HeadTag {
  tag: string;
  attrs?: Record<string, string | boolean | undefined>;
  content?: string;
}

interface StarlightUserConfig {
  customCss?: string[];
  components?: Record<string, string | undefined>;
  expressiveCode?:
    | boolean
    | (Record<string, unknown> & {
        styleOverrides?: ExpressiveCodeStyleOverrides;
      });
  head?: HeadTag[];
}

interface StarlightPlugin {
  name: string;
  hooks: {
    "config:setup"(context: {
      config: StarlightUserConfig;
      updateConfig(config: Partial<StarlightUserConfig>): void;
      logger: {
        warn(message: string): void;
      };
    }): void;
  };
}

export interface MikanStarlightThemeOptions {
  /** Override Starlight's Header/Footer/MobileMenuFooter/Pagination/PageTitle components. */
  components?: boolean;
  /** Add the theme CSS automatically. */
  customCss?: boolean;
  /** Configure Expressive Code with Mikan's high-contrast code style. */
  expressiveCode?: boolean;
}

export function mikanStarlightTheme({
  components = true,
  customCss = true,
  expressiveCode = true,
}: MikanStarlightThemeOptions = {}): StarlightPlugin {
  return {
    name: packageName,
    hooks: {
      "config:setup"({ config, updateConfig, logger }) {
        const nextComponents: StarlightComponentOverrides = {
          ...config.components,
        };

        if (components) {
          setStarlightComponentOverride({
            components: nextComponents,
            component: "Header",
            componentPath: headerComponent,
            logger,
            usage: `use ${packageName}'s polished header`,
          });
          setStarlightComponentOverride({
            components: nextComponents,
            component: "Footer",
            componentPath: footerComponent,
            logger,
            usage: `use ${packageName}'s compact footer`,
          });
          setStarlightComponentOverride({
            components: nextComponents,
            component: "MobileMenuFooter",
            componentPath: mobileMenuFooterComponent,
            logger,
            usage: `use ${packageName}'s mobile menu footer`,
          });
          setStarlightComponentOverride({
            components: nextComponents,
            component: "Pagination",
            componentPath: paginationComponent,
            logger,
            usage: `use ${packageName}'s card pagination`,
          });
          setStarlightComponentOverride({
            components: nextComponents,
            component: "PageTitle",
            componentPath: pageTitleComponent,
            logger,
            usage: `use ${packageName}'s title and description block`,
          });
        }

        updateConfig({
          customCss: customCss
            ? dedupeCss([themeCss, ...(config.customCss ?? [])])
            : config.customCss,
          components: nextComponents,
          head: [
            ...(config.head ?? []),
            {
              tag: "meta",
              attrs: { name: "color-scheme", content: "light dark" },
            },
            {
              tag: "style",
              content:
                "html{background:#fbfbfa}@media(prefers-color-scheme:dark){html{background:#111113}}",
            },
          ],
          expressiveCode:
            expressiveCode && config.expressiveCode !== false
              ? buildExpressiveCodeConfig(getExpressiveCodeConfig(config))
              : config.expressiveCode,
        });
      },
    },
  };
}

export default mikanStarlightTheme;

function getExpressiveCodeConfig(
  config: StarlightUserConfig,
): ExpressiveCodeConfig {
  if (!config.expressiveCode || config.expressiveCode === true) {
    return {};
  }

  return config.expressiveCode;
}

function buildExpressiveCodeConfig(
  userConfig: ExpressiveCodeConfig,
): ExpressiveCodeConfig {
  const userStyleOverrides = userConfig.styleOverrides ?? {};

  return {
    emitExternalStylesheet: false,
    minSyntaxHighlightingColorContrast: 6.5,
    themes: [...mikanCodeThemes],
    useStarlightDarkModeSwitch: true,
    useStarlightUiThemeColors: false,
    useThemedScrollbars: false,
    ...userConfig,
    styleOverrides: {
      borderColor: "var(--mk-border)",
      borderRadius: "6px",
      borderWidth: "1px",
      codeBackground: "var(--mk-code-bg)",
      codeFontFamily: "var(--__sl-font-mono)",
      codeFontSize: "var(--sl-text-code)",
      codeLineHeight: "1.65",
      codePaddingBlock: "0.9rem",
      codePaddingInline: "1rem",
      focusBorder: "var(--mk-accent)",
      gutterBorderColor: "var(--mk-border)",
      gutterForeground: "var(--mk-text-muted)",
      gutterHighlightForeground: "var(--mk-text)",
      scrollbarThumbColor: "var(--mk-border-strong)",
      scrollbarThumbHoverColor: "var(--mk-text-muted)",
      uiFontFamily: "var(--__sl-font)",
      uiFontSize: "0.8rem",
      uiLineHeight: "1.4",
      uiPaddingBlock: "0.4rem",
      uiPaddingInline: "0.7rem",
      ...userStyleOverrides,
      frames: {
        editorActiveTabBackground: "var(--mk-code-bg)",
        editorActiveTabBorderColor: "var(--mk-border)",
        editorActiveTabIndicatorBottomColor: "var(--mk-accent)",
        editorActiveTabIndicatorHeight: "2px",
        editorBackground: "var(--mk-code-bg)",
        editorTabBarBackground: "var(--mk-code-header)",
        editorTabBarBorderBottomColor: "var(--mk-border)",
        frameBoxShadowCssValue: "none",
        inlineButtonBackground: "transparent",
        inlineButtonBorder: "transparent",
        inlineButtonForeground: "var(--mk-text-muted)",
        terminalBackground: "var(--mk-code-bg)",
        terminalTitlebarBackground: "var(--mk-code-header)",
        terminalTitlebarBorderBottomColor: "var(--mk-border)",
        ...userStyleOverrides.frames,
      },
    },
  };
}

function dedupeCss(css: NonNullable<StarlightUserConfig["customCss"]>) {
  return css.filter((item, index) => css.indexOf(item) === index);
}
