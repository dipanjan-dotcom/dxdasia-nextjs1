import Link from "next/link";
import { getAllPages, getAllPosts } from "@/lib/wp";

export default async function Home() {
  const [pages, posts] = await Promise.all([getAllPages(), getAllPosts()]);

  return (
    <div className="flex flex-col flex-1 max-w-3xl mx-auto px-6 py-16 gap-12">
      <header>
        <h1 className="text-3xl font-semibold">DXD Asia</h1>
        <p className="text-zinc-600 dark:text-zinc-400">
          Migrated from WordPress, content synced live via the WP REST API.
        </p>
      </header>

      <section>
        <h2 className="text-xl font-medium mb-3">Pages</h2>
        <ul className="flex flex-col gap-2">
          {pages.map((page) => (
            <li key={page.id}>
              <Link href={`/${page.slug}`} className="underline">
                <span dangerouslySetInnerHTML={{ __html: page.title.rendered }} />
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h2 className="text-xl font-medium mb-3">Latest from the blog</h2>
        <ul className="flex flex-col gap-2">
          {posts.slice(0, 5).map((post) => (
            <li key={post.id}>
              <Link href={`/blog/${post.slug}`} className="underline">
                <span dangerouslySetInnerHTML={{ __html: post.title.rendered }} />
              </Link>
            </li>
          ))}
        </ul>
        <Link href="/blog" className="inline-block mt-3 underline">
          View all posts &rarr;
        </Link>
      </section>
    </div>
  );
}
