const express = require("express");
const path = require("path");
const fs = require("fs-extra");
const marked = require("marked");

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware for parsing form data
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

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

    // Special case for the add new page route
    if (url === "/add-new") {
      return renderAddNewPage(req, res, next);
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

// API endpoint to create a new markdown file
app.post("/api/create-page", async (req, res) => {
  try {
    const { filePath, content } = req.body;

    if (!filePath || !content) {
      return res
        .status(400)
        .json({ error: "File path and content are required" });
    }

    // Sanitize the file path (remove leading slash if present and ensure it ends with .md)
    let sanitizedPath = filePath.replace(/^\/+/, "");
    if (!sanitizedPath.endsWith(".md")) {
      sanitizedPath += ".md";
    }

    // Create the full path to the file
    const fullPath = path.join(__dirname, "public", sanitizedPath);

    // Ensure directory exists
    await fs.ensureDir(path.dirname(fullPath));

    // Check if file already exists
    if (await fs.pathExists(fullPath)) {
      return res.status(409).json({ error: "File already exists" });
    }

    // Write the file
    await fs.writeFile(fullPath, content);

    res.status(201).json({
      success: true,
      path: "/" + sanitizedPath.replace(/\.md$/, ""),
    });
  } catch (err) {
    console.error("Error creating file:", err);
    res.status(500).json({ error: "Failed to create file" });
  }
});

// Render the Add New Page form
function renderAddNewPage(req, res, next) {
  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1">
      <title>Add New Documentation Page</title>
      <style>
        body {
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
          line-height: 1.6;
          color: #333;
          max-width: 800px;
          margin: 0 auto;
          padding: 20px;
        }
        h1, h2 {
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
        .form-container {
          background-color: #f6f8fa;
          border: 1px solid #e1e4e8;
          border-radius: 6px;
          padding: 16px;
          margin-top: 20px;
        }
        .form-title {
          margin-top: 0;
        }
        .form-group {
          margin-bottom: 15px;
        }
        label {
          display: block;
          margin-bottom: 5px;
          font-weight: 600;
        }
        input, textarea {
          width: 100%;
          padding: 8px;
          border: 1px solid #ddd;
          border-radius: 4px;
          font-family: inherit;
          font-size: 16px;
          box-sizing: border-box;
        }
        textarea {
          min-height: 300px;
          resize: vertical;
        }
        button {
          background-color: #0366d6;
          color: white;
          border: none;
          padding: 10px 16px;
          border-radius: 4px;
          font-size: 16px;
          cursor: pointer;
        }
        button:hover {
          background-color: #0256b9;
        }
        .alert {
          padding: 10px;
          margin: 10px 0;
          border-radius: 4px;
          display: none;
        }
        .alert-success {
          background-color: #d4edda;
          color: #155724;
          border: 1px solid #c3e6cb;
        }
        .alert-error {
          background-color: #f8d7da;
          color: #721c24;
          border: 1px solid #f5c6cb;
        }
        .nav {
          margin-bottom: 20px;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="nav">
          <a href="/">← Back to Documentation Home</a>
        </div>
        
        <h1>Add New Documentation Page</h1>
        
        <div class="form-container">
          <div id="alert-success" class="alert alert-success">
            Page created successfully! <a id="view-link" href="#">View your new page</a>
          </div>
          <div id="alert-error" class="alert alert-error"></div>
          
          <form id="create-page-form">
            <div class="form-group">
              <label for="file-path">File Path:</label>
              <input 
                type="text" 
                id="file-path" 
                name="file-path" 
                placeholder="e.g., category/page-name" 
                required
              >
              <small>This will determine the URL of your page. Don't include leading slash or .md extension.</small>
            </div>
            <div class="form-group">
              <label for="content">Content (Markdown):</label>
              <textarea 
                id="content" 
                name="content" 
                placeholder="# Your Title

## Subtitle

Your content here..." 
                required
              ></textarea>
            </div>
            <div class="form-actions">
              <button type="submit">Create Page</button>
              <button type="button" id="back-button" style="background-color: #6c757d; margin-left: 10px;">Cancel</button>
            </div>
          </form>
        </div>
        
        <script>
          document.getElementById('back-button').addEventListener('click', () => {
            window.location.href = '/';
          });
        
          document.getElementById('create-page-form').addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const filePath = document.getElementById('file-path').value;
            const content = document.getElementById('content').value;
            const successAlert = document.getElementById('alert-success');
            const errorAlert = document.getElementById('alert-error');
            
            // Reset alerts
            successAlert.style.display = 'none';
            errorAlert.style.display = 'none';
            
            try {
              // Use either the API route or the serverless function depending on environment
              const endpoint = '/api/create-page';
              
              const response = await fetch(endpoint, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({ filePath, content }),
              });
              
              const data = await response.json();
              
              if (response.ok) {
                // Show success message
                document.getElementById('view-link').href = data.path;
                successAlert.style.display = 'block';
                
                // Reset form
                document.getElementById('file-path').value = '';
                document.getElementById('content').value = '';
                
                // Scroll to top to see success message
                window.scrollTo(0, 0);
              } else {
                // Show error message
                errorAlert.textContent = data.error || 'Failed to create page';
                errorAlert.style.display = 'block';
              }
            } catch (err) {
              console.error('Error:', err);
              errorAlert.textContent = 'An unexpected error occurred';
              errorAlert.style.display = 'block';
            }
          });
        </script>
      </div>
    </body>
    </html>
  `);
}

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
          h1, h2 {
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
          .header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 20px;
          }
          .btn {
            display: inline-block;
            background-color: #0366d6;
            color: white;
            padding: 8px 16px;
            border-radius: 4px;
            text-decoration: none;
          }
          .btn:hover {
            background-color: #0256b9;
            text-decoration: none;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Documentation</h1>
            <a href="/add-new" class="btn">Add New</a>
          </div>
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

// For local development
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Documentation server running at http://localhost:${PORT}`);
  });
}

// Export the Express app for Vercel
module.exports = app;
