import { getAllPosts } from "@/utils/markdown";
import Link from "next/link";

export default function Home() {
  const posts = getAllPosts();

  return (
    <main className="flex min-h-screen flex-col items-center p-8 sm:p-24">
      <h1 className="text-4xl font-bold mb-8">AI Documentation</h1>
      <p className="text-lg mb-8 text-center max-w-2xl">
        A collection of AI code examples and best practices in raw markdown
        format, optimized for AI processing and scraping.
      </p>

      <div className="w-full max-w-2xl">
        <h2 className="text-2xl font-semibold mb-4">Table of Contents</h2>
        <ul className="space-y-3">
          {posts.map((post) => (
            <li
              key={post.slug}
              className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors"
            >
              <Link
                href={`/docs/${post.slug}`}
                className="text-blue-600 hover:underline text-xl"
              >
                {post.title}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
}
