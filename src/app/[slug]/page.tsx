import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getAllPages, getPageBySlug } from "@/lib/wp";
import { buildMetadata, buildJsonLd } from "@/lib/seo";

export async function generateStaticParams() {
  const pages = await getAllPages();
  return pages.map((page) => ({ slug: page.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const page = await getPageBySlug(slug);
  if (!page) return {};
  return buildMetadata(page);
}

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const page = await getPageBySlug(slug);
  if (!page) notFound();

  const jsonLd = buildJsonLd(page);

  return (
    <article>
      {jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: jsonLd }}
        />
      )}
      <h1 dangerouslySetInnerHTML={{ __html: page.title.rendered }} />
      <div dangerouslySetInnerHTML={{ __html: page.content.rendered }} />
    </article>
  );
}
