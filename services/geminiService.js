export async function getSuggestions(location, time, budget) {
  try {
    const response = await fetch('/api/suggestions', {
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
