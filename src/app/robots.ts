import type { MetadataRoute } from "next";
import { WP_BASE_URL } from "@/lib/wp";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: `${WP_BASE_URL}/sitemap.xml`,
  };
}
