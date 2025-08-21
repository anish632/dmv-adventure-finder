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
   git clone <repository-url>
   cd dmv-adventure-finder
   ```

2. **Install frontend dependencies**
   ```bash
   npm install
   ```

3. **Install Python dependencies**
   ```bash
   pip install -r requirements.txt
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
- **Backend**: Flask, Flask-CORS
- **AI**: Google Generative AI (Gemini)
- **Development**: Concurrently for running multiple processes
