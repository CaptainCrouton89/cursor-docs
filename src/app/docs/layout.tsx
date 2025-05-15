import Link from "next/link";

export default function DocsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div style={{ fontFamily: "monospace", padding: "1rem" }}>
      <div style={{ marginBottom: "1rem" }}>
        <Link href="/" style={{ color: "blue", textDecoration: "none" }}>
          ← Back to Table of Contents
        </Link>
      </div>
      {children}
    </div>
  );
}
