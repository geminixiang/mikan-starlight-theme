/// <reference types="astro/client" />

declare module "virtual:mikan-starlight-theme/agent-markdown/config" {
  export const base: string;
}

declare module "virtual:starlight/user-config" {
  const Config: {
    pagefind?: unknown;
    components: Record<string, string | undefined>;
    social?:
      | Array<{ icon: string; label: string; href: string }>
      | Record<string, string>;
  };
  export default Config;
}

declare module "virtual:starlight/components/LanguageSelect" {
  const Component: import("astro").AstroComponentFactory;
  export default Component;
}

declare module "virtual:starlight/components/Pagination" {
  const Component: import("astro").AstroComponentFactory;
  export default Component;
}

declare module "virtual:starlight/components/Search" {
  const Component: import("astro").AstroComponentFactory;
  export default Component;
}

declare module "virtual:starlight/components/SiteTitle" {
  const Component: import("astro").AstroComponentFactory;
  export default Component;
}

declare namespace App {
  interface Locals {
    starlightRoute: {
      dir: "ltr" | "rtl";
      siteTitle: string;
      siteTitleHref: string;
      entry: {
        data: {
          title: string;
          description?: string;
        };
      };
      pagination: {
        prev?: { href: string; label: string };
        next?: { href: string; label: string };
      };
    };
    t(key: string): string;
  }
}
