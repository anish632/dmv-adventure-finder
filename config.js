// Configuration for different environments
const config = {
  // For GitHub Pages, you'll need to set this in the repository secrets
  // and use it in the GitHub Actions workflow
  GEMINI_API_KEY: process.env.GEMINI_API_KEY || '',
  
  // Fallback to a demo key for development (you should replace this with your actual key)
  // Note: This is not secure for production, but allows the app to work for demos
  DEMO_MODE: !process.env.GEMINI_API_KEY,
};

export default config;
