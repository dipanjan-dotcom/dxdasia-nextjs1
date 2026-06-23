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

export { WP_BASE_URL };
