import config from '../config.js';

// Enhanced service that provides creative activity suggestions
export async function getSuggestions(location, time, budget) {
  try {
    // Get creative fallback suggestions
    const fallbackSuggestions = getCreativeFallbackSuggestions(location, time, budget);
    
    // If we have AI API, enhance with AI suggestions
    if (config.GEMINI_API_KEY) {
      try {
        const aiSuggestions = await getAISuggestions(location, time, budget);
        // Combine fallback with AI suggestions
        return combineSuggestions(fallbackSuggestions, aiSuggestions);
      } catch (error) {
        console.log('AI suggestions failed, using creative fallback data');
        return fallbackSuggestions;
      }
    }
    
    return fallbackSuggestions;
  } catch (error) {
    console.error("Error fetching suggestions:", error);
    return getCreativeFallbackSuggestions(location, time, budget);
  }
}

// Get AI-enhanced suggestions
async function getAISuggestions(location, time, budget) {
  const { GoogleGenerativeAI } = await import('@google/generative-ai');
  
  const genAI = new GoogleGenerativeAI(config.GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });

  const prompt = `
    I'm looking for creative and unique things to do. Please give me 2-3 innovative suggestions based on these criteria:
    - Location: ${location}
    - Time of Day: ${time}
    - Budget: ${budget}

    Focus on creative, non-cliche ideas that go beyond typical tourist activities. For example:
    - Instead of "visit a museum," suggest "create a photo story using only reflections in museum windows"
    - Instead of "go to a restaurant," suggest "build your own picnic from 3 different food trucks and find the perfect spot"
    - Instead of "walk in the park," suggest "create a sound map of the park using only natural sounds"

    Make suggestions that are:
    - Creative and unique
    - Interactive and engaging
    - Memorable and shareable
    - Accessible for the given budget

    Return the response as a JSON array with the following structure:
    [
      {
        "name": "A catchy, creative name for the activity",
        "description": "A detailed description explaining the creative concept and how to do it",
        "estimated_cost": "Cost estimate based on the budget level",
        "location_hint": "Where to do this activity"
      }
    ]
  `;

  const result = await model.generateContent(prompt);
  const response = await result.response;
  const text = response.text();

  // Parse the JSON response
  const jsonMatch = text.match(/\[[\s\S]*\]/);
  if (jsonMatch) {
    return JSON.parse(jsonMatch[0]);
  } else {
    return JSON.parse(text);
  }
}

// Combine fallback with AI suggestions
function combineSuggestions(fallbackSuggestions, aiSuggestions) {
  const combined = [...fallbackSuggestions];
  
  // Add AI suggestions if they don't duplicate existing ones
  for (const aiSuggestion of aiSuggestions) {
    const isDuplicate = combined.some(suggestion => 
      suggestion.name.toLowerCase().includes(aiSuggestion.name.toLowerCase()) ||
      aiSuggestion.name.toLowerCase().includes(suggestion.name.toLowerCase())
    );
    
    if (!isDuplicate && combined.length < 6) {
      combined.push(aiSuggestion);
    }
  }
  
  return combined.slice(0, 6);
}

// Creative fallback suggestions with unique activities
function getCreativeFallbackSuggestions(location, time, budget) {
  const creativeData = {
    "Washington D.C.": {
      "Morning": {
        "Free": [
          {
            "name": "Monument Shadow Photography Challenge",
            "description": "Capture the changing shadows of monuments throughout the morning. Start at sunrise and photograph how shadows transform the National Mall. Create a time-lapse story using only shadow images.",
            "estimated_cost": "Free",
            "location_hint": "National Mall, Lincoln Memorial to Washington Monument"
          },
          {
            "name": "DC Street Art Scavenger Hunt",
            "description": "Create your own street art scavenger hunt. Look for murals, graffiti, and public art installations throughout the city. Document each find with creative photos and create a digital art gallery.",
            "estimated_cost": "Free",
            "location_hint": "Various neighborhoods - U Street, Adams Morgan, Capitol Hill"
          },
          {
            "name": "Urban Bird Symphony Recording",
            "description": "Record the morning bird songs in different DC neighborhoods. Compare the sounds of Rock Creek Park vs. urban areas. Create a 'DC Morning Symphony' audio collage.",
            "estimated_cost": "Free",
            "location_hint": "Rock Creek Park, Georgetown, National Mall"
          },
          {
            "name": "Reflection Photography Journey",
            "description": "Photograph monuments and buildings using only their reflections in water, windows, and other reflective surfaces. Create a 'DC Through Reflections' photo series.",
            "estimated_cost": "Free",
            "location_hint": "Tidal Basin, Lincoln Memorial Reflecting Pool, building windows"
          }
        ],
        "Cheap ($)": [
          {
            "name": "Coffee Shop Story Exchange",
            "description": "Visit 3 different coffee shops and collect one story from each barista or customer. Write down their recommendations for hidden gems in DC. Create a 'Local Secrets' guide.",
            "estimated_cost": "$10-20 for coffee",
            "location_hint": "Various coffee shops in Georgetown, Capitol Hill, U Street"
          },
          {
            "name": "Farmer's Market Ingredient Challenge",
            "description": "Buy one ingredient from each vendor at Eastern Market and create a unique dish. Document the process and share your 'Market Masterpiece' creation.",
            "estimated_cost": "$15-25 for ingredients",
            "location_hint": "Eastern Market, 7th Street SE"
          },
          {
            "name": "Bookstore Literary Treasure Hunt",
            "description": "Visit independent bookstores and find books with DC-related themes. Create a reading list based on your discoveries and plan a literary tour of the city.",
            "estimated_cost": "$10-20 for books",
            "location_hint": "Kramerbooks, Politics & Prose, Capitol Hill Books"
          }
        ],
        "Moderate ($$)": [
          {
            "name": "Private Monument Photography Workshop",
            "description": "Book a private photography session at sunrise with a local photographer. Learn creative techniques while capturing the monuments in unique ways.",
            "estimated_cost": "$50-100 per person",
            "location_hint": "National Mall monuments"
          },
          {
            "name": "Culinary History Walking Tour",
            "description": "Take a guided tour of DC's culinary history, visiting historic restaurants and learning about the city's food culture. Sample dishes and collect recipes.",
            "estimated_cost": "$40-80 per person",
            "location_hint": "Various historic restaurants and food districts"
          }
        ],
        "Splurge ($$$)": [
          {
            "name": "Luxury Spa & Art Experience",
            "description": "Combine a luxury spa treatment with a private art consultation. Create your own art piece inspired by DC's architecture and history.",
            "estimated_cost": "$200-400 per person",
            "location_hint": "Four Seasons Hotel Georgetown"
          }
        ]
      },
      "Afternoon": {
        "Free": [
          {
            "name": "Museum Art Interpretation Challenge",
            "description": "Visit a museum and create your own interpretations of artworks. Write short stories, poems, or create sketches inspired by what you see. Share your creative responses.",
            "estimated_cost": "Free",
            "location_hint": "National Gallery of Art, Smithsonian museums"
          },
          {
            "name": "DC Architecture Style Hunt",
            "description": "Photograph buildings representing different architectural styles (Neoclassical, Art Deco, Modern). Create a 'DC Architecture Timeline' collage.",
            "estimated_cost": "Free",
            "location_hint": "Downtown DC, Georgetown, Capitol Hill"
          },
          {
            "name": "Urban Nature Journaling",
            "description": "Create a nature journal documenting urban wildlife, plants, and natural elements in the city. Sketch, write, and photograph your discoveries.",
            "estimated_cost": "Free",
            "location_hint": "Rock Creek Park, National Arboretum, city parks"
          },
          {
            "name": "Sound Map Creation",
            "description": "Walk through different neighborhoods and create a 'sound map' of DC. Record and document the unique sounds of each area.",
            "estimated_cost": "Free",
            "location_hint": "Various DC neighborhoods"
          }
        ],
        "Cheap ($)": [
          {
            "name": "Food Truck Fusion Challenge",
            "description": "Order one item from 3 different food trucks and create a fusion meal. Document your culinary experiment and share the results.",
            "estimated_cost": "$15-30 for food",
            "location_hint": "Various food truck locations around DC"
          },
          {
            "name": "Thrift Store Fashion Show",
            "description": "Visit thrift stores and create a unique DC-inspired outfit. Photograph your creation in front of iconic DC landmarks.",
            "estimated_cost": "$20-40 for clothing",
            "location_hint": "Thrift stores in Adams Morgan, Georgetown"
          }
        ],
        "Moderate ($$)": [
          {
            "name": "Private Art Gallery Tour",
            "description": "Book a private tour of local art galleries and meet with artists. Learn about DC's art scene and collect pieces for your own gallery.",
            "estimated_cost": "$60-120 per person",
            "location_hint": "Various art galleries in DC"
          }
        ],
        "Splurge ($$$)": [
          {
            "name": "Luxury Car & Photography Experience",
            "description": "Rent a luxury car and hire a professional photographer for a high-end DC photo shoot. Create magazine-quality images of your DC adventure.",
            "estimated_cost": "$300-600 per person",
            "location_hint": "Various scenic locations around DC"
          }
        ]
      },
      "Evening": {
        "Free": [
          {
            "name": "Night Light Painting",
            "description": "Use long exposure photography to 'paint' with light around the monuments at night. Create abstract light art using the city as your canvas.",
            "estimated_cost": "Free",
            "location_hint": "National Mall monuments"
          },
          {
            "name": "Urban Astronomy Session",
            "description": "Find the best spots in DC for stargazing despite light pollution. Document constellations visible from different locations in the city.",
            "estimated_cost": "Free",
            "location_hint": "Rock Creek Park, rooftop locations"
          },
          {
            "name": "Jazz History Audio Tour",
            "description": "Create your own audio tour of DC's jazz history. Record ambient sounds and music while walking past historic jazz venues.",
            "estimated_cost": "Free",
            "location_hint": "U Street, Shaw neighborhood"
          }
        ],
        "Cheap ($)": [
          {
            "name": "Underground Music Discovery",
            "description": "Visit small music venues and discover local bands. Create a playlist of your discoveries and share your 'DC Underground' music finds.",
            "estimated_cost": "$10-30 for cover charges",
            "location_hint": "Various small venues around DC"
          }
        ],
        "Moderate ($$)": [
          {
            "name": "Candlelit Dinner & Poetry",
            "description": "Enjoy a romantic dinner and write poetry inspired by the evening. Create a 'DC Evening Poems' collection.",
            "estimated_cost": "$50-100 per person",
            "location_hint": "Various romantic restaurants"
          }
        ],
        "Splurge ($$$)": [
          {
            "name": "Private Chef & Wine Pairing",
            "description": "Hire a private chef for an intimate dinner with wine pairings. Create a personalized DC dining experience.",
            "estimated_cost": "$200-500 per person",
            "location_hint": "Your choice of location"
          }
        ]
      },
      "All Day": {
        "Free": [
          {
            "name": "DC Neighborhood Character Study",
            "description": "Spend the day in different neighborhoods documenting their unique character. Create a 'DC Neighborhood Guide' with photos, stories, and observations.",
            "estimated_cost": "Free",
            "location_hint": "Various DC neighborhoods"
          },
          {
            "name": "Seasonal Change Documentation",
            "description": "Document how DC changes throughout the day. Photograph the same locations at different times and create a 'DC in Motion' time-lapse story.",
            "estimated_cost": "Free",
            "location_hint": "Various locations throughout DC"
          }
        ],
        "Cheap ($)": [
          {
            "name": "Local Artist Collaboration",
            "description": "Visit local artists' studios and collaborate on a piece. Create art inspired by your DC experience.",
            "estimated_cost": "$20-50 for materials",
            "location_hint": "Various artist studios and galleries"
          }
        ],
        "Moderate ($$)": [
          {
            "name": "Multi-Venue Cultural Pass",
            "description": "Purchase a cultural pass and visit multiple venues. Create a 'DC Cultural Journey' blog documenting your experiences.",
            "estimated_cost": "$50-100 per person",
            "location_hint": "Various cultural venues"
          }
        ],
        "Splurge ($$$)": [
          {
            "name": "Luxury DC Experience Design",
            "description": "Work with a personal concierge to design your perfect DC day. Create a completely personalized luxury experience.",
            "estimated_cost": "$500-1000 per person",
            "location_hint": "Various luxury venues and experiences"
          }
        ]
      }
    },
    "Maryland": {
      "Morning": {
        "Free": [
          {
            "name": "Chesapeake Bay Sunrise Meditation",
            "description": "Practice meditation while watching the sunrise over the Chesapeake Bay. Create a 'Bay Morning' mindfulness journal.",
            "estimated_cost": "Free",
            "location_hint": "Various Chesapeake Bay locations"
          },
          {
            "name": "Historic Annapolis Time Travel",
            "description": "Walk through Annapolis imagining yourself in different historical periods. Create a 'Time Travel Diary' of your journey.",
            "estimated_cost": "Free",
            "location_hint": "Historic Annapolis"
          }
        ],
        "Cheap ($)": [
          {
            "name": "Maryland Crab Culture Immersion",
            "description": "Learn about Maryland's crab culture by visiting local markets and talking to fishermen. Create a 'Crab Culture Guide.'",
            "estimated_cost": "$15-30 for samples",
            "location_hint": "Local seafood markets"
          }
        ]
      },
      "Afternoon": {
        "Free": [
          {
            "name": "Civil War Battlefield Reenactment Photography",
            "description": "Visit Antietam and create artistic photographs that tell the story of the battle through modern eyes.",
            "estimated_cost": "Free",
            "location_hint": "Antietam National Battlefield"
          }
        ],
        "Moderate ($$)": [
          {
            "name": "Maryland Wine & Art Experience",
            "description": "Visit Maryland wineries and create art inspired by the wine and landscape. Combine wine tasting with creative expression.",
            "estimated_cost": "$40-80 per person",
            "location_hint": "Maryland wine country"
          }
        ]
      }
    },
    "Virginia": {
      "Morning": {
        "Free": [
          {
            "name": "Mount Vernon Trail Poetry Walk",
            "description": "Walk the Mount Vernon Trail and write poetry inspired by the Potomac River and historical sites along the way.",
            "estimated_cost": "Free",
            "location_hint": "Mount Vernon Trail"
          },
          {
            "name": "Arlington Cemetery Story Collection",
            "description": "Visit Arlington Cemetery and collect stories about the people buried there. Create a 'Voices of Arlington' collection.",
            "estimated_cost": "Free",
            "location_hint": "Arlington National Cemetery"
          }
        ],
        "Cheap ($)": [
          {
            "name": "Old Town Alexandria Ghost Story Hunt",
            "description": "Explore Old Town Alexandria's haunted history. Create your own ghost story based on local legends.",
            "estimated_cost": "$10-20 for coffee and snacks",
            "location_hint": "Old Town Alexandria"
          }
        ]
      },
      "Afternoon": {
        "Free": [
          {
            "name": "Virginia Wine Country Photography",
            "description": "Visit Virginia wineries and create artistic photographs of the vineyards and wine-making process.",
            "estimated_cost": "Free",
            "location_hint": "Virginia wine country"
          }
        ],
        "Moderate ($$)": [
          {
            "name": "Virginia History & Art Workshop",
            "description": "Learn about Virginia's history while creating art inspired by historical events and figures.",
            "estimated_cost": "$30-60 per person",
            "location_hint": "Various historical sites"
          }
        ]
      }
    }
  };

  const suggestions = creativeData[location]?.[time]?.[budget] || [
    {
      "name": "Creative Local Discovery",
      "description": "Use your imagination to discover hidden creative opportunities in your local area. Look for unique angles, perspectives, and experiences.",
      "estimated_cost": budget === "Free" ? "Free" : "Varies",
      "location_hint": "Your local area"
    },
    {
      "name": "Seasonal Creative Challenge",
      "description": "Create art, photography, or writing inspired by the current season and weather conditions in your area.",
      "estimated_cost": "Varies",
      "location_hint": "Local area"
    },
    {
      "name": "Cultural Creative Exchange",
      "description": "Connect with local artists, musicians, or cultural organizations to collaborate on creative projects.",
      "estimated_cost": "Usually free or low cost",
      "location_hint": "Local cultural venues"
    },
    {
      "name": "Nature-Inspired Creativity",
      "description": "Use natural elements in your local area to create art, music, or writing. Let nature be your muse.",
      "estimated_cost": "Free",
      "location_hint": "Local parks and natural areas"
    }
  ];

  return suggestions;
}
