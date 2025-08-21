<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# DMV Adventure Finder

A web application that helps users discover fun activities in the DC, Maryland, and Virginia area using AI-powered suggestions.

## Architecture

- **Frontend**: React with JavaScript (Vite)
- **AI**: Google Gemini AI for activity suggestions
- **Deployment**: GitHub Pages (single application)

## Features

- Select location (DC, Maryland, Virginia)
- Choose time of day (Morning, Afternoon, Evening, All Day)
- Set budget range (Free, Cheap, Moderate, Splurge)
- AI-powered activity suggestions
- Responsive design with dark mode support
- Works entirely in the browser

## Setup

### Prerequisites

- Node.js (v16 or higher)
- Google Gemini API key

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/anish632/dmv-adventure-finder.git
   cd dmv-adventure-finder
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env` file in the root directory:
   ```
   GEMINI_API_KEY=your_gemini_api_key_here
   ```

## Running the Application

### Development Mode

```bash
npm run dev
```

This will start the React frontend on port 5173 (or the next available port).

### Production Build

```bash
npm run build
npm run preview
```

## Deployment

### GitHub Pages (Automatic)

The application is automatically deployed to GitHub Pages on every push to the main branch.

- **Live Demo**: [https://anish632.github.io/dmv-adventure-finder](https://anish632.github.io/dmv-adventure-finder)

### Setting up API Key for GitHub Pages

1. **Go to Repository Settings**
   - Navigate to your repository: https://github.com/anish632/dmv-adventure-finder/settings
   - Click on "Secrets and variables" → "Actions"

2. **Add Repository Secret**
   - Click "New repository secret"
   - Name: `GEMINI_API_KEY`
   - Value: Your Google Gemini API key
   - Click "Add secret"

3. **Deploy**
   - Push to main branch triggers automatic deployment
   - The API key will be securely included in the build

## How It Works

- **Single Application**: Everything runs in the browser
- **Direct API Integration**: Frontend directly calls Google Gemini AI
- **Fallback Mode**: Works even without API key using curated suggestions
- **No Backend Required**: Completely serverless architecture

## API Integration

The application uses the Google Generative AI JavaScript SDK to directly call the Gemini API from the browser. This eliminates the need for a separate backend server.

### Fallback Mode

If no API key is provided, the application will use curated fallback suggestions for each location, time, and budget combination.

## Technologies Used

- **Frontend**: React, Vite, Tailwind CSS
- **AI**: Google Generative AI (Gemini) JavaScript SDK
- **Deployment**: GitHub Pages
- **Architecture**: Single-page application with client-side AI integration

## CI/CD

GitHub Actions automatically:
- Tests frontend build
- Includes API key securely in build process
- Deploys to GitHub Pages
- Handles environment variables

## Live Demo

- **Application**: [GitHub Pages](https://anish632.github.io/dmv-adventure-finder)

## Security

- **API Key**: Stored securely in GitHub Secrets
- **Client-Side**: API key is embedded in build but not exposed in source code
- **HTTPS**: Automatically provided by GitHub Pages
- **No Server**: No backend to secure or maintain

## Cost

- **GitHub Pages**: Free for public repositories
- **Bandwidth**: 100GB per month included
- **Build Time**: 2000 minutes per month included
- **Gemini API**: Pay-per-use (very affordable)
