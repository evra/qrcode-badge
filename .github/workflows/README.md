# GitHub Actions Workflow - Deploy to GitHub Pages

## Overview

This workflow automatically builds and deploys the QR Code Badge Generator to GitHub Pages whenever code is merged into the `production` branch.

## Workflow File

Location: `.github/workflows/deploy.yml`

## Trigger

```yaml
on:
  push:
    branches:
      - production
```

The workflow triggers on any push to the `production` branch.

## Jobs

### 1. Build Job

**Purpose**: Build the application and prepare artifacts for deployment

**Steps**:
1. **Checkout**: Check out the repository code
2. **Setup Node.js**: Install Node.js v18 with npm caching
3. **Install dependencies**: Run `npm ci` for clean install
4. **Build**: Run `npm run build` to create production bundle
5. **Upload artifact**: Upload the `dist` folder for deployment

### 2. Deploy Job

**Purpose**: Deploy the built application to GitHub Pages

**Steps**:
1. **Deploy to GitHub Pages**: Use the uploaded artifact and deploy it

**Dependencies**: Runs after the `build` job completes successfully

## Permissions

```yaml
permissions:
  contents: read      # Read repository contents
  pages: write        # Write to GitHub Pages
  id-token: write     # Use OIDC token for authentication
```

## Concurrency

```yaml
concurrency:
  group: "pages"
  cancel-in-progress: false
```

Only one deployment runs at a time. New deployments wait for the current one to complete.

## Environment Variables

- `NODE_ENV`: Automatically set to `production` during build
- Base path: Configured in `vite.config.ts` as `/qrcode-badge/`

## Workflow Status

Monitor deployment status:
- Go to the **Actions** tab in your GitHub repository
- Click on the latest workflow run
- View build and deployment logs

## Customization

### Change Branch

To deploy from a different branch, update:

```yaml
on:
  push:
    branches:
      - main  # Change from 'production' to 'main'
```

### Add Build Steps

To add additional build steps (e.g., linting, testing):

```yaml
- name: Lint code
  run: npm run lint

- name: Run tests
  run: npm test
```

### Change Node Version

To use a different Node.js version:

```yaml
- name: Setup Node.js
  uses: actions/setup-node@v4
  with:
    node-version: '20'  # Change from '18' to '20'
```

### Add Environment Variables

To add environment variables for the build:

```yaml
- name: Build
  run: npm run build
  env:
    VITE_API_URL: ${{ secrets.API_URL }}
    VITE_APP_VERSION: ${{ github.sha }}
```

## Secrets and Variables

No secrets are required for basic deployment. For advanced scenarios:

1. Go to **Settings** → **Secrets and variables** → **Actions**
2. Add repository secrets or variables
3. Reference them in the workflow: `${{ secrets.SECRET_NAME }}`

## Troubleshooting

### Build Fails

Check the build job logs:
- Dependency installation errors
- Build compilation errors
- Missing environment variables

### Deployment Fails

Check the deploy job logs:
- Permissions issues
- GitHub Pages not enabled
- Artifact upload/download errors

### App Not Loading

- Verify base path in `vite.config.ts`
- Check browser console for 404 errors
- Ensure GitHub Pages source is set to "GitHub Actions"

## Related Documentation

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [GitHub Pages Documentation](https://docs.github.com/en/pages)
- [Vite Deployment Guide](https://vitejs.dev/guide/static-deploy.html#github-pages)
