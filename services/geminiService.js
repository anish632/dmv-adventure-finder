import config from '../config.js';

// Direct Gemini API integration for GitHub Pages deployment
export async function getSuggestions(location, time, budget) {
  try {
    // Check if we have an API key
    if (!config.GEMINI_API_KEY) {
      console.log('No API key found, using fallback suggestions');
      return getFallbackSuggestions(location, time, budget);
    }

    // Use the Google Generative AI JavaScript SDK
    const { GoogleGenerativeAI } = await import('@google/generative-ai');
    
    const genAI = new GoogleGenerativeAI(config.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });

    const prompt = `
      I'm looking for creative and fun things to do. Please give me 4 unique suggestions based on these criteria:
      - Location: ${location}
      - Time of Day: ${time}
      - Budget: ${budget}

      Focus on interesting, non-cliche ideas. For example, instead of "visit a museum," suggest "a late-night tour of a specific exhibit" or "a scavenger hunt in the National Portrait Gallery."

      Return the response as a JSON array with the following structure:
      [
        {
          "name": "A short, catchy name for the activity",
          "description": "A creative and appealing one-paragraph description of the activity",
          "estimated_cost": "A brief description of the potential cost, like 'Free', '$10-$20 per person', etc.",
          "location_hint": "A hint about where this activity could take place, e.g., 'Georgetown waterfront' or 'Shenandoah National Park'"
        }
      ]
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Parse the JSON response
    const jsonMatch = text.match(/\[[\s\S]*\]/);
    if (jsonMatch) {
      const suggestions = JSON.parse(jsonMatch[0]);
      return suggestions;
    } else {
      // Fallback: try to parse the entire response
      const suggestions = JSON.parse(text);
      return suggestions;
    }

  } catch (error) {
    console.error("Error fetching suggestions from Gemini API:", error);
    
    // Return fallback suggestions if API fails
    return getFallbackSuggestions(location, time, budget);
  }
}

// Fallback suggestions when API is not available
function getFallbackSuggestions(location, time, budget) {
  const fallbackData = {
    "Washington D.C.": {
      "Morning": {
        "Free": [
          {
            "name": "Sunrise at the Lincoln Memorial",
            "description": "Start your day with a peaceful sunrise at the Lincoln Memorial. Beat the crowds and enjoy the serene atmosphere while watching the sun rise over the National Mall.",
            "estimated_cost": "Free",
            "location_hint": "Lincoln Memorial, National Mall"
          },
          {
            "name": "Morning Walk in Rock Creek Park",
            "description": "Explore the largest urban park in the country during the quiet morning hours. Perfect for bird watching, photography, or just enjoying nature.",
            "estimated_cost": "Free",
            "location_hint": "Rock Creek Park"
          },
          {
            "name": "Tidal Basin Reflection Walk",
            "description": "Take a contemplative morning walk around the Tidal Basin, enjoying the calm waters and cherry blossom trees (in season). Perfect for meditation and photography.",
            "estimated_cost": "Free",
            "location_hint": "Tidal Basin"
          },
          {
            "name": "Capitol Hill Architecture Tour",
            "description": "Explore the historic Capitol Hill neighborhood in the morning light. Admire the beautiful row houses and learn about the area's rich history.",
            "estimated_cost": "Free",
            "location_hint": "Capitol Hill neighborhood"
          }
        ],
        "Cheap ($)": [
          {
            "name": "Coffee Tour of Georgetown",
            "description": "Visit the best coffee shops in Georgetown while exploring the historic neighborhood. Perfect for morning people who love caffeine and architecture.",
            "estimated_cost": "$10-20 for coffee and pastries",
            "location_hint": "Georgetown neighborhood"
          },
          {
            "name": "Eastern Market Breakfast",
            "description": "Start your day with fresh pastries and coffee at Eastern Market, then explore the local vendors and artists.",
            "estimated_cost": "$15-25 for breakfast",
            "location_hint": "Eastern Market"
          }
        ],
        "Moderate ($$)": [
          {
            "name": "Brunch at the Watergate Hotel",
            "description": "Enjoy a sophisticated brunch with a view of the Potomac River at the historic Watergate Hotel.",
            "estimated_cost": "$30-50 per person",
            "location_hint": "Watergate Hotel"
          }
        ],
        "Splurge ($$$)": [
          {
            "name": "Private Monument Tour",
            "description": "Book a private guided tour of the National Mall monuments at sunrise, with exclusive access and photography opportunities.",
            "estimated_cost": "$100-200 per person",
            "location_hint": "National Mall"
          }
        ]
      },
      "Afternoon": {
        "Free": [
          {
            "name": "National Gallery of Art Scavenger Hunt",
            "description": "Create your own art scavenger hunt at the National Gallery. Look for specific paintings, sculptures, or architectural details.",
            "estimated_cost": "Free",
            "location_hint": "National Gallery of Art"
          },
          {
            "name": "Library of Congress Exploration",
            "description": "Visit the stunning Library of Congress and explore its beautiful architecture and exhibits.",
            "estimated_cost": "Free",
            "location_hint": "Library of Congress"
          }
        ]
      },
      "Evening": {
        "Free": [
          {
            "name": "Monument Night Photography",
            "description": "Capture the monuments in a different light with evening photography. The lighting creates dramatic and beautiful shots.",
            "estimated_cost": "Free",
            "location_hint": "National Mall"
          }
        ]
      },
      "All Day": {
        "Free": [
          {
            "name": "DC Neighborhood Explorer",
            "description": "Spend the day exploring different DC neighborhoods like Adams Morgan, Dupont Circle, and U Street.",
            "estimated_cost": "Free (plus transportation)",
            "location_hint": "Various DC neighborhoods"
          }
        ]
      }
    },
    "Maryland": {
      "Morning": {
        "Free": [
          {
            "name": "Annapolis Harbor Walk",
            "description": "Take a morning stroll along the Annapolis harbor, watching boats come and go while enjoying the historic maritime atmosphere.",
            "estimated_cost": "Free",
            "location_hint": "Annapolis City Dock"
          },
          {
            "name": "Baltimore Inner Harbor Sunrise",
            "description": "Watch the sunrise over the Baltimore Inner Harbor and enjoy the peaceful morning atmosphere.",
            "estimated_cost": "Free",
            "location_hint": "Baltimore Inner Harbor"
          }
        ]
      },
      "Afternoon": {
        "Free": [
          {
            "name": "Antietam Battlefield Walk",
            "description": "Explore the historic Antietam Battlefield and learn about this important Civil War site.",
            "estimated_cost": "Free",
            "location_hint": "Antietam National Battlefield"
          }
        ]
      }
    },
    "Virginia": {
      "Morning": {
        "Free": [
          {
            "name": "Mount Vernon Trail",
            "description": "Walk or bike along the scenic Mount Vernon Trail, which follows the Potomac River and offers beautiful views of the water and wildlife.",
            "estimated_cost": "Free",
            "location_hint": "Mount Vernon Trail, Alexandria"
          },
          {
            "name": "Great Falls Park Morning Hike",
            "description": "Start your day with a refreshing hike at Great Falls Park, enjoying the waterfalls and natural beauty.",
            "estimated_cost": "Free",
            "location_hint": "Great Falls Park"
          }
        ]
      },
      "Afternoon": {
        "Free": [
          {
            "name": "Old Town Alexandria Stroll",
            "description": "Explore the historic Old Town Alexandria with its charming streets, shops, and waterfront views.",
            "estimated_cost": "Free",
            "location_hint": "Old Town Alexandria"
          }
        ]
      }
    }
  };

  const suggestions = fallbackData[location]?.[time]?.[budget] || [
    {
      "name": "Local Adventure Discovery",
      "description": "Explore your local area with fresh eyes. Try a new route, visit a neighborhood you've never been to, or find a hidden gem in your own backyard.",
      "estimated_cost": budget === "Free" ? "Free" : "Varies",
      "location_hint": "Your local area"
    },
    {
      "name": "Seasonal Activity Finder",
      "description": "Discover activities that are perfect for the current season and weather conditions in your area.",
      "estimated_cost": "Varies",
      "location_hint": "Local area"
    },
    {
      "name": "Cultural Exploration",
      "description": "Visit a local museum, gallery, or cultural center to learn something new about your community.",
      "estimated_cost": "Usually free or low cost",
      "location_hint": "Local cultural venues"
    },
    {
      "name": "Outdoor Adventure",
      "description": "Find a local park, trail, or outdoor space to enjoy nature and get some fresh air.",
      "estimated_cost": "Free",
      "location_hint": "Local parks and trails"
    }
  ];

  return suggestions;
}
