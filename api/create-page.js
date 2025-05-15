const path = require("path");
const fs = require("fs-extra");

module.exports = async (req, res) => {
  // Only allow POST requests
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

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
    const fullPath = path.join(process.cwd(), "public", sanitizedPath);

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
};
