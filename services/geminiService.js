// Get the API base URL based on environment
const getApiBaseUrl = () => {
  // If we're on GitHub Pages, use the backend URL
  if (window.location.hostname === 'anish632.github.io') {
    return 'https://dmv-adventure-finder-backend.onrender.com';
  }
  // For local development, use the proxy
  return '';
};

export async function getSuggestions(location, time, budget) {
  try {
    const apiBaseUrl = getApiBaseUrl();
    const response = await fetch(`${apiBaseUrl}/api/suggestions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        location,
        time,
        budget
      })
    });

    if (!response.ok) {
      throw new Error('Failed to fetch suggestions');
    }

    const suggestions = await response.json();
    return suggestions;
  } catch (error) {
    console.error("Error fetching suggestions:", error);
    return [];
  }
}
