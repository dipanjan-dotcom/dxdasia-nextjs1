const WP_BASE_URL = process.env.WP_BASE_URL ?? "https://dxdasia.com";
const WP_API = `${WP_BASE_URL}/wp-json/wp/v2`;

export interface YoastHeadJson {
  title?: string;
  description?: string;
  canonical?: string;
  og_locale?: string;
  og_type?: string;
  og_title?: string;
  og_description?: string;
  og_url?: string;
  og_site_name?: string;
  og_image?: { url: string; width?: number; height?: number }[];
  twitter_card?: string;
  article_modified_time?: string;
  schema?: Record<string, unknown>;
}

export interface WPEntity {
  id: number;
  slug: string;
  link: string;
  date: string;
  modified: string;
  title: { rendered: string };
  content: { rendered: string };
  excerpt: { rendered: string };
  yoast_head_json?: YoastHeadJson;
  categories?: number[];
  _embedded?: {
    "wp:featuredmedia"?: { source_url: string; alt_text?: string }[];
    "wp:term"?: { id: number; name: string; slug: string }[][];
  };
}

async function wpFetch<T>(path: string, revalidate = 3600): Promise<T> {
  const res = await fetch(`${WP_API}${path}`, { next: { revalidate } });
  if (!res.ok) {
    throw new Error(`WP API request failed: ${path} (${res.status})`);
  }
  return res.json() as Promise<T>;
}

export function getAllPages() {
  return wpFetch<WPEntity[]>("/pages?per_page=100&_fields=id,slug,link,date,modified,title");
}

export function getPageBySlug(slug: string) {
  return wpFetch<WPEntity[]>(`/pages?slug=${encodeURIComponent(slug)}&_embed`).then(
    (pages) => pages[0] ?? null
  );
}

export function getAllPosts() {
  return wpFetch<WPEntity[]>("/posts?per_page=100&_embed");
}

export function getPostBySlug(slug: string) {
  return wpFetch<WPEntity[]>(`/posts?slug=${encodeURIComponent(slug)}&_embed`).then(
    (posts) => posts[0] ?? null
  );
}

export async function getElementorCss(postId: number): Promise<string | null> {
  const res = await fetch(`${WP_BASE_URL}/wp-content/uploads/elementor/css/post-${postId}.css`, {
    next: { revalidate: 3600 },
  });
  if (!res.ok) return null;
  return res.text();
}

async function fetchHtml(link: string): Promise<string | null> {
  const res = await fetch(link, { next: { revalidate: 3600 } });
  if (!res.ok) return null;
  return res.text();
}

export async function getPluginInlineCss(html: string): Promise<string | null> {
  const blocks = [...html.matchAll(/<style id='responsive-lightbox-[^']*-inline-css'[^>]*>([\s\S]*?)<\/style>/g)];
  if (blocks.length === 0) return null;
  // WordPress's REST API content renderer assigns gallery container IDs starting
  // from 1 on every request, independently of the live page's numbering used when
  // this CSS was scraped, so per-container #rl-gallery-container-N scoping would
  // not match our markup. Drop that scoping and rely on the gallery type class.
  return blocks
    .map((m) => m[1].replace(/#rl-gallery-container-\d+\s+/g, ""))
    .join("\n");
}

export function getPluginInlineJs(html: string): string | null {
  const blocks = [
    ...html.matchAll(/<script id="responsive-lightbox-[^"]*-js-before"[^>]*>([\s\S]*?)<\/script>/g),
  ];
  if (blocks.length === 0) return null;
  return blocks.map((m) => m[1]).join("\n");
}

export { fetchHtml };

export { WP_BASE_URL };
