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

## Set up API Key (Required for AI Features)

1. **Go to Repository Secrets**
   - In Settings, click on "Secrets and variables" → "Actions"

2. **Add New Repository Secret**
   - Click "New repository secret"
   - **Name**: `GEMINI_API_KEY`
   - **Value**: Your Google Gemini API key
   - Click "Add secret"

3. **Get Your API Key**
   - Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
   - Create a new API key
   - Copy the key and paste it in the secret value

## What Happens Next

1. **Automatic Deployment**: Every push to the `main` branch triggers a new deployment
2. **Build Process**: The workflow will:
   - Install Node.js dependencies
   - Include your API key securely in the build
   - Build the React app
   - Deploy to GitHub Pages
3. **Live Site**: Your site will be available at `https://anish632.github.io/dmv-adventure-finder`

## How It Works

- **Single Application**: Everything runs in the browser
- **Direct AI Integration**: Frontend directly calls Google Gemini AI
- **No Backend**: Completely serverless architecture
- **Fallback Mode**: Works even without API key using curated suggestions

## Troubleshooting

### If the site doesn't load:
1. Check the "Actions" tab to see if the deployment succeeded
2. Ensure the repository is public (GitHub Pages requires public repos for free accounts)
3. Wait a few minutes for the first deployment to complete

### If AI suggestions don't work:
1. Check if you've added the `GEMINI_API_KEY` secret
2. Verify the API key is valid and has credits
3. Check the browser console for any errors
4. The app will use fallback suggestions if the API fails

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
- **API Key**: Stored securely in GitHub Secrets, embedded in build
- **No Server**: No backend to secure or maintain
- **Client-Side**: All processing happens in the browser

## Cost

- **GitHub Pages**: Free for public repositories
- **Bandwidth**: 100GB per month included
- **Build Time**: 2000 minutes per month included
- **Gemini API**: Pay-per-use (very affordable, ~$0.001 per request)

## Benefits of This Architecture

1. **Simplified Deployment**: Single application, no backend to manage
2. **Cost Effective**: Only pay for API usage, no server costs
3. **Scalable**: Automatically scales with GitHub Pages
4. **Reliable**: Built-in fallback mode ensures app always works
5. **Secure**: API key stored securely, HTTPS by default
