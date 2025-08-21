#!/usr/bin/env python3
"""
Setup script for DMV Adventure Finder
"""

import subprocess
import sys
import os

def run_command(command, description):
    """Run a command and handle errors"""
    print(f"🔄 {description}...")
    try:
        result = subprocess.run(command, shell=True, check=True, capture_output=True, text=True)
        print(f"✅ {description} completed successfully")
        return True
    except subprocess.CalledProcessError as e:
        print(f"❌ {description} failed: {e.stderr}")
        return False

def check_python_version():
    """Check if Python version is compatible"""
    version = sys.version_info
    if version.major < 3 or (version.major == 3 and version.minor < 8):
        print("❌ Python 3.8 or higher is required")
        return False
    print(f"✅ Python {version.major}.{version.minor}.{version.micro} detected")
    return True

def install_dependencies():
    """Install Python dependencies"""
    return run_command("pip install -r requirements.txt", "Installing Python dependencies")

def check_env_file():
    """Check if .env file exists"""
    if not os.path.exists('.env'):
        print("⚠️  .env file not found")
        print("Please create a .env file with your GEMINI_API_KEY:")
        print("GEMINI_API_KEY=your_api_key_here")
        return False
    print("✅ .env file found")
    return True

def main():
    print("🚀 Setting up DMV Adventure Finder...")
    print()
    
    # Check Python version
    if not check_python_version():
        sys.exit(1)
    
    # Install dependencies
    if not install_dependencies():
        sys.exit(1)
    
    # Check environment file
    check_env_file()
    
    print()
    print("🎉 Setup completed!")
    print()
    print("To run the application:")
    print("  npm run dev:full  # Run both frontend and backend")
    print("  npm run backend   # Run backend only")
    print("  npm run dev       # Run frontend only")

if __name__ == "__main__":
    main()
