#!/bin/bash

# DMV Adventure Finder Deployment Script
# This script helps deploy the application to various platforms

set -e

echo "🚀 DMV Adventure Finder Deployment Script"
echo "=========================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Check if we're in the right directory
if [ ! -f "package.json" ] || [ ! -f "app.py" ]; then
    print_error "Please run this script from the project root directory"
    exit 1
fi

# Function to build the project
build_project() {
    print_status "Building frontend..."
    npm run build
    
    if [ -d "dist" ]; then
        print_status "Frontend build successful"
    else
        print_error "Frontend build failed"
        exit 1
    fi
}

# Function to test the backend
test_backend() {
    print_status "Testing backend..."
    
    # Check if Python dependencies are installed
    if ! python -c "import flask, google.generativeai" 2>/dev/null; then
        print_warning "Python dependencies not found. Installing..."
        python -m pip install -r requirements.txt
    fi
    
    # Test if the app can be imported
    if python -c "import app" 2>/dev/null; then
        print_status "Backend test successful"
    else
        print_error "Backend test failed"
        exit 1
    fi
}

# Function to deploy to Vercel
deploy_vercel() {
    print_status "Deploying to Vercel..."
    
    if ! command -v vercel &> /dev/null; then
        print_warning "Vercel CLI not found. Installing..."
        npm install -g vercel
    fi
    
    vercel --prod
}

# Function to deploy to Render
deploy_render() {
    print_warning "Render deployment requires manual setup:"
    echo "1. Go to https://render.com"
    echo "2. Connect your GitHub repository"
    echo "3. Create a new Web Service"
    echo "4. Set environment variable: GEMINI_API_KEY"
    echo "5. Deploy"
}

# Function to deploy to Railway
deploy_railway() {
    print_warning "Railway deployment requires manual setup:"
    echo "1. Go to https://railway.app"
    echo "2. Connect your GitHub repository"
    echo "3. Set environment variable: GEMINI_API_KEY"
    echo "4. Deploy"
}

# Function to deploy to Heroku
deploy_heroku() {
    print_status "Deploying to Heroku..."
    
    if ! command -v heroku &> /dev/null; then
        print_warning "Heroku CLI not found. Installing..."
        npm install -g heroku
    fi
    
    # Check if app exists
    if ! heroku apps:info dmv-adventure-finder-backend &> /dev/null; then
        print_status "Creating Heroku app..."
        heroku create dmv-adventure-finder-backend
    fi
    
    # Set environment variable
    print_status "Setting environment variables..."
    heroku config:set GEMINI_API_KEY="$GEMINI_API_KEY"
    
    # Deploy
    print_status "Deploying to Heroku..."
    git push heroku main
}

# Main deployment function
main() {
    case "$1" in
        "build")
            build_project
            test_backend
            ;;
        "vercel")
            build_project
            deploy_vercel
            ;;
        "render")
            deploy_render
            ;;
        "railway")
            deploy_railway
            ;;
        "heroku")
            test_backend
            deploy_heroku
            ;;
        "all")
            build_project
            test_backend
            deploy_vercel
            deploy_render
            ;;
        *)
            echo "Usage: $0 {build|vercel|render|railway|heroku|all}"
            echo ""
            echo "Commands:"
            echo "  build   - Build the project and test"
            echo "  vercel  - Deploy frontend to Vercel"
            echo "  render  - Show Render deployment instructions"
            echo "  railway - Show Railway deployment instructions"
            echo "  heroku  - Deploy backend to Heroku"
            echo "  all     - Run all deployment steps"
            echo ""
            echo "Environment variables:"
            echo "  GEMINI_API_KEY - Required for backend deployment"
            exit 1
            ;;
    esac
}

# Check for required environment variable
if [ "$1" = "heroku" ] || [ "$1" = "all" ]; then
    if [ -z "$GEMINI_API_KEY" ]; then
        print_error "GEMINI_API_KEY environment variable is required for backend deployment"
        echo "Please set it: export GEMINI_API_KEY=your_api_key_here"
        exit 1
    fi
fi

# Run the main function
main "$1"

print_status "Deployment script completed!"
