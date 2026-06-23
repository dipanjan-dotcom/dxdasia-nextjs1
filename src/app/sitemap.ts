import type { MetadataRoute } from "next";
import { getAllPages, getAllPosts, WP_BASE_URL } from "@/lib/wp";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [pages, posts] = await Promise.all([getAllPages(), getAllPosts()]);

  const pageEntries = pages.map((page) => ({
    url: `${WP_BASE_URL}/${page.slug}`,
    lastModified: page.modified,
  }));

  const postEntries = posts.map((post) => ({
    url: `${WP_BASE_URL}/blog/${post.slug}`,
    lastModified: post.modified,
  }));

  return [
    { url: WP_BASE_URL, lastModified: new Date() },
    { url: `${WP_BASE_URL}/blog`, lastModified: new Date() },
    ...pageEntries,
    ...postEntries,
  ];
}
