import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getPageBySlug, getElementorCss } from "@/lib/wp";
import { buildMetadata, buildJsonLd } from "@/lib/seo";

const FRONT_PAGE_SLUG = "home-2";

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPageBySlug(FRONT_PAGE_SLUG);
  if (!page) return {};
  return buildMetadata(page);
}

export default async function Home() {
  const page = await getPageBySlug(FRONT_PAGE_SLUG);
  if (!page) notFound();

  const [jsonLd, elementorCss] = await Promise.all([
    buildJsonLd(page),
    getElementorCss(page.id),
  ]);

  return (
    <>
      {jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: jsonLd }}
        />
      )}
      {elementorCss && <style dangerouslySetInnerHTML={{ __html: elementorCss }} />}
      <div dangerouslySetInnerHTML={{ __html: page.content.rendered }} />
    </>
  );
}
