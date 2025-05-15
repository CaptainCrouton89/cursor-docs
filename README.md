# Cursor Docs

A simple Express application to serve markdown documentation.

## Installation

```bash
npm install
```

## Running the Server

```bash
node app.js
```

The server will start on port 3000 by default. You can access it at http://localhost:3000.

## Documentation Structure

Documentation is stored as markdown files in the `public` directory. The directory structure is used to generate the table of contents.

- `/` - Table of contents (automatically generated)
- `/ai/prompt-guide` - Guide to modern AI system prompts

## Adding New Documentation

To add new documentation:

1. Create a new markdown file in the appropriate directory inside `public/`
2. The file will be automatically available at the corresponding URL path
   (e.g., a file at `public/category/topic.md` will be available at `/category/topic`)

## Customization

- Update the styles in the app.js file to customize the appearance of the documentation
- Modify the table of contents generation logic in the `generateTOC` function
