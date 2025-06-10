# GitHub Pages SPA Fix: Quick Guide

## The Problem
GitHub Pages serves your app at `https://username.github.io/repository-name/` but your SPA expects to run at the root path.

## The Solution
Configure **both** your bundler AND router with the correct base path.

## Step 1: Configure Build Tool

### Vite
```javascript
// vite.config.js
export default {
  base: "/repository-name/",
}
```

### Create React App
```json
// package.json
{
  "homepage": "https://username.github.io/repository-name"
}
```

### Next.js
```javascript
// next.config.js
module.exports = {
  basePath: '/repository-name',
  assetPrefix: '/repository-name/',
}
```

## Step 2: Configure Router

### React Router
```jsx
<BrowserRouter basename="/repository-name">
  <Routes>
    <Route path="/" element={<Home />} />
  </Routes>
</BrowserRouter>
```

### Wouter
```jsx
<Router base="/repository-name">
  <Switch>
    <Route path="/" component={Home} />
  </Switch>
</Router>
```

### Vue Router
```javascript
const router = createRouter({
  history: createWebHistory('/repository-name/'),
  routes: [...]
})
```

## Step 3: Deploy
```bash
git add .
git commit -m "Fix GitHub Pages base path"
git push origin main
```

## Quick Check
- ✅ Replace `repository-name` with your actual GitHub repo name
- ✅ Both bundler AND router use the same base path
- ✅ Base path starts and ends with `/`

**That's it!** Your SPA will now work on GitHub Pages.
