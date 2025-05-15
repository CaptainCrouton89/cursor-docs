const express = require("express");
const path = require("path");
const fs = require("fs-extra");
const marked = require("marked");

const app = express();
const PORT = process.env.PORT || 3990;

// Middleware to parse markdown files
app.use(async (req, res, next) => {
  const url = req.path;

  // Skip for non-GET requests or requests to static files
  if (req.method !== "GET" || path.extname(url)) {
    return next();
  }

  try {
    // Special case for root route - generate table of contents
    if (url === "/") {
      return generateTableOfContents(req, res, next);
    }

    // Try to find and serve a markdown file
    const mdPath = path.join(__dirname, "public", url + ".md");

    if (await fs.pathExists(mdPath)) {
      // Serve raw markdown content
      const content = await fs.readFile(mdPath, "utf8");
      res.set("Content-Type", "text/markdown");
      return res.send(content);
    }

    next();
  } catch (err) {
    console.error("Error processing markdown:", err);
    next(err);
  }
});

// Generate table of contents
async function generateTableOfContents(req, res, next) {
  try {
    const publicDir = path.join(__dirname, "public");
    const toc = await generateTOC(publicDir);

    return res.send(`
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <title>Documentation - Table of Contents</title>
        <style>
          body {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
          }
          h1 {
            font-size: 2em;
            border-bottom: 1px solid #eaecef;
            padding-bottom: 0.3em;
          }
          a {
            color: #0366d6;
            text-decoration: none;
          }
          a:hover {
            text-decoration: underline;
          }
          ul {
            padding-left: 2em;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>Documentation</h1>
          <p>Welcome to the documentation. Please select a topic from the table of contents below:</p>
          ${toc}
        </div>
      </body>
      </html>
    `);
  } catch (err) {
    console.error("Error generating table of contents:", err);
    next(err);
  }
}

// Generate TOC HTML from directory structure
async function generateTOC(dir, basePath = "") {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  let html = "<ul>";

  for (const entry of entries) {
    const entryPath = path.join(dir, entry.name);
    const relativePath = path.join(basePath, entry.name);

    if (entry.isDirectory()) {
      const dirName = entry.name.charAt(0).toUpperCase() + entry.name.slice(1);
      html += `<li><strong>${dirName}</strong>`;
      html += await generateTOC(entryPath, relativePath);
      html += "</li>";
    } else if (entry.name.endsWith(".md")) {
      const displayName = entry.name
        .replace(".md", "")
        .split("-")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");

      const linkPath = "/" + relativePath.replace(".md", "");
      html += `<li><a href="${linkPath}">${displayName}</a></li>`;
    }
  }

  html += "</ul>";
  return html;
}

// Start the server
app.listen(PORT, () => {
  console.log(`Documentation server running at http://localhost:${PORT}`);
});
