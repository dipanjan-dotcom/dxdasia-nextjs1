import Link from "next/link";
import type { Metadata } from "next";
import { getAllPosts } from "@/lib/wp";

export const metadata: Metadata = {
  title: "Blog | DXD Asia",
  description: "Insights on digital marketing, SEO, and AI search from DXD Asia.",
};

export default async function BlogIndex() {
  const posts = await getAllPosts();

  return (
    <div>
      <h1>Blog</h1>
      <ul>
        {posts.map((post) => (
          <li key={post.id}>
            <Link href={`/blog/${post.slug}`}>
              <span dangerouslySetInnerHTML={{ __html: post.title.rendered }} />
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
