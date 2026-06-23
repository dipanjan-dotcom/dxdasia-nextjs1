import type { Metadata } from "next";
import type { WPEntity } from "./wp";

export function buildMetadata(entity: WPEntity): Metadata {
  const yoast = entity.yoast_head_json;
  if (!yoast) {
    return { title: entity.title.rendered };
  }

  const ogImage = yoast.og_image?.[0];

  return {
    title: yoast.title,
    description: yoast.description,
    alternates: yoast.canonical ? { canonical: yoast.canonical } : undefined,
    openGraph: {
      title: yoast.og_title ?? yoast.title,
      description: yoast.og_description ?? yoast.description,
      url: yoast.og_url,
      siteName: yoast.og_site_name,
      type: "article",
      images: ogImage ? [{ url: ogImage.url, width: ogImage.width, height: ogImage.height }] : undefined,
    },
    twitter: {
      card: (yoast.twitter_card as "summary_large_image" | "summary") ?? "summary_large_image",
      title: yoast.og_title ?? yoast.title,
      description: yoast.og_description ?? yoast.description,
      images: ogImage ? [ogImage.url] : undefined,
    },
  };
}

export function buildJsonLd(entity: WPEntity): string | null {
  if (!entity.yoast_head_json?.schema) return null;
  return JSON.stringify(entity.yoast_head_json.schema);
}
