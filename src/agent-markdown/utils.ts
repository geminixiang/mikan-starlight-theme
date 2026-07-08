import type { APIContext, GetStaticPathsItem } from "astro";
import { getCollection, type CollectionEntry } from "astro:content";
import { base as siteBase } from "virtual:mikan-starlight-theme/agent-markdown/config";

type DocsEntry = CollectionEntry<"docs"> & {
  body?: string;
  rendered?: { html?: string };
};

export interface MarkdownPage extends Record<string, unknown> {
  entry: DocsEntry;
  id: string;
}

let markdownPagesPromise: Promise<MarkdownPage[]> | undefined;

async function getMarkdownPages(): Promise<MarkdownPage[]> {
  if (import.meta.env.MODE === "production" && markdownPagesPromise) {
    return markdownPagesPromise;
  }

  const pagesPromise = loadMarkdownPages();
  if (import.meta.env.MODE === "production") {
    markdownPagesPromise = pagesPromise;
  }
  return pagesPromise;
}

async function loadMarkdownPages(): Promise<MarkdownPage[]> {
  const entries = (await getCollection(
    "docs",
    ({ data }: DocsEntry) =>
      import.meta.env.MODE !== "production" || data.draft !== true,
  )) as DocsEntry[];

  const pages = new Map<string, MarkdownPage>();
  for (const entry of entries) {
    const id = normalizeIndexId(entry.id);
    if (!pages.has(id)) {
      pages.set(id, { entry, id });
    }
  }
  return [...pages.values()];
}

function normalizeIndexId(id: string): string {
  return id === "index" ? "" : id.replace(/\/index$/, "");
}

export async function getMarkdownPageById(
  id: string,
): Promise<MarkdownPage | undefined> {
  const normalized = normalizeIndexId(id.replace(/\.md$/, "").replace(/\/$/, ""));
  const pages = await getMarkdownPages();
  return pages.find((page) => page.id === normalized);
}

export function getMarkdownPageFromProps(
  context: APIContext,
): MarkdownPage | undefined {
  const page = (context.props as { page?: MarkdownPage }).page;
  return page?.entry ? page : undefined;
}

export async function getMarkdownStaticPaths({
  includeRoot,
}: {
  includeRoot: boolean;
}): Promise<GetStaticPathsItem[]> {
  const pages = await getMarkdownPages();
  return pages
    .filter((page) => (includeRoot ? page.id === "" : page.id !== ""))
    .map((page) => ({
      params: { slug: page.id || undefined },
      props: { page },
    }));
}

export async function renderMarkdownResponse(
  context: APIContext,
  page: MarkdownPage,
): Promise<Response> {
  const url = canonicalUrl(context, page.id);
  const body = toMarkdown(page, url);
  return new Response(body, {
    headers: { "content-type": "text/markdown; charset=utf-8" },
  });
}

function canonicalUrl(context: APIContext, id: string): string {
  const path = id ? `/${id}/` : "/";
  try {
    return new URL(joinBase(siteBase, path), context.site ?? context.url).href;
  } catch {
    return joinBase(siteBase, path);
  }
}

function joinBase(base: string, path: string): string {
  if (base === "/") return path;
  return path === "/" ? `${base}/` : `${base}${path}`;
}

function toMarkdown(page: MarkdownPage, url: string): string {
  const { data } = page.entry;
  const title = typeof data.title === "string" ? data.title : "";
  const description =
    typeof data.description === "string" ? data.description : "";

  const frontmatter = [
    "---",
    `title: ${yamlString(title)}`,
    description ? `description: ${yamlString(description)}` : undefined,
    `url: ${yamlString(url)}`,
    "---",
  ]
    .filter(Boolean)
    .join("\n");

  const heading = title ? `# ${title}\n` : "";
  const content = normalizeBody(page.entry.body ?? "");

  return `${frontmatter}\n\n${heading}${heading ? "\n" : ""}${content}\n`.replace(
    /\n{3,}/g,
    "\n\n",
  );
}

function yamlString(value: string): string {
  return JSON.stringify(value);
}

/**
 * Normalize MDX/Markdown source into plain Markdown suitable for LLM clients:
 * strip frontmatter, drop import/export statements, and remove common JSX
 * component wrappers while keeping their text content.
 */
function normalizeBody(body: string): string {
  const withoutFrontmatter = body.replace(/^---\n[\s\S]*?\n---\n/, "");

  // Strip MDX import/export lines and standalone JSX component tags, but only
  // outside fenced code blocks so code examples survive untouched.
  const fence = /^\s*(`{3,}|~{3,})/;
  let openFence: string | null = null;
  const kept: string[] = [];

  for (const line of withoutFrontmatter.split("\n")) {
    const fenceMatch = line.match(fence);
    if (fenceMatch) {
      const marker = fenceMatch[1][0];
      if (openFence === null) {
        openFence = marker;
      } else if (marker === openFence) {
        openFence = null;
      }
      kept.push(line);
      continue;
    }

    if (openFence === null) {
      if (/^\s*(?:import|export)\s/.test(line)) {
        continue;
      }
      if (/^\s*<\/?[A-Z][\w.]*(?:\s[^>]*)?\/?>\s*$/.test(line)) {
        continue;
      }
    }

    kept.push(line);
  }

  return kept.join("\n").trim();
}
