# Deploying Cursor Docs to Vercel

This guide will walk you through deploying the Cursor Docs application to Vercel.

## Prerequisites

1. A [Vercel account](https://vercel.com/signup)
2. [Git](https://git-scm.com/downloads) installed on your machine
3. A [GitHub](https://github.com), [GitLab](https://gitlab.com), or [Bitbucket](https://bitbucket.org) account

## Option 1: Deploy with Vercel CLI

1. **Install the Vercel CLI**:

   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel**:

   ```bash
   vercel login
   ```

3. **Deploy the application**:

   ```bash
   vercel
   ```

4. Follow the prompts to configure your deployment.

## Option 2: Deploy with Git Integration

1. **Push your code to a Git repository**:

   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin <your-repository-url>
   git push -u origin main
   ```

2. **Import your repository in Vercel**:
   - Go to [Vercel Dashboard](https://vercel.com/dashboard)
   - Click "Add New..." > "Project"
   - Select your repository from the list
   - Configure project settings if needed (defaults should work fine)
   - Click "Deploy"

## Post-Deployment Steps

1. **Access your deployed application**:

   - Once deployment is complete, Vercel will provide you with a URL
   - Your application will be available at `https://<project-name>.<username>.vercel.app`

2. **Add Custom Domain** (Optional):
   - In your Vercel project settings, go to "Domains"
   - Add your custom domain and follow the instructions

## Handling Storage on Vercel

This application uses the filesystem for storing markdown files. On Vercel's serverless environment, filesystem changes won't persist across deployments or function invocations.

For production use with file creation capabilities, consider:

1. **Using Environment Variables**:

   - Set up a database or storage service (like MongoDB, Firebase, or AWS S3)
   - Add appropriate environment variables in Vercel's project settings

2. **Modify the API**:

   - Update the API endpoints to use the external storage instead of the filesystem
   - This would require additional code changes

3. **For Demo/Personal Use**:
   - The current setup will work for demonstration purposes
   - Files created through the web interface will persist until the next deployment
   - Prepopulate important markdown files in the `public` directory before deployment

## Troubleshooting

- **Build Errors**: Check the build logs in Vercel dashboard
- **API Issues**: Verify that your API routes are properly configured
- **File Access Problems**: Remember that filesystem access is limited in serverless environments

## Additional Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Express.js on Vercel](https://vercel.com/guides/using-express-with-vercel)
- [Serverless Functions on Vercel](https://vercel.com/docs/concepts/functions/serverless-functions)
