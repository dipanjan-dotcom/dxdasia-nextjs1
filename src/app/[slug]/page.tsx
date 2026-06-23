import { notFound } from "next/navigation";
import type { Metadata } from "next";
import {
  getAllPages,
  getPageBySlug,
  getElementorCss,
  getPluginInlineCss,
  getPluginInlineJs,
  fetchHtml,
} from "@/lib/wp";
import { buildMetadata, buildJsonLd } from "@/lib/seo";
import { resolveLazyImages } from "@/lib/lazyImages";

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

  const [jsonLd, elementorCss, liveHtml] = await Promise.all([
    buildJsonLd(page),
    getElementorCss(page.id),
    fetchHtml(page.link),
  ]);
  const pluginInlineCss = liveHtml ? await getPluginInlineCss(liveHtml) : null;
  const pluginInlineJs = liveHtml ? getPluginInlineJs(liveHtml) : null;

  return (
    <article>
      {jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: jsonLd }}
        />
      )}
      {elementorCss && <style dangerouslySetInnerHTML={{ __html: elementorCss }} />}
      {pluginInlineCss && <style dangerouslySetInnerHTML={{ __html: pluginInlineCss }} />}
      {pluginInlineJs && <script dangerouslySetInnerHTML={{ __html: pluginInlineJs }} />}
      <h1 dangerouslySetInnerHTML={{ __html: page.title.rendered }} />
      <div dangerouslySetInnerHTML={{ __html: resolveLazyImages(page.content.rendered) }} />
    </article>
  );
}
