import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <h1 className="text-4xl font-bold mb-4">404 - Not Found</h1>
      <p className="text-lg mb-8">
        The page you are looking for does not exist.
      </p>
      <Link href="/" className="text-blue-600 hover:underline">
        Return to Table of Contents
      </Link>
    </div>
  );
}
