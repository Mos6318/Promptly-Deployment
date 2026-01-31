# Deployment Guide for Vercel

This project is a React Single Page Application (SPA) built with Vite. It is ready for deployment on Vercel.

## Prerequisites

1.  **Vercel Account**: Sign up at [vercel.com](https://vercel.com/signup).
2.  **Git Repository**: Your project should be pushed to a Git provider like GitHub, GitLab, or Bitbucket.

## Step 1: Verify Local Build

Before deploying, it's good practice to ensure your project builds locally.

```bash
npm run build
```

If this command completes without errors and creates a `dist` folder, you are ready to proceed.

## Step 2: Push to Git

Ensure all your changes, including the new `vercel.json` file, are committed and pushed to your repository.

```bash
git add .
git commit -m "Prepare for Vercel deployment"
git push
```

## Step 3: Deploy on Vercel

1.  Go to your [Vercel Dashboard](https://vercel.com/dashboard).
2.  Click **"Add New..."** -> **"Project"**.
3.  Import your Git repository.
4.  **Configure Project**:
    *   **Framework Preset**: It should automatically detect **Vite**. If not, select it manually.
    *   **Root Directory**: Leave as `./` (default).
    *   **Build Command**: `npm run build` (default).
    *   **Output Directory**: `dist` (default).
    *   **Environment Variables**: No extra variables are needed for this project currently.
5.  Click **"Deploy"**.

## Troubleshooting

-   **404 on Refresh**: If you experience 404 errors when refreshing pages other than the home page, ensure the `vercel.json` file is present in the root of your repository. This file handles the rewrite rules for client-side routing.
