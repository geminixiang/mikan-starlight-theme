import type { APIContext, MiddlewareNext } from "astro";
import { base as siteBase } from "virtual:mikan-starlight-theme/agent-markdown/config";
import { isIgnoredPath, toMarkdownPath } from "./path-utils";

const AGENT_UA_PATTERN =
  /\b(?:GPTBot|ChatGPT|OpenAI|Claude|Anthropic|PerplexityBot|Google-Extended|Bytespider|CCBot|cohere-ai)\b/i;

/**
 * Rewrites docs requests to their generated `.md` route when the client
 * prefers Markdown. Triggered by `Accept: text/markdown`/`text/plain`,
 * `?format=md`, or a known AI-agent user agent.
 */
export async function onRequest(
  context: APIContext,
  next: MiddlewareNext,
): Promise<Response> {
  const { request, url } = context;

  if (request.method !== "GET" && request.method !== "HEAD") {
    return next();
  }

  if (url.pathname.endsWith(".md") || isIgnoredPath(url.pathname, siteBase)) {
    return next();
  }

  if (!prefersMarkdown(request, url)) {
    return next();
  }

  const markdownPath = toMarkdownPath(url.pathname, siteBase);
  const target = new URL(markdownPath, url);
  const response = await context.rewrite(target);

  if (response.status === 404) {
    return next();
  }

  return response;
}

function prefersMarkdown(request: Request, url: URL): boolean {
  if (url.searchParams.get("format") === "md") {
    return true;
  }

  const accept = request.headers.get("accept") ?? "";
  if (/text\/(?:markdown|plain)/i.test(accept) && !/text\/html/i.test(accept)) {
    return true;
  }

  const userAgent = request.headers.get("user-agent") ?? "";
  return AGENT_UA_PATTERN.test(userAgent);
}
