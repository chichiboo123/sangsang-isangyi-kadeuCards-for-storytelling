# Fixing GitHub Pages 404 Errors for Single Page Applications (SPAs)

This guide explains how to fix the common 404 error that occurs when deploying Single Page Applications to GitHub Pages.

## The Problem

When you deploy a React/Vue/Angular SPA to GitHub Pages and get a 404 error, it's usually due to two main issues:

1. **Incorrect Base Path**: GitHub Pages serves your site from a subpath (e.g., `username.github.io/repository-name/`), but your app is configured for root path serving
2. **Client-Side Routing**: GitHub Pages doesn't understand client-side routing and returns 404 for non-root routes

## Solution Overview

### 1. Fix the Base Path Configuration

#### For Vite Projects

Update your `vite.config.js` or build script to include the correct base path:

```javascript
export default defineConfig({
  // Other config...
  base: "/your-repository-name/",
});
```

**Example**: If your repository is `https://github.com/username/my-awesome-app`, set:
```javascript
base: "/my-awesome-app/",
```

#### For Create React App Projects

Add this to your `package.json`:

```json
{
  "homepage": "https://username.github.io/repository-name"
}
```

#### For Next.js Projects

Update `next.config.js`:

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  basePath: '/repository-name',
  assetPrefix: '/repository-name/',
  trailingSlash: true,
  images: {
    unoptimized: true
  }
}

module.exports = nextConfig
```

### 2. Add SPA Routing Support

Create a `404.html` file in your build output directory (or public folder) to handle client-side routing:

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <title>Your App Title</title>
    <script type="text/javascript">
      // Single Page App 404 redirect workaround
      // https://github.com/rafgraph/spa-github-pages
      var pathSegmentsToKeep = 1;
      var l = window.location;
      l.replace(
        l.protocol + '//' + l.hostname + (l.port ? ':' + l.port : '') +
        l.pathname.split('/').slice(0, 1 + pathSegmentsToKeep).join('/') + '/?/' +
        l.pathname.slice(1).split('/').slice(pathSegmentsToKeep).join('/').replace(/&/g, '~and~') +
        (l.search ? '&' + l.search.slice(1).replace(/&/g, '~and~') : '') +
        l.hash
      );
    </script>
  </head>
  <body>
  </body>
</html>
```

### 3. GitHub Actions Workflow

Ensure your `.github/workflows/deploy.yml` builds and deploys correctly:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: "pages"
  cancel-in-progress: false

jobs:
  build:
    runs-on: ubuntu-latest
    
    steps:
    - name: Checkout
      uses: actions/checkout@v4
      
    - name: Setup Node.js
      uses: actions/setup-node@v4
      with:
        node-version: '18'
        cache: 'npm'
        
    - name: Install dependencies
      run: npm ci
      
    - name: Build
      run: npm run build  # or your build command
      
    - name: Setup Pages
      uses: actions/configure-pages@v4
      
    - name: Upload artifact
      uses: actions/upload-pages-artifact@v3
      with:
        path: './dist'  # or './build' for CRA

  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    needs: build
    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

## Step-by-Step Implementation

### Step 1: Identify Your Repository Name

From your GitHub repository URL `https://github.com/username/repository-name`, extract the repository name.

### Step 2: Update Build Configuration

Choose the appropriate method based on your framework:

- **Vite**: Update `vite.config.js` with correct `base` path
- **CRA**: Add `homepage` to `package.json`
- **Next.js**: Update `next.config.js` with `basePath` and `assetPrefix`
- **Custom Build**: Ensure your bundler outputs correct asset paths

### Step 3: Add 404.html for SPA Routing

Create the `404.html` file in your public directory or ensure it's copied to your build output.

### Step 4: Test Locally

Build your project and verify:
1. Asset paths include the repository name
2. The built HTML references assets with correct paths
3. The 404.html file is present in the build output

### Step 5: Deploy

1. Commit your changes
2. Push to main branch
3. Check GitHub Actions for successful deployment
4. Test your live site at `https://username.github.io/repository-name/`

## Common Issues and Solutions

### Issue: Assets Still Not Loading

**Solution**: Double-check that all asset references (images, fonts, etc.) use the correct base path. If using relative imports, ensure your bundler is configured to include the base path.

### Issue: Routing Still Doesn't Work

**Solution**: Verify that:
1. Your router is configured for hash routing or properly handles the base path
2. The 404.html script correctly calculates `pathSegmentsToKeep` (usually 1 for most repos)

### Issue: GitHub Actions Fails

**Solution**: Check:
1. Repository has Pages enabled in Settings
2. Workflow has correct permissions
3. Build command matches your project setup
4. Output directory path is correct in the upload step

## Framework-Specific Notes

### React Router

If using React Router, configure it with the base path:

```jsx
import { BrowserRouter } from 'react-router-dom';

function App() {
  return (
    <BrowserRouter basename="/repository-name">
      {/* Your routes */}
    </BrowserRouter>
  );
}
```

### Vue Router

```javascript
const router = createRouter({
  history: createWebHistory('/repository-name/'),
  routes: [
    // Your routes
  ]
})
```

### Wouter (as used in this project)

Wouter automatically handles the base path when you set it in Vite config, no additional configuration needed.

## Testing Your Fix

1. **Local Test**: Build locally and serve the dist folder to ensure paths are correct
2. **GitHub Pages Test**: After deployment, test:
   - Root path: `https://username.github.io/repository-name/`
   - Direct route access: `https://username.github.io/repository-name/some-route`
   - Asset loading in browser dev tools

## Additional Resources

- [GitHub Pages Documentation](https://docs.github.com/en/pages)
- [SPA GitHub Pages Workaround](https://github.com/rafgraph/spa-github-pages)
- [Vite Deployment Guide](https://vitejs.dev/guide/static-deploy.html#github-pages)

---

This guide should resolve most GitHub Pages deployment issues for SPAs. If you encounter other issues, check the browser console and GitHub Actions logs for specific error messages.
