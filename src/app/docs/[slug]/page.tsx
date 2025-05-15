import { getAllPostSlugs, getPostBySlug } from "@/utils/markdown";
import { Metadata } from "next";
import { notFound } from "next/navigation";

// Generate static params for all slugs
export function generateStaticParams() {
  const slugs = getAllPostSlugs();
  return slugs.map((slug) => ({
    slug,
  }));
}

// Generate metadata for the page
export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const post = getPostBySlug(params.slug);

  if (!post) {
    return {
      title: "Document Not Found",
    };
  }

  return {
    title: post.title,
  };
}

// The page component that displays completely raw markdown
export default function DocumentPage({ params }: { params: { slug: string } }) {
  const post = getPostBySlug(params.slug);

  if (!post) {
    notFound();
  }

  // Return the raw markdown content as pre-formatted text with no transformation
  return (
    <pre
      style={{
        fontFamily: "monospace",
        whiteSpace: "pre-wrap",
        margin: "0",
        padding: "0",
        border: "none",
        background: "transparent",
      }}
    >
      {post.content}
    </pre>
  );
}
