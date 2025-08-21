<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# DMV Adventure Finder

A web application that helps users discover fun activities in the DC, Maryland, and Virginia area using AI-powered suggestions.

## Architecture

- **Frontend**: React with JavaScript (Vite)
- **Backend**: Python Flask API
- **AI**: Google Gemini AI for activity suggestions

## Setup

### Prerequisites

- Node.js (v16 or higher)
- Python (v3.8 or higher)
- Google Gemini API key

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/anish632/dmv-adventure-finder.git
   cd dmv-adventure-finder
   ```

2. **Install frontend dependencies**
   ```bash
   npm install
   ```

3. **Install Python dependencies**
   ```bash
   pip install -r requirements.txt
   # or use the setup script
   python setup.py
   ```

4. **Set up environment variables**
   Create a `.env` file in the root directory:
   ```
   GEMINI_API_KEY=your_gemini_api_key_here
   ```

## Running the Application

### Development Mode (Both Frontend and Backend)

```bash
npm run dev:full
```

This will start both the Python backend (port 5000) and the React frontend (port 5173).

### Running Separately

**Backend only:**
```bash
npm run backend
# or
python app.py
```

**Frontend only:**
```bash
npm run dev
```

### Production Build

```bash
npm run build
npm run preview
```

## Deployment

### GitHub Pages (Frontend) - Automatic

The frontend is automatically deployed to GitHub Pages on every push to the main branch.

- **Live Demo**: [https://anish632.github.io/dmv-adventure-finder](https://anish632.github.io/dmv-adventure-finder)
- **Backend API**: [https://dmv-adventure-finder-backend.onrender.com](https://dmv-adventure-finder-backend.onrender.com)

### Frontend Deployment (Vercel)

1. **Connect to Vercel**
   - Install Vercel CLI: `npm i -g vercel`
   - Run: `vercel`

2. **Automatic Deployment**
   - Push to main branch triggers automatic deployment
   - Vercel will use the `vercel.json` configuration

### Backend Deployment (Render)

1. **Deploy to Render**
   - Connect your GitHub repository to Render
   - Create a new Web Service
   - Use the `render.yaml` configuration
   - Set environment variable: `GEMINI_API_KEY`

2. **Alternative: Railway**
   - Connect repository to Railway
   - Set environment variables
   - Deploy automatically

### Alternative: Heroku

1. **Deploy to Heroku**
   ```bash
   heroku create your-app-name
   heroku config:set GEMINI_API_KEY=your_key
   git push heroku main
   ```

## API Endpoints

- `POST /api/suggestions` - Get activity suggestions based on location, time, and budget
- `GET /health` - Health check endpoint

## Features

- Select location (DC, Maryland, Virginia)
- Choose time of day (Morning, Afternoon, Evening, All Day)
- Set budget range (Free, Cheap, Moderate, Splurge)
- AI-powered activity suggestions
- Responsive design with dark mode support

## Technologies Used

- **Frontend**: React, Vite, Tailwind CSS
- **Backend**: Flask, Flask-CORS, Gunicorn
- **AI**: Google Generative AI (Gemini)
- **Development**: Concurrently for running multiple processes
- **Deployment**: GitHub Pages (Frontend), Render/Railway (Backend)

## CI/CD

GitHub Actions automatically:
- Tests frontend build
- Validates Python dependencies
- Runs code linting
- Deploys to GitHub Pages
- Prepares for deployment

## Live Demo

- **Frontend**: [GitHub Pages](https://anish632.github.io/dmv-adventure-finder)
- **Backend**: [Render Deployment](https://dmv-adventure-finder-backend.onrender.com)
