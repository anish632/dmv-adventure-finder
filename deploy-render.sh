#!/bin/bash

echo "🚀 Deploying DMV Adventure Finder Backend to Render"
echo "=================================================="

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${GREEN}✅ Backend is ready for deployment!${NC}"
echo ""
echo -e "${YELLOW}📋 Manual Deployment Steps for Render:${NC}"
echo ""
echo "1. Go to https://render.com and sign in with GitHub"
echo "2. Click 'New Web Service'"
echo "3. Connect your GitHub repository: dmv-adventure-finder"
echo "4. Configure the service:"
echo "   - Name: dmv-adventure-finder-backend"
echo "   - Environment: Python 3"
echo "   - Build Command: pip install -r requirements.txt"
echo "   - Start Command: gunicorn app:app"
echo "5. Add Environment Variable:"
echo "   - Key: GEMINI_API_KEY"
echo "   - Value: [Your Gemini API Key]"
echo "6. Click 'Create Web Service'"
echo ""
echo -e "${GREEN}✅ After deployment, your backend will be available at:${NC}"
echo "https://dmv-adventure-finder-backend.onrender.com"
echo ""
echo -e "${YELLOW}🔧 The frontend is already configured to use this backend URL.${NC}"
echo ""
echo -e "${GREEN}🎉 Once deployed, your app will work perfectly!${NC}"
