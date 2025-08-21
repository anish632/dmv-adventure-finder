# GitHub Pages Setup Guide

## Enable GitHub Pages

1. **Go to Repository Settings**
   - Navigate to your repository: https://github.com/anish632/dmv-adventure-finder
   - Click on "Settings" tab

2. **Scroll to Pages Section**
   - In the left sidebar, click on "Pages"

3. **Configure Source**
   - **Source**: Select "GitHub Actions"
   - This will use the workflow we created in `.github/workflows/github-pages.yml`

4. **Save Configuration**
   - The GitHub Actions workflow will automatically build and deploy your site

## What Happens Next

1. **Automatic Deployment**: Every push to the `main` branch triggers a new deployment
2. **Build Process**: The workflow will:
   - Install Node.js dependencies
   - Build the React app
   - Deploy to GitHub Pages
3. **Live Site**: Your site will be available at `https://anish632.github.io/dmv-adventure-finder`

## Troubleshooting

### If the site doesn't load:
1. Check the "Actions" tab to see if the deployment succeeded
2. Ensure the repository is public (GitHub Pages requires public repos for free accounts)
3. Wait a few minutes for the first deployment to complete

### If API calls fail:
1. Make sure your backend is deployed and accessible
2. Check the browser console for CORS errors
3. Verify the backend URL in `services/geminiService.js`

### If the build fails:
1. Check the GitHub Actions logs
2. Ensure all dependencies are properly listed in `package.json`
3. Verify the build works locally with `npm run build`

## Custom Domain (Optional)

If you want to use a custom domain:

1. **Add Custom Domain**
   - In Pages settings, enter your domain in the "Custom domain" field
   - Save the configuration

2. **Configure DNS**
   - Add a CNAME record pointing to `anish632.github.io`
   - Or add A records pointing to GitHub Pages IP addresses

3. **SSL Certificate**
   - GitHub will automatically provision an SSL certificate
   - This may take up to 24 hours

## Monitoring

- **Deployment Status**: Check the "Actions" tab for build status
- **Site Analytics**: Available in the Pages settings
- **Performance**: Monitor load times and optimize as needed

## Security

- **HTTPS**: GitHub Pages automatically provides HTTPS
- **CORS**: The backend needs to allow requests from your GitHub Pages domain
- **API Keys**: Never expose API keys in the frontend code

## Cost

- **GitHub Pages**: Free for public repositories
- **Bandwidth**: 100GB per month included
- **Build Time**: 2000 minutes per month included
