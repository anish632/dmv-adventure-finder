// Test script to verify the API is working
const testApi = async () => {
  console.log('🧪 Testing DMV Adventure Finder API...');
  
  try {
    const response = await fetch('http://localhost:5001/api/suggestions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        location: 'Washington D.C.',
        time: 'Morning',
        budget: 'Free'
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log('✅ API Test Successful!');
    console.log(`📊 Received ${data.length} suggestions:`);
    
    data.forEach((suggestion, index) => {
      console.log(`\n${index + 1}. ${suggestion.name}`);
      console.log(`   💰 ${suggestion.estimated_cost}`);
      console.log(`   📍 ${suggestion.location_hint}`);
      console.log(`   📝 ${suggestion.description.substring(0, 100)}...`);
    });
    
  } catch (error) {
    console.error('❌ API Test Failed:', error.message);
    console.log('\n🔧 Troubleshooting:');
    console.log('1. Make sure the backend is running: python3 app.py');
    console.log('2. Check if port 5001 is available');
    console.log('3. Verify your GEMINI_API_KEY is set in .env file');
  }
};

// Run the test
testApi();
