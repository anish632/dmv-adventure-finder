# Deployment Guide

This guide will help you deploy the DMV Adventure Finder application to production.

## Quick Deploy Options

### Option 1: Vercel (Frontend) + Render (Backend) - Recommended

#### Frontend (Vercel)
1. Go to [Vercel](https://vercel.com) and sign in with GitHub
2. Click "New Project"
3. Import the `dmv-adventure-finder` repository
4. Vercel will automatically detect it's a Vite project
5. Deploy - no additional configuration needed

#### Backend (Render)
1. Go to [Render](https://render.com) and sign in with GitHub
2. Click "New Web Service"
3. Connect the `dmv-adventure-finder` repository
4. Configure:
   - **Name**: `dmv-adventure-finder-backend`
   - **Environment**: `Python 3`
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `gunicorn app:app`
5. Add environment variable:
   - **Key**: `GEMINI_API_KEY`
   - **Value**: Your Gemini API key
6. Deploy

### Option 2: Railway (Full Stack)

1. Go to [Railway](https://railway.app) and sign in with GitHub
2. Click "New Project" → "Deploy from GitHub repo"
3. Select the `dmv-adventure-finder` repository
4. Railway will automatically detect the Python backend
5. Add environment variable: `GEMINI_API_KEY`
6. Deploy

### Option 3: Heroku

#### Backend
```bash
# Install Heroku CLI
npm install -g heroku

# Login to Heroku
heroku login

# Create app
heroku create dmv-adventure-finder-backend

# Set environment variable
heroku config:set GEMINI_API_KEY=your_api_key_here

# Deploy
git push heroku main
```

#### Frontend
1. Create a new Vercel project
2. Point to the same repository
3. Configure build settings to build only the frontend

## Environment Variables

### Required
- `GEMINI_API_KEY`: Your Google Gemini API key

### Optional
- `PORT`: Port for the backend server (default: 5000)
- `FLASK_ENV`: Environment (development/production)

## Manual Deployment Steps

### 1. Build Frontend
```bash
npm install
npm run build
```

### 2. Deploy Backend
```bash
# Install Python dependencies
pip install -r requirements.txt

# Run with gunicorn (production)
gunicorn app:app --bind 0.0.0.0:$PORT

# Or with Flask (development)
python app.py
```

### 3. Configure Reverse Proxy (if needed)

If deploying to a VPS or custom server, configure nginx:

```nginx
server {
    listen 80;
    server_name your-domain.com;

    # Frontend
    location / {
        root /path/to/dist;
        try_files $uri $uri/ /index.html;
    }

    # Backend API
    location /api {
        proxy_pass http://localhost:5000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

## Troubleshooting

### Common Issues

1. **Build Fails**
   - Check Node.js version (v16+ required)
   - Ensure all dependencies are installed
   - Check for TypeScript references (should be .jsx files)

2. **Backend Won't Start**
   - Verify Python version (3.8+ required)
   - Check if GEMINI_API_KEY is set
   - Ensure all Python dependencies are installed

3. **API Calls Fail**
   - Check CORS configuration
   - Verify backend URL in frontend
   - Check network connectivity

4. **Environment Variables**
   - Ensure GEMINI_API_KEY is set in deployment platform
   - Check variable name spelling
   - Restart deployment after adding variables

### Health Checks

Test your deployment:

```bash
# Frontend
curl https://your-frontend-url.com

# Backend
curl https://your-backend-url.com/health
```

## Monitoring

### Logs
- **Vercel**: Dashboard → Project → Functions
- **Render**: Dashboard → Service → Logs
- **Railway**: Dashboard → Project → Deployments

### Performance
- Monitor API response times
- Check for memory leaks
- Monitor Gemini API usage

## Security

1. **API Keys**: Never commit API keys to repository
2. **CORS**: Configure CORS properly for production
3. **HTTPS**: Ensure all deployments use HTTPS
4. **Rate Limiting**: Consider adding rate limiting for API endpoints

## Cost Optimization

1. **Vercel**: Free tier includes 100GB bandwidth
2. **Render**: Free tier includes 750 hours/month
3. **Railway**: Free tier includes $5 credit
4. **Gemini API**: Monitor usage to avoid unexpected charges
