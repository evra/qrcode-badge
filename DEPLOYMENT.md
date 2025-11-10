# GitHub Pages Deployment Setup

This repository is configured to automatically deploy to GitHub Pages when changes are merged into the `production` branch.

## Initial Setup

### 1. Enable GitHub Pages

1. Go to your repository on GitHub
2. Navigate to **Settings** → **Pages**
3. Under "Build and deployment":
   - **Source**: Select "GitHub Actions"
4. Save the settings

### 2. Create Production Branch

```bash
# Create and push the production branch
git checkout -b production
git push -u origin production
```

### 3. Set Up Branch Protection (Optional but Recommended)

1. Go to **Settings** → **Branches**
2. Click **Add rule** for the `production` branch
3. Recommended settings:
   - ✅ Require a pull request before merging
   - ✅ Require status checks to pass before merging
   - ✅ Require branches to be up to date before merging

## Deployment Process

### Automatic Deployment

When you merge changes into the `production` branch:

1. GitHub Actions will automatically:
   - Check out the code
   - Install dependencies
   - Build the application
   - Deploy to GitHub Pages

2. The app will be available at:
   ```
   https://<your-username>.github.io/qrcode-badge/
   ```

### Manual Deployment

To trigger a deployment:

```bash
# Make your changes on a feature branch
git checkout -b feature/my-feature
git add .
git commit -m "Add new feature"
git push origin feature/my-feature

# Create a pull request to production
# After review and approval, merge to production

# Or directly push to production (not recommended)
git checkout production
git merge main  # or your feature branch
git push origin production
```

## Workflow Details

The deployment workflow (`.github/workflows/deploy.yml`) will:

- **Trigger**: On push to `production` branch
- **Build**: Install dependencies and run `npm run build`
- **Deploy**: Upload the `dist` folder to GitHub Pages
- **Permissions**: Uses GitHub Actions' built-in OIDC token for secure deployment

## Configuration

### Vite Base Path

The `vite.config.ts` is configured to use the correct base path:
- **Development**: `/` (root)
- **Production**: `/qrcode-badge/` (GitHub Pages subpath)

If your repository name is different, update the `base` in `vite.config.ts`:

```typescript
base: process.env.NODE_ENV === 'production' ? '/your-repo-name/' : '/',
```

## Monitoring Deployments

1. Go to **Actions** tab in your repository
2. You'll see all deployment runs
3. Click on a run to see detailed logs
4. Check for any errors during build or deployment

## Troubleshooting

### Deployment Fails

- Check the Actions logs for error messages
- Ensure all dependencies are listed in `package.json`
- Verify the build command works locally: `npm run build`

### 404 on GitHub Pages

- Verify GitHub Pages is enabled in repository settings
- Check that the base path in `vite.config.ts` matches your repository name
- Wait a few minutes for DNS propagation

### Assets Not Loading

- Ensure the base path is correctly set in `vite.config.ts`
- Check browser console for 404 errors on asset paths
- Verify assets are included in the `dist` folder after build

## Local Testing

To test the production build locally:

```bash
# Build the app
npm run build

# Preview the production build
npm run preview
```

This will serve the built app on `http://localhost:4173` with the same configuration as production.

## Custom Domain (Optional)

To use a custom domain:

1. Add a `CNAME` file to the `public` folder with your domain
2. Configure DNS settings with your domain provider
3. Update GitHub Pages settings to use the custom domain

Example `public/CNAME`:
```
your-domain.com
```
