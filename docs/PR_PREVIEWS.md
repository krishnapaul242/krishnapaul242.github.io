# PR Preview Deployments

This repository is configured to automatically deploy preview versions of pull requests to GitHub Pages subdirectories.

## How it works

When you create or update a pull request:

1. **Automatic Build**: The GitHub workflow automatically builds your React app with the correct base path
2. **Preview Deployment**: The built app is deployed to `https://krishnapaul242.github.io/pr-{PR_NUMBER}/`
3. **PR Comment**: A bot comment is added to your PR with the preview link
4. **Auto Updates**: The preview is updated every time you push new commits to the PR
5. **Auto Cleanup**: When the PR is closed or merged, the preview is automatically removed

## Preview URLs

- **Production**: `https://krishnapaul.in/` or `https://krishnapaul242.github.io/`
- **PR Previews**: `https://krishnapaul242.github.io/pr-{PR_NUMBER}/`

Note: PR previews are only available via the GitHub Pages URL, not the custom domain.

## Local Testing

To test how your app will work with a base path (like in PR previews):

```bash
npm run preview:pr
```

This will build and preview your app with a `/pr-test` base path using `cross-env` for cross-platform compatibility.

## Technical Details

- **Base Path**: PR previews use `/pr-{PR_NUMBER}` as the base path
- **Deployment**: Uses `peaceiris/actions-gh-pages` action to deploy to the `gh-pages` branch
- **Permissions**: Requires `pull-requests: write` permission for commenting
- **Concurrency**: Uses per-reference concurrency groups to prevent conflicts

## Troubleshooting

### Links not working in preview
Make sure all internal links in your React app use relative paths or the router's built-in navigation.

### Assets not loading
Ensure your assets are imported properly and not using absolute paths that don't account for the base path.

### Clean up stuck previews
If a preview doesn't get cleaned up automatically, you can manually delete the directory from the `gh-pages` branch.
