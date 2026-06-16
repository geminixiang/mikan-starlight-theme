/*
 * mikan code themes — crisp editorial mono.
 *
 * A light and dark Shiki/Expressive Code theme pair tuned to the ink-on-paper
 * design: low-chroma syntax, a single blue accent reserved for keywords, and
 * backgrounds that match the surrounding surface rather than a dark slab.
 */

export const mikanCodeThemeLight = {
  name: "mikan-light",
  displayName: "mikan light",
  type: "light",
  semanticHighlighting: true,
  colors: {
    "editor.background": "#fcfcfc",
    "editor.foreground": "#27272a",
    "editor.lineHighlightBackground": "#00000008",
    "editor.selectionBackground": "#2563eb1f",
    "editorLineNumber.foreground": "#a1a1aa",
    "editorLineNumber.activeForeground": "#52525b",
  },
  tokenColors: [
    { scope: ["comment", "punctuation.definition.comment"], settings: { foreground: "#8e8e93", fontStyle: "italic" } },
    { scope: ["punctuation", "meta.brace", "meta.delimiter"], settings: { foreground: "#71717a" } },
    { scope: ["keyword", "storage", "storage.type", "constant.language"], settings: { foreground: "#2563eb", fontStyle: "bold" } },
    { scope: ["string", "constant.other.symbol", "markup.inline.raw"], settings: { foreground: "#15803d" } },
    { scope: ["constant.numeric", "constant.character", "support.constant"], settings: { foreground: "#9333ea" } },
    { scope: ["entity.name.function", "support.function", "meta.function-call"], settings: { foreground: "#0e7490" } },
    { scope: ["entity.name.type", "entity.name.class", "support.type", "support.class"], settings: { foreground: "#b45309", fontStyle: "bold" } },
    { scope: ["variable", "variable.parameter", "variable.other.property", "meta.object-literal.key"], settings: { foreground: "#3f3f46" } },
    { scope: ["entity.name.tag", "markup.heading"], settings: { foreground: "#2563eb" } },
    { scope: ["markup.inserted", "meta.diff.header.to-file"], settings: { foreground: "#15803d" } },
    { scope: ["markup.deleted", "meta.diff.header.from-file"], settings: { foreground: "#b91c1c" } },
  ],
} as const;

export const mikanCodeThemeDark = {
  name: "mikan-dark",
  displayName: "mikan dark",
  type: "dark",
  semanticHighlighting: true,
  colors: {
    "editor.background": "#0d0d0f",
    "editor.foreground": "#ededed",
    "editor.lineHighlightBackground": "#ffffff0a",
    "editor.selectionBackground": "#60a5fa26",
    "editorLineNumber.foreground": "#636368",
    "editorLineNumber.activeForeground": "#a1a1aa",
  },
  tokenColors: [
    { scope: ["comment", "punctuation.definition.comment"], settings: { foreground: "#8f8f94", fontStyle: "italic" } },
    { scope: ["punctuation", "meta.brace", "meta.delimiter"], settings: { foreground: "#a1a1aa" } },
    { scope: ["keyword", "storage", "storage.type", "constant.language"], settings: { foreground: "#60a5fa", fontStyle: "bold" } },
    { scope: ["string", "constant.other.symbol", "markup.inline.raw"], settings: { foreground: "#4ade80" } },
    { scope: ["constant.numeric", "constant.character", "support.constant"], settings: { foreground: "#c084fc" } },
    { scope: ["entity.name.function", "support.function", "meta.function-call"], settings: { foreground: "#22d3ee" } },
    { scope: ["entity.name.type", "entity.name.class", "support.type", "support.class"], settings: { foreground: "#fbbf24", fontStyle: "bold" } },
    { scope: ["variable", "variable.parameter", "variable.other.property", "meta.object-literal.key"], settings: { foreground: "#d4d4d8" } },
    { scope: ["entity.name.tag", "markup.heading"], settings: { foreground: "#60a5fa" } },
    { scope: ["markup.inserted", "meta.diff.header.to-file"], settings: { foreground: "#4ade80" } },
    { scope: ["markup.deleted", "meta.diff.header.from-file"], settings: { foreground: "#f87171" } },
  ],
} as const;

/** Light + dark pair for Expressive Code (`themes: mikanCodeThemes`). */
export const mikanCodeThemes = [mikanCodeThemeDark, mikanCodeThemeLight] as const;

/**
 * Single theme for plain Markdown rendering (`markdown.shikiConfig.theme`),
 * which does not support a light/dark pair. Defaults to the dark theme.
 */
export const mikanCodeTheme = mikanCodeThemeDark;
