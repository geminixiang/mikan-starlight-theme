import "mdast-util-mdx-jsx";
import type { AstroIntegration } from "astro";
import rehypeRaw from "rehype-raw";
import { CONTINUE, EXIT, SKIP, visit } from "unist-util-visit";
import { visitParents } from "unist-util-visit-parents";

// ponytail: starlight-image-zoom does not expose the small integration hook we need,
// so we vendor the tiny bridge here and keep using its public UI component override.
const ZOOMABLE_TAG = "starlight-image-zoom-zoomable";
const MARKDOWN_CONTENT = "starlight-image-zoom/overrides/MarkdownContent.astro";
const elementTagNames = new Set(["img", "picture"]);
const mdxElementNames = new Set([
  "img",
  "picture",
  "astro-image",
  "Image",
  "Picture",
]);

type ElementNode = {
  type: "element";
  tagName: string;
  properties: Record<string, unknown>;
  children: unknown[];
  data?: { meta?: string };
};

type MdxAttribute = { type: string; name?: string; value?: unknown };
type MdxElementNode = {
  type: "mdxJsxFlowElement";
  name?: string;
  attributes: MdxAttribute[];
};

type ParentNode = {
  type: string;
  tagName?: string;
  name?: string;
  properties?: Record<string, unknown>;
  children?: unknown[];
};

export function imageZoomMarkdownContentComponent(): string {
  return MARKDOWN_CONTENT;
}

export function imageZoomIntegration(): AstroIntegration {
  return {
    name: "starlight-theme-mikan/image-zoom",
    hooks: {
      "astro:config:setup"({ updateConfig }) {
        updateConfig({
          markdown: {
            rehypePlugins: [rehypeMetaString, rehypeRaw, rehypeMikanImageZoom],
          },
          vite: {
            plugins: [vitePluginImageZoomConfig()],
          },
        });
      },
    },
  };
}

function rehypeMikanImageZoom() {
  return function transformer(tree: unknown) {
    visitParents(
      tree as never,
      ["element", "mdxJsxFlowElement"],
      (node: unknown, parents: unknown[]) => {
        const element = asElementNode(node);
        const mdxElement = asMdxElementNode(node);
        if (!element && !mdxElement) return CONTINUE;
        if (element && !elementTagNames.has(element.tagName)) return CONTINUE;
        if (
          mdxElement &&
          mdxElement.name &&
          !mdxElementNames.has(mdxElement.name)
        )
          return CONTINUE;
        if (isZoomDisabled(element, mdxElement)) return SKIP;
        if (parents.some(isInvalidImageParent)) return SKIP;

        const parent = asParentNode(parents.at(-1));
        const children = parent?.children;
        const index = children?.indexOf(node);
        if (!children || index === undefined || index < 0) return CONTINUE;

        children[index] = {
          type: "element",
          tagName: ZOOMABLE_TAG,
          properties: {},
          children: [node, zoomButtonNode(getImageAlt(element, mdxElement))],
        };
        return SKIP;
      },
    );
  };
}

function isZoomDisabled(
  element?: ElementNode,
  mdxElement?: MdxElementNode,
): boolean {
  if (element && "dataZoomOff" in element.properties) return true;
  return Boolean(
    mdxElement?.attributes.some(
      (attribute) =>
        attribute.type === "mdxJsxAttribute" &&
        attribute.name === "data-zoom-off",
    ),
  );
}

function isInvalidImageParent(parent: unknown): boolean {
  const element = asElementNode(parent);
  if (element) {
    const className = String(element.properties.className ?? "");
    return (
      className.includes("not-content") ||
      element.tagName === "button" ||
      element.tagName === "a"
    );
  }

  const mdxElement = asMdxElementNode(parent);
  return mdxElement?.name === "Zoom";
}

function getImageAlt(
  element?: ElementNode,
  mdxElement?: MdxElementNode,
): string {
  if (element?.tagName === "img")
    return String(element.properties.alt ?? "").trim();
  if (element?.tagName === "picture") return getPictureAlt(element);

  const altAttribute = mdxElement?.attributes.find(
    (attribute) =>
      attribute.type === "mdxJsxAttribute" && attribute.name === "alt",
  );
  return String(altAttribute?.value ?? "").trim();
}

function getPictureAlt(element: ElementNode): string {
  let alt = "";
  visit(element as never, "element", (child: unknown) => {
    const childElement = asElementNode(child);
    if (childElement?.tagName !== "img") return CONTINUE;
    alt = String(childElement.properties.alt ?? "").trim();
    return EXIT;
  });
  return alt;
}

function zoomButtonNode(alt: string) {
  return {
    type: "element",
    tagName: "button",
    properties: {
      "aria-label": `Zoom image${alt.length > 0 ? `: ${alt}` : ""}`,
      class: "starlight-image-zoom-control",
    },
    children: [
      {
        type: "element",
        tagName: "svg",
        properties: {
          "aria-hidden": "true",
          fill: "currentColor",
          viewBox: "0 0 24 24",
        },
        children: [
          {
            type: "element",
            tagName: "use",
            properties: { href: "#starlight-image-zoom-icon-zoom" },
            children: [],
          },
        ],
      },
    ],
  };
}

function rehypeMetaString() {
  return function transformer(tree: unknown) {
    visit(tree as never, "element", (node: unknown) => {
      const element = asElementNode(node);
      if (element?.tagName === "code" && element.data?.meta) {
        element.properties.metastring = element.data.meta;
      }
    });
  };
}

function vitePluginImageZoomConfig() {
  const moduleId = "virtual:starlight-image-zoom-config";
  const resolvedModuleId = `\0${moduleId}`;
  const moduleContent = 'export default {"showCaptions":true}';

  return {
    name: "vite-plugin-starlight-theme-mikan-image-zoom-config",
    load(id: string) {
      return id === resolvedModuleId ? moduleContent : undefined;
    },
    resolveId(id: string) {
      return id === moduleId ? resolvedModuleId : undefined;
    },
  };
}

function asElementNode(value: unknown): ElementNode | undefined {
  if (
    !isRecord(value) ||
    value.type !== "element" ||
    typeof value.tagName !== "string"
  )
    return undefined;
  return {
    type: "element",
    tagName: value.tagName,
    properties: isRecord(value.properties) ? value.properties : {},
    children: Array.isArray(value.children) ? value.children : [],
    data: isRecord(value.data)
      ? {
          meta:
            typeof value.data.meta === "string" ? value.data.meta : undefined,
        }
      : undefined,
  };
}

function asMdxElementNode(value: unknown): MdxElementNode | undefined {
  if (!isRecord(value) || value.type !== "mdxJsxFlowElement") return undefined;
  return {
    type: "mdxJsxFlowElement",
    name: typeof value.name === "string" ? value.name : undefined,
    attributes: Array.isArray(value.attributes)
      ? value.attributes.filter(isMdxAttribute)
      : [],
  };
}

function asParentNode(value: unknown): ParentNode | undefined {
  if (!isRecord(value)) return undefined;
  return {
    type: typeof value.type === "string" ? value.type : "",
    tagName: typeof value.tagName === "string" ? value.tagName : undefined,
    name: typeof value.name === "string" ? value.name : undefined,
    properties: isRecord(value.properties) ? value.properties : undefined,
    children: Array.isArray(value.children) ? value.children : undefined,
  };
}

function isMdxAttribute(value: unknown): value is MdxAttribute {
  return isRecord(value) && typeof value.type === "string";
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value && typeof value === "object");
}
