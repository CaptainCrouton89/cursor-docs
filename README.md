# Cursor Docs

A simple Express application to serve markdown documentation.

## Installation

```bash
npm install
```

## Running the Server Locally

```bash
npm run dev   # Run with auto-reload
# or
npm start     # Run without auto-reload
```

The server will start on port 3990 by default. You can access it at http://localhost:3990.

## Documentation Structure

Documentation is stored as markdown files in the `public` directory. The directory structure is used to generate the table of contents.

- `/` - Table of contents (automatically generated)
- `/ai/prompt-guide` - Guide to modern AI system prompts

## Adding New Documentation

You can add new documentation pages in two ways:

1. **Using the web interface**: Click the "Add New" button at the top of the home page
2. **Manually**: Create a new markdown file in the appropriate directory inside `public/`

## Deploying to Vercel

This application is ready to be deployed to Vercel. Follow these steps:

1. **Install Vercel CLI** (optional):

   ```bash
   npm install -g vercel
   ```

2. **Deploy using Vercel CLI**:

   ```bash
   vercel
   ```

3. **Or deploy using the Vercel Dashboard**:

   - Push your code to a Git repository (GitHub, GitLab, or Bitbucket)
   - Import the repository into Vercel
   - Vercel will automatically detect the configuration and deploy the application

4. **Environment Variables**:
   No additional environment variables are required for basic functionality.

## Customization

- Update the styles in the app.js file to customize the appearance of the documentation
- Modify the table of contents generation logic in the `generateTOC` function
- Add more markdown files to expand your documentation
