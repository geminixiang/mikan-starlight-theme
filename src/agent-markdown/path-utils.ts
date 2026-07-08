const ASSET_PATH_PATTERN =
  /\.(?:avif|bmp|css|csv|eot|gif|ico|jpe?g|js|json|map|mjs|mov|mp3|mp4|ogg|otf|pdf|png|svg|ttf|txt|wasm|wav|webm|webp|woff2?|xml|zip)$/i;

function isAssetPath(pathname: string) {
  return ASSET_PATH_PATTERN.test(pathname);
}

function isInBase(pathname: string, base: string) {
  return base === "/" || pathname === base || pathname.startsWith(`${base}/`);
}

export function isIgnoredPath(pathname: string, base: string) {
  if (!isInBase(pathname, base)) {
    return true;
  }

  const relative = stripBase(pathname, base);
  return (
    relative.startsWith("_") ||
    relative.startsWith("api/") ||
    isAssetPath(relative)
  );
}

function stripBase(pathname: string, base: string) {
  if (base === "/") {
    return pathname.replace(/^\//, "");
  }

  if (pathname === base) {
    return "";
  }

  return pathname.startsWith(`${base}/`)
    ? pathname.slice(base.length + 1)
    : pathname.replace(/^\//, "");
}

function joinBase(base: string, pathname: string) {
  const normalized = pathname.replace(/^\/+/, "");

  if (base === "/") {
    return `/${normalized}`;
  }

  return normalized ? `${base}/${normalized}` : `${base}/`;
}

export function toMarkdownPath(pathname: string, base: string) {
  const relative = stripBase(pathname, base).replace(/\/+$/, "");

  if (relative === "") {
    return joinBase(base, "index.md");
  }

  return relative.endsWith(".md")
    ? joinBase(base, relative)
    : joinBase(base, `${relative}.md`);
}
