import fs from "fs";
import matter from "gray-matter";
import path from "path";

// Directory where markdown content is stored
const contentDirectory = path.join(process.cwd(), "src/content");

export interface PostData {
  slug: string;
  title: string;
  content: string;
}

// Get all markdown files from the content directory
export function getAllPostSlugs(): string[] {
  const fileNames = fs.readdirSync(contentDirectory);
  return fileNames.map((fileName) => {
    return fileName.replace(/\.md$/, "");
  });
}

// Get sorted list of all posts with metadata
export function getAllPosts(): PostData[] {
  const fileNames = fs.readdirSync(contentDirectory);
  const allPostsData = fileNames.map((fileName) => {
    // Remove ".md" from file name to get the slug
    const slug = fileName.replace(/\.md$/, "");

    // Read markdown file as string
    const fullPath = path.join(contentDirectory, fileName);
    const fileContents = fs.readFileSync(fullPath, "utf8");

    // Use gray-matter to parse the post metadata section
    const matterResult = matter(fileContents);

    // Return the data
    return {
      slug,
      title: matterResult.data.title || slug,
      content: matterResult.content,
    };
  });

  // Sort posts by title
  return allPostsData.sort((a, b) => {
    if (a.title < b.title) {
      return -1;
    } else {
      return 1;
    }
  });
}

// Get post data by slug
export function getPostBySlug(slug: string): PostData | null {
  try {
    const fullPath = path.join(contentDirectory, `${slug}.md`);
    const fileContents = fs.readFileSync(fullPath, "utf8");

    // Use gray-matter to parse the post metadata section
    const matterResult = matter(fileContents);

    // Return the data
    return {
      slug,
      title: matterResult.data.title || slug,
      content: matterResult.content,
    };
  } catch {
    return null;
  }
}
