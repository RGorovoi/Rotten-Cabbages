# Firebase Hosting Deployment Guide

## Environment Variables for Firebase Hosting

Vite bakes environment variables into the build at **build time**. You need to set them when running `npm run build`.

### Option 1: Set Environment Variables During Build (Recommended)

When building for production, set the environment variables:

```bash
# Build with production API URL
VITE_API_URL=https://your-api.onrender.com VITE_MOCK=0 npm run build

# Then deploy
firebase deploy --only hosting
```

### Option 2: Create a Build Script

Add this to your `package.json` scripts:

```json
"build:firebase": "VITE_API_URL=https://your-api.onrender.com VITE_MOCK=0 vite build"
```

Then run:
```bash
npm run build:firebase
firebase deploy --only hosting
```

### Option 3: Use .env.production File

Create `.env.production` in the `rotten-cabbages/` directory:

```
VITE_API_URL=https://your-api.onrender.com
VITE_MOCK=0
```

Then build normally:
```bash
npm run build
firebase deploy --only hosting
```

**Note:** `.env.production` is gitignored, so you'll need to create it on your deployment machine or in your CI/CD pipeline.

### Important Notes:

1. **VITE_ prefix required**: Only variables starting with `VITE_` are exposed to the client
2. **Build-time only**: Environment variables are baked into the JavaScript bundle during build
3. **No runtime changes**: You can't change them after deployment without rebuilding
4. **Security**: These variables are visible in the client-side code, so don't put secret keys here

### For CI/CD (GitHub Actions, etc.):

Set environment variables in your CI/CD secrets and use them in the build step:

```yaml
- name: Build
  run: |
    VITE_API_URL=${{ secrets.VITE_API_URL }} VITE_MOCK=0 npm run build
```

