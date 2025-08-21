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
            "description": "Start your day with a peaceful sunrise at the Lincoln Memorial. Beat the crowds and enjoy the serene atmosphere while watching the sun rise over the National Mall. Perfect for photography, meditation, or just quiet reflection.",
            "estimated_cost": "Free",
            "location_hint": "Lincoln Memorial, National Mall"
          },
          {
            "name": "Morning Walk in Rock Creek Park",
            "description": "Explore the largest urban park in the country during the quiet morning hours. The 32-mile trail system offers perfect opportunities for bird watching, photography, or just enjoying nature before the city wakes up.",
            "estimated_cost": "Free",
            "location_hint": "Rock Creek Park, various trailheads"
          },
          {
            "name": "Tidal Basin Reflection Walk",
            "description": "Take a contemplative morning walk around the Tidal Basin, enjoying the calm waters and cherry blossom trees (in season). The 2.1-mile loop offers stunning views of the Jefferson Memorial and Washington Monument.",
            "estimated_cost": "Free",
            "location_hint": "Tidal Basin, near Jefferson Memorial"
          },
          {
            "name": "Capitol Hill Architecture Tour",
            "description": "Explore the historic Capitol Hill neighborhood in the morning light. Admire the beautiful row houses, visit Eastern Market, and learn about the area's rich history dating back to the 1790s.",
            "estimated_cost": "Free",
            "location_hint": "Capitol Hill neighborhood, Eastern Market area"
          }
        ],
        "Cheap ($)": [
          {
            "name": "Coffee Tour of Georgetown",
            "description": "Visit the best coffee shops in Georgetown while exploring the historic neighborhood. Start at Compass Coffee, then visit Blue Bottle Coffee, and end at Georgetown Cupcake for a sweet treat.",
            "estimated_cost": "$10-20 for coffee and pastries",
            "location_hint": "Georgetown neighborhood, M Street and Wisconsin Avenue"
          },
          {
            "name": "Eastern Market Breakfast",
            "description": "Start your day with fresh pastries from the Market Lunch and coffee from Peregrine Espresso. Then explore the local vendors selling fresh produce, meats, and handmade crafts.",
            "estimated_cost": "$15-25 for breakfast",
            "location_hint": "Eastern Market, 7th Street SE"
          },
          {
            "name": "National Gallery of Art Early Access",
            "description": "Visit the National Gallery of Art when it opens at 10 AM to beat the crowds. Focus on the West Building's European masterpieces or the East Building's modern art collection.",
            "estimated_cost": "Free admission, $5-15 for coffee/snacks",
            "location_hint": "National Gallery of Art, National Mall"
          }
        ],
        "Moderate ($$)": [
          {
            "name": "Brunch at the Watergate Hotel",
            "description": "Enjoy a sophisticated brunch with a view of the Potomac River at the historic Watergate Hotel's Kingbird restaurant. Their eggs benedict and bottomless mimosas are legendary.",
            "estimated_cost": "$30-50 per person",
            "location_hint": "Watergate Hotel, 2650 Virginia Avenue NW"
          },
          {
            "name": "Smithsonian American Art Museum Tour",
            "description": "Book a guided tour of the Smithsonian American Art Museum and National Portrait Gallery. Learn about American artists and historical figures while enjoying the beautiful architecture.",
            "estimated_cost": "$25-40 per person",
            "location_hint": "Smithsonian American Art Museum, 8th and F Streets NW"
          }
        ],
        "Splurge ($$$)": [
          {
            "name": "Private Monument Tour",
            "description": "Book a private guided tour of the National Mall monuments at sunrise, with exclusive access and photography opportunities. Includes transportation and professional guide.",
            "estimated_cost": "$100-200 per person",
            "location_hint": "National Mall monuments"
          },
          {
            "name": "Luxury Spa Morning at the Four Seasons",
            "description": "Start your day with a luxurious spa treatment at the Four Seasons Hotel Georgetown. Choose from massages, facials, or the signature Georgetown treatment.",
            "estimated_cost": "$150-300 per person",
            "location_hint": "Four Seasons Hotel Georgetown, 2800 Pennsylvania Avenue NW"
          }
        ]
      },
      "Afternoon": {
        "Free": [
          {
            "name": "National Gallery of Art Scavenger Hunt",
            "description": "Create your own art scavenger hunt at the National Gallery. Look for specific paintings like Van Gogh's 'Self-Portrait,' Da Vinci's 'Ginevra de' Benci,' or the stunning architecture of the rotunda.",
            "estimated_cost": "Free",
            "location_hint": "National Gallery of Art, National Mall"
          },
          {
            "name": "Library of Congress Exploration",
            "description": "Visit the stunning Library of Congress and explore its beautiful architecture and exhibits. Don't miss the Main Reading Room, the Gutenberg Bible, and the Thomas Jefferson Building's magnificent interior.",
            "estimated_cost": "Free",
            "location_hint": "Library of Congress, 1st Street SE"
          },
          {
            "name": "National Museum of Natural History",
            "description": "Explore the Smithsonian's Natural History Museum, home to the Hope Diamond, dinosaur fossils, and the famous elephant in the rotunda. Perfect for families and science enthusiasts.",
            "estimated_cost": "Free",
            "location_hint": "National Museum of Natural History, National Mall"
          },
          {
            "name": "U Street Cultural Walk",
            "description": "Explore the historic U Street neighborhood, known for its jazz history and African American culture. Visit the African American Civil War Memorial and walk past historic jazz clubs.",
            "estimated_cost": "Free",
            "location_hint": "U Street NW, between 9th and 18th Streets"
          }
        ],
        "Cheap ($)": [
          {
            "name": "Ben's Chili Bowl Lunch",
            "description": "Try the famous half-smoke at Ben's Chili Bowl, a DC institution since 1958. This historic restaurant has served everyone from presidents to celebrities and is a must-visit for food lovers.",
            "estimated_cost": "$10-20 per person",
            "location_hint": "Ben's Chili Bowl, 1213 U Street NW"
          },
          {
            "name": "National Portrait Gallery Lunch",
            "description": "Enjoy lunch at the National Portrait Gallery's Courtyard Café, surrounded by beautiful architecture and art. The museum is free, and the café offers great sandwiches and salads.",
            "estimated_cost": "$15-25 per person",
            "location_hint": "National Portrait Gallery, 8th and F Streets NW"
          }
        ],
        "Moderate ($$)": [
          {
            "name": "Georgetown Shopping and Dining",
            "description": "Spend the afternoon shopping in Georgetown's boutique stores and enjoy lunch at one of the area's excellent restaurants like Farmers Fishers Bakers or 1789 Restaurant.",
            "estimated_cost": "$40-80 per person",
            "location_hint": "Georgetown neighborhood, M Street and Wisconsin Avenue"
          }
        ],
        "Splurge ($$$)": [
          {
            "name": "Private White House Tour",
            "description": "Book a private tour of the White House (requires advance planning and security clearance). Experience the history and grandeur of the most famous house in America.",
            "estimated_cost": "$200-500 per person",
            "location_hint": "White House, 1600 Pennsylvania Avenue NW"
          }
        ]
      },
      "Evening": {
        "Free": [
          {
            "name": "Monument Night Photography",
            "description": "Capture the monuments in a different light with evening photography. The Lincoln Memorial, Jefferson Memorial, and Washington Monument are especially beautiful when lit up at night.",
            "estimated_cost": "Free",
            "location_hint": "National Mall monuments"
          },
          {
            "name": "Kennedy Center Millennium Stage",
            "description": "Enjoy free performances at the Kennedy Center's Millennium Stage. Every evening at 6 PM, they host free concerts, dance performances, and cultural events.",
            "estimated_cost": "Free",
            "location_hint": "John F. Kennedy Center for the Performing Arts"
          }
        ],
        "Cheap ($)": [
          {
            "name": "U Street Jazz Night",
            "description": "Experience DC's jazz heritage at venues like Twins Jazz or Bohemian Caverns. Many places offer affordable cover charges and great live music.",
            "estimated_cost": "$10-30 cover charge",
            "location_hint": "U Street NW jazz clubs"
          }
        ],
        "Moderate ($$)": [
          {
            "name": "Dinner at Old Ebbitt Grill",
            "description": "Dine at DC's oldest saloon, Old Ebbitt Grill, just steps from the White House. Known for their oysters, burgers, and historic atmosphere.",
            "estimated_cost": "$40-80 per person",
            "location_hint": "Old Ebbitt Grill, 675 15th Street NW"
          }
        ],
        "Splurge ($$$)": [
          {
            "name": "Fine Dining at The Inn at Little Washington",
            "description": "Experience world-class dining at The Inn at Little Washington, a Michelin-starred restaurant in the Virginia countryside. Reservations required well in advance.",
            "estimated_cost": "$200-400 per person",
            "location_hint": "The Inn at Little Washington, Washington, VA"
          }
        ]
      },
      "All Day": {
        "Free": [
          {
            "name": "DC Neighborhood Explorer",
            "description": "Spend the day exploring different DC neighborhoods like Adams Morgan, Dupont Circle, and U Street. Each area has its own unique character, restaurants, and attractions.",
            "estimated_cost": "Free (plus transportation)",
            "location_hint": "Various DC neighborhoods"
          },
          {
            "name": "Smithsonian Museum Marathon",
            "description": "Visit multiple Smithsonian museums in one day. Start with Natural History, then American History, Air and Space, and finish with the National Gallery of Art.",
            "estimated_cost": "Free",
            "location_hint": "National Mall Smithsonian museums"
          }
        ],
        "Cheap ($)": [
          {
            "name": "DC Food Truck Tour",
            "description": "Sample the best of DC's food truck scene. Visit different locations throughout the day to try various cuisines from local food trucks.",
            "estimated_cost": "$20-40 for multiple meals",
            "location_hint": "Various food truck locations around DC"
          }
        ],
        "Moderate ($$)": [
          {
            "name": "DC Brewery Tour",
            "description": "Visit multiple DC breweries like DC Brau, Atlas Brew Works, and Bluejacket. Many offer tours and tastings throughout the day.",
            "estimated_cost": "$50-100 per person",
            "location_hint": "Various DC breweries"
          }
        ],
        "Splurge ($$$)": [
          {
            "name": "Luxury DC Experience",
            "description": "Book a luxury car service and visit high-end restaurants, spas, and shopping destinations throughout the day. Includes private guide and transportation.",
            "estimated_cost": "$300-600 per person",
            "location_hint": "Various luxury destinations in DC"
          }
        ]
      }
    },
    "Maryland": {
      "Morning": {
        "Free": [
          {
            "name": "Annapolis Harbor Walk",
            "description": "Take a morning stroll along the Annapolis harbor, watching boats come and go while enjoying the historic maritime atmosphere. Visit the Naval Academy and see the midshipmen in formation.",
            "estimated_cost": "Free",
            "location_hint": "Annapolis City Dock and Naval Academy"
          },
          {
            "name": "Baltimore Inner Harbor Sunrise",
            "description": "Watch the sunrise over the Baltimore Inner Harbor and enjoy the peaceful morning atmosphere. Walk along the promenade and see the historic ships at the Maritime Museum.",
            "estimated_cost": "Free",
            "location_hint": "Baltimore Inner Harbor"
          },
          {
            "name": "Great Falls Park Morning Hike",
            "description": "Start your day with a refreshing hike at Great Falls Park, enjoying the waterfalls and natural beauty. The Billy Goat Trail offers stunning views of the Potomac River.",
            "estimated_cost": "Free",
            "location_hint": "Great Falls Park, Potomac, MD"
          }
        ],
        "Cheap ($)": [
          {
            "name": "Baltimore Farmers Market",
            "description": "Visit the Baltimore Farmers Market under the Jones Falls Expressway. Sample local produce, baked goods, and artisanal products from Maryland vendors.",
            "estimated_cost": "$10-25 for breakfast and purchases",
            "location_hint": "Baltimore Farmers Market, Holliday Street"
          }
        ]
      },
      "Afternoon": {
        "Free": [
          {
            "name": "Antietam Battlefield Walk",
            "description": "Explore the historic Antietam Battlefield and learn about this important Civil War site. Walk the Bloody Lane and visit the Dunker Church for a sobering history lesson.",
            "estimated_cost": "Free",
            "location_hint": "Antietam National Battlefield, Sharpsburg"
          },
          {
            "name": "Chesapeake Bay Maritime Museum",
            "description": "Visit the Chesapeake Bay Maritime Museum in St. Michaels to learn about the region's maritime heritage. See historic boats and learn about oyster harvesting.",
            "estimated_cost": "Free (donations accepted)",
            "location_hint": "Chesapeake Bay Maritime Museum, St. Michaels"
          }
        ],
        "Moderate ($$)": [
          {
            "name": "Maryland Crab Feast",
            "description": "Enjoy a traditional Maryland crab feast at a local restaurant. Learn to pick blue crabs and enjoy the state's famous seafood with Old Bay seasoning.",
            "estimated_cost": "$40-80 per person",
            "location_hint": "Various crab houses in Annapolis and Baltimore"
          }
        ]
      }
    },
    "Virginia": {
      "Morning": {
        "Free": [
          {
            "name": "Mount Vernon Trail",
            "description": "Walk or bike along the scenic Mount Vernon Trail, which follows the Potomac River and offers beautiful views of the water and wildlife. The 18-mile trail connects Alexandria to Mount Vernon.",
            "estimated_cost": "Free",
            "location_hint": "Mount Vernon Trail, Alexandria to Mount Vernon"
          },
          {
            "name": "Great Falls Park Morning Hike",
            "description": "Start your day with a refreshing hike at Great Falls Park, enjoying the waterfalls and natural beauty. The Virginia side offers different viewpoints than the Maryland side.",
            "estimated_cost": "Free",
            "location_hint": "Great Falls Park, McLean, VA"
          },
          {
            "name": "Arlington National Cemetery",
            "description": "Visit Arlington National Cemetery in the morning for a solemn and respectful experience. Watch the Changing of the Guard at the Tomb of the Unknown Soldier.",
            "estimated_cost": "Free",
            "location_hint": "Arlington National Cemetery"
          }
        ],
        "Cheap ($)": [
          {
            "name": "Old Town Alexandria Coffee Tour",
            "description": "Explore the historic Old Town Alexandria while visiting local coffee shops like Misha's Coffee and Killer ESP. Enjoy the colonial architecture and waterfront views.",
            "estimated_cost": "$10-20 for coffee and pastries",
            "location_hint": "Old Town Alexandria, King Street"
          }
        ]
      },
      "Afternoon": {
        "Free": [
          {
            "name": "Old Town Alexandria Stroll",
            "description": "Explore the historic Old Town Alexandria with its charming streets, shops, and waterfront views. Visit the Torpedo Factory Art Center and walk along the Potomac River.",
            "estimated_cost": "Free",
            "location_hint": "Old Town Alexandria, King Street and waterfront"
          },
          {
            "name": "Mount Vernon Estate",
            "description": "Visit George Washington's Mount Vernon estate and learn about the life of America's first president. Tour the mansion, gardens, and outbuildings.",
            "estimated_cost": "Free (grounds only), $20 for mansion tour",
            "location_hint": "Mount Vernon Estate, Mount Vernon, VA"
          }
        ],
        "Moderate ($$)": [
          {
            "name": "Virginia Wine Country Tour",
            "description": "Visit Virginia's wine country in Loudoun County. Tour multiple wineries and enjoy tastings of Virginia's excellent wines with beautiful mountain views.",
            "estimated_cost": "$50-100 per person",
            "location_hint": "Loudoun County wineries"
          }
        ]
      },
      "Evening": {
        "Free": [
          {
            "name": "National Harbor Sunset",
            "description": "Watch the sunset from National Harbor with views of the Potomac River and DC skyline. Walk along the waterfront and see the Capital Wheel lit up at night.",
            "estimated_cost": "Free",
            "location_hint": "National Harbor, Oxon Hill, MD"
          }
        ],
        "Moderate ($$)": [
          {
            "name": "Dinner at The Inn at Little Washington",
            "description": "Experience world-class dining at The Inn at Little Washington, a Michelin-starred restaurant in the Virginia countryside. Reservations required well in advance.",
            "estimated_cost": "$200-400 per person",
            "location_hint": "The Inn at Little Washington, Washington, VA"
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
