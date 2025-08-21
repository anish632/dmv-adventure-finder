import config from '../config.js';

// Enhanced service that provides creative activity suggestions
export async function getSuggestions(location, time, budget) {
  try {
    // Get museum suggestions first
    const museumSuggestions = getMuseumSuggestions(location, budget);
    
    // Get creative fallback suggestions
    const creativeSuggestions = getCreativeFallbackSuggestions(location, time, budget);
    
    // Combine museum and creative suggestions
    const combinedSuggestions = [...museumSuggestions, ...creativeSuggestions];
    
    // If we have AI API, enhance with AI suggestions
    if (config.GEMINI_API_KEY) {
      try {
        const aiSuggestions = await getAISuggestions(location, time, budget);
        // Combine all suggestions
        return combineSuggestions(combinedSuggestions, aiSuggestions);
      } catch (error) {
        console.log('AI suggestions failed, using museum and creative fallback data');
        return combinedSuggestions.slice(0, 6);
      }
    }
    
    return combinedSuggestions.slice(0, 6);
  } catch (error) {
    console.error("Error fetching suggestions:", error);
    const museumSuggestions = getMuseumSuggestions(location, budget);
    const creativeSuggestions = getCreativeFallbackSuggestions(location, time, budget);
    return [...museumSuggestions, ...creativeSuggestions].slice(0, 6);
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

// Museum data for DC, MD, VA areas
const museumData = {
  "Washington D.C.": {
    "Free": [
      {
        "name": "Smithsonian National Museum of Natural History",
        "description": "Home to the Hope Diamond, dinosaur fossils, and the famous elephant in the rotunda",
        "location": "10th St & Constitution Ave NW",
        "highlights": ["Hope Diamond", "Dinosaur Hall", "Ocean Hall", "Butterfly Pavilion"]
      },
      {
        "name": "Smithsonian National Air and Space Museum",
        "description": "Aviation and space exploration history with iconic aircraft and spacecraft",
        "location": "Independence Ave at 6th St SW",
        "highlights": ["Wright Brothers' Flyer", "Apollo 11 Command Module", "Spirit of St. Louis"]
      },
      {
        "name": "Smithsonian National Museum of American History",
        "description": "American history and culture with iconic artifacts",
        "location": "14th St and Constitution Ave NW",
        "highlights": ["Star-Spangled Banner", "First Ladies' Inaugural Gowns", "Dorothy's Ruby Slippers"]
      },
      {
        "name": "Smithsonian National Gallery of Art",
        "description": "World-class art collection from medieval to modern",
        "location": "6th St and Constitution Ave NW",
        "highlights": ["Van Gogh's Self-Portrait", "Da Vinci's Ginevra de' Benci", "Impressionist Collection"]
      },
      {
        "name": "Smithsonian National Portrait Gallery",
        "description": "Portraits of notable Americans throughout history",
        "location": "8th and F Streets NW",
        "highlights": ["Presidential Portraits", "Contemporary Portraits", "American Origins"]
      },
      {
        "name": "Smithsonian American Art Museum",
        "description": "American art from colonial times to contemporary",
        "location": "8th and F Streets NW",
        "highlights": ["Folk Art", "Contemporary Art", "Photography Collection"]
      },
      {
        "name": "Smithsonian National Museum of African American History and Culture",
        "description": "African American history, culture, and contributions",
        "location": "1400 Constitution Ave NW",
        "highlights": ["Slavery and Freedom", "Civil Rights Movement", "Cultural Expressions"]
      },
      {
        "name": "Smithsonian Hirshhorn Museum and Sculpture Garden",
        "description": "Modern and contemporary art with outdoor sculpture garden",
        "location": "Independence Ave at 7th St SW",
        "highlights": ["Contemporary Art", "Sculpture Garden", "Film Programs"]
      },
      {
        "name": "Smithsonian Freer Gallery of Art",
        "description": "Asian art and American art from the late 19th century",
        "location": "Jefferson Dr at 12th St SW",
        "highlights": ["Chinese Art", "Japanese Art", "Whistler's Peacock Room"]
      },
      {
        "name": "Arthur M. Sackler Gallery",
        "description": "Asian art and archaeology",
        "location": "1050 Independence Ave SW",
        "highlights": ["Ancient Chinese Art", "Islamic Art", "Contemporary Asian Art"]
      },
      {
        "name": "Smithsonian National Museum of the American Indian",
        "description": "Native American history, culture, and art",
        "location": "4th St and Independence Ave SW",
        "highlights": ["Native American Art", "Cultural Programs", "Native Foods Café"]
      },
      {
        "name": "National Postal Museum",
        "description": "Postal history and stamp collecting",
        "location": "2 Massachusetts Ave NE",
        "highlights": ["Stamp Collections", "Postal History", "Interactive Exhibits"]
      },
      {
        "name": "Smithsonian National Museum of African Art",
        "description": "African art and culture",
        "location": "950 Independence Ave SW",
        "highlights": ["Traditional African Art", "Contemporary African Art", "Cultural Programs"]
      },
      {
        "name": "Anacostia Community Museum",
        "description": "Local history and culture of the Anacostia community",
        "location": "1901 Fort Place SE",
        "highlights": ["Local History", "Community Programs", "Cultural Exhibits"]
      },
      {
        "name": "Renwick Gallery",
        "description": "Contemporary American craft and decorative arts",
        "location": "1661 Pennsylvania Ave NW",
        "highlights": ["American Craft", "Contemporary Art", "Decorative Arts"]
      },
      {
        "name": "Library of Congress",
        "description": "World's largest library with stunning architecture",
        "location": "1st St SE",
        "highlights": ["Main Reading Room", "Gutenberg Bible", "Thomas Jefferson Building"]
      },
      {
        "name": "National Archives Museum",
        "description": "Home to the Declaration of Independence, Constitution, and Bill of Rights",
        "location": "701 Constitution Ave NW",
        "highlights": ["Declaration of Independence", "Constitution", "Bill of Rights"]
      },
      {
        "name": "United States Holocaust Memorial Museum",
        "description": "Holocaust history and remembrance",
        "location": "100 Raoul Wallenberg Place SW",
        "highlights": ["Permanent Exhibition", "Memorial Hall", "Children's Tile Wall"]
      },
      {
        "name": "National Gallery of Art Sculpture Garden",
        "description": "Outdoor sculpture collection and ice skating in winter",
        "location": "7th St and Constitution Ave NW",
        "highlights": ["Outdoor Sculptures", "Ice Skating", "Fountain"]
      },
      {
        "name": "Folger Shakespeare Library",
        "description": "Shakespeare and Renaissance literature and art",
        "location": "201 E Capitol St SE",
        "highlights": ["Shakespeare Collection", "Renaissance Art", "Historic Theater"]
      },
      {
        "name": "National Museum of Women in the Arts",
        "description": "Art by women from the Renaissance to contemporary",
        "location": "1250 New York Ave NW",
        "highlights": ["Women Artists", "Historical Art", "Contemporary Exhibitions"]
      },
      {
        "name": "DAR Museum",
        "description": "American decorative arts from colonial to modern times",
        "location": "1776 D St NW",
        "highlights": ["Period Rooms", "Decorative Arts", "American History"]
      },
      {
        "name": "African American Civil War Memorial Museum",
        "description": "African American contributions during the Civil War",
        "location": "1925 Vermont Ave NW",
        "highlights": ["Civil War History", "African American Heroes", "Interactive Exhibits"]
      },
      {
        "name": "National Museum of the US Navy",
        "description": "US Navy history and naval heritage",
        "location": "Washington Navy Yard",
        "highlights": ["Naval History", "Ship Models", "Military Artifacts"]
      },
      {
        "name": "Old Stone House",
        "description": "Georgetown's oldest unchanged building from 1765",
        "location": "3051 M St NW",
        "highlights": ["Colonial Architecture", "Historic Rooms", "Garden"]
      },
      {
        "name": "Mary McLeod Bethune Council House National Historic Site",
        "description": "Home and headquarters of civil rights leader Mary McLeod Bethune",
        "location": "1318 Vermont Ave NW",
        "highlights": ["Civil Rights History", "Women's History", "Educational Programs"]
      },
      {
        "name": "Frederick Douglass National Historic Site",
        "description": "Home of abolitionist and orator Frederick Douglass",
        "location": "1411 W St SE",
        "highlights": ["Abolitionist History", "Historic Home", "Personal Artifacts"]
      },
      {
        "name": "Ford's Theatre",
        "description": "Historic theater where Lincoln was assassinated",
        "location": "511 10th St NW",
        "highlights": ["Lincoln Assassination", "Historic Theater", "Presidential Box"]
      },
      {
        "name": "President Lincoln's Cottage",
        "description": "Lincoln's seasonal retreat where he wrote the Emancipation Proclamation",
        "location": "140 Rock Creek Church Rd NW",
        "highlights": ["Lincoln History", "Emancipation Proclamation", "Historic Cottage"]
      },
      {
        "name": "Belmont-Paul Women's Equality National Monument",
        "description": "Historic headquarters of the National Woman's Party",
        "location": "144 Constitution Ave NE",
        "highlights": ["Women's Suffrage", "Equal Rights", "Feminist History"]
      },
      {
        "name": "Washington Monument",
        "description": "Iconic obelisk honoring George Washington",
        "location": "2 15th St NW",
        "highlights": ["City Views", "Washington Memorial", "Historic Landmark"]
      },
      {
        "name": "Lincoln Memorial",
        "description": "Memorial to Abraham Lincoln with famous statue",
        "location": "2 Lincoln Memorial Cir NW",
        "highlights": ["Lincoln Statue", "Reflecting Pool", "Historic Speeches"]
      },
      {
        "name": "United States Capitol",
        "description": "Historic seat of the US Congress with tours available",
        "location": "East Capitol St NE & First St SE",
        "highlights": ["Capitol Dome", "Rotunda", "Statuary Hall"]
      },
      {
        "name": "White House",
        "description": "Official residence and workplace of the US President",
        "location": "1600 Pennsylvania Ave NW",
        "highlights": ["Presidential History", "State Rooms", "Rose Garden"]
      }
    ],
    "Paid": [
      {
        "name": "International Spy Museum",
        "description": "Espionage history and interactive spy experiences",
        "location": "700 L'Enfant Plaza SW",
        "cost": "$26.95 adults, $16.95 children",
        "highlights": ["Spy School", "Interactive Missions", "Historic Artifacts"]
      },
      {
        "name": "National Building Museum",
        "description": "Architecture, design, and building history",
        "location": "401 F St NW",
        "cost": "$10 adults, $7 children",
        "highlights": ["Great Hall", "Architecture Exhibits", "Family Programs"]
      },
      {
        "name": "National Geographic Museum",
        "description": "Exploration, science, and photography",
        "location": "1145 17th St NW",
        "cost": "$15 adults, $10 children",
        "highlights": ["Photography Exhibits", "Exploration History", "Interactive Displays"]
      },
      {
        "name": "The Phillips Collection",
        "description": "Modern art in a historic mansion setting",
        "location": "1600 21st St NW",
        "cost": "$16 adults, free for children",
        "highlights": ["Impressionist Art", "Modern Masters", "Intimate Setting"]
      },
      {
        "name": "Museum of the Bible",
        "description": "History and impact of the Bible",
        "location": "400 4th St SW",
        "cost": "$25 adults, $15 children",
        "highlights": ["Biblical Artifacts", "Interactive Exhibits", "Immersive Experiences"]
      },
      {
        "name": "Madame Tussauds",
        "description": "Wax museum with lifelike figures of celebrities and historical figures",
        "location": "1001 F St NW",
        "cost": "$30+ adults, varies by season",
        "highlights": ["Celebrity Wax Figures", "Presidential Gallery", "Interactive Exhibits"]
      },
      {
        "name": "Hillwood Estate, Museum & Gardens",
        "description": "Marjorie Merriweather Post's mansion with Russian and French decorative arts",
        "location": "4155 Linnean Ave NW",
        "cost": "$18 adults, $15 seniors/students",
        "highlights": ["Russian Imperial Art", "French Decorative Arts", "Gardens"]
      },
      {
        "name": "Dumbarton Oaks Research Library and Collection",
        "description": "Byzantine and Pre-Columbian art and beautiful gardens",
        "location": "1703 32nd St NW",
        "cost": "$10 for gardens, museum varies",
        "highlights": ["Byzantine Art", "Pre-Columbian Collection", "Historic Gardens"]
      },
      {
        "name": "Tudor Place",
        "description": "Historic Georgetown mansion and garden",
        "location": "1644 31st St NW",
        "cost": "$12 adults, $6 children",
        "highlights": ["Federal Architecture", "Historic Gardens", "Martha Washington Artifacts"]
      },
      {
        "name": "Kreeger Museum",
        "description": "Modern and contemporary art in a unique architectural setting",
        "location": "2401 Foxhall Rd NW",
        "cost": "$10 adults, $7 seniors/students",
        "highlights": ["Impressionist Art", "Contemporary Works", "Unique Architecture"]
      },
      {
        "name": "Woodrow Wilson House",
        "description": "Former home of the 28th President",
        "location": "2340 S St NW",
        "cost": "$10 adults, $8 seniors/students",
        "highlights": ["Presidential History", "Period Furnishings", "Historic Home"]
      },
      {
        "name": "Textile Museum",
        "description": "Global textile arts and traditions",
        "location": "2320 S St NW",
        "cost": "$8 adults, $6 seniors/students",
        "highlights": ["Global Textiles", "Historic Rugs", "Cultural Exhibitions"]
      },
      {
        "name": "The Octagon House",
        "description": "Historic Federal-style house and architecture museum",
        "location": "1799 New York Ave NW",
        "cost": "$10 adults, $5 students",
        "highlights": ["Federal Architecture", "Historic Rooms", "Design History"]
      },
      {
        "name": "Heurich House Museum",
        "description": "Victorian mansion of beer baron Christian Heurich",
        "location": "1307 New Hampshire Ave NW",
        "cost": "$5-15 depending on tour",
        "highlights": ["Victorian Architecture", "Brewing History", "Period Rooms"]
      },
      {
        "name": "Decatur House",
        "description": "Historic Federal-style house near the White House",
        "location": "1610 H St NW",
        "cost": "$10 adults, $5 children",
        "highlights": ["Federal Period", "White House History", "Historic Furnishings"]
      },
      {
        "name": "Dumbarton House",
        "description": "Federal period house museum in Georgetown",
        "location": "2715 Q St NW",
        "cost": "$5 adults, free for children",
        "highlights": ["Federal Architecture", "Georgetown History", "Period Rooms"]
      },
      {
        "name": "O Street Museum",
        "description": "Eclectic mansion with secret doors and unusual collections",
        "location": "2020 O St NW",
        "cost": "$25-40 depending on tour",
        "highlights": ["Secret Passages", "Unusual Collections", "Mansion Tour"]
      },
      {
        "name": "Larz Anderson House",
        "description": "Gilded Age mansion and Society of the Cincinnati museum",
        "location": "2118 Massachusetts Ave NW",
        "cost": "$10 adults, $5 students",
        "highlights": ["Gilded Age Architecture", "Revolutionary War History", "Elegant Interiors"]
      },
      {
        "name": "National Museum of American Jewish Military History",
        "description": "Jewish Americans' military service contributions",
        "location": "1811 R St NW",
        "cost": "Free admission, donations accepted",
        "highlights": ["Military History", "Jewish American Heritage", "Veterans Stories"]
      },
      {
        "name": "Lillian & Albert Small Jewish Museum",
        "description": "Historic synagogue and Jewish heritage in DC",
        "location": "701 3rd St NW",
        "cost": "$8 adults, $5 students",
        "highlights": ["Historic Synagogue", "Jewish Heritage", "Community History"]
      }
    ]
  },
  "Maryland": {
    "Free": [
      {
        "name": "Baltimore Museum of Art",
        "description": "Extensive art collection with the largest Matisse collection in the world",
        "location": "10 Art Museum Dr, Baltimore",
        "highlights": ["Matisse Collection", "Contemporary Art", "Sculpture Gardens"]
      },
      {
        "name": "Walters Art Museum",
        "description": "Comprehensive art collection from ancient to modern times",
        "location": "600 N Charles St, Baltimore",
        "highlights": ["Ancient Art", "Medieval Art", "Renaissance Art"]
      },
      {
        "name": "American Visionary Art Museum",
        "description": "Outsider art and visionary creations",
        "location": "800 Key Hwy, Baltimore",
        "cost": "$15.95 adults, $13.95 seniors",
        "highlights": ["Outsider Art", "Visionary Artists", "Unique Exhibits"]
      },
      {
        "name": "B&O Railroad Museum",
        "description": "Railroad history and historic locomotives",
        "location": "901 W Pratt St, Baltimore",
        "cost": "$20 adults, $12 children",
        "highlights": ["Historic Locomotives", "Roundhouse", "Train Rides"]
      },
      {
        "name": "National Aquarium",
        "description": "Marine life and conservation education",
        "location": "501 E Pratt St, Baltimore",
        "cost": "$39.95 adults, $29.95 children",
        "highlights": ["Dolphin Show", "Shark Alley", "Tropical Rainforest"]
      },
      {
        "name": "Maryland Science Center",
        "description": "Interactive science exhibits and planetarium",
        "location": "601 Light St, Baltimore",
        "cost": "$24.95 adults, $18.95 children",
        "highlights": ["Interactive Exhibits", "Planetarium", "IMAX Theater"]
      },
      {
        "name": "Chesapeake Bay Maritime Museum",
        "description": "Maritime history and boat building",
        "location": "213 N Talbot St, St. Michaels",
        "cost": "$17 adults, $6 children",
        "highlights": ["Boat Building", "Maritime History", "Bay Ecology"]
      },
      {
        "name": "Annapolis Maritime Museum",
        "description": "Annapolis maritime history and ecology",
        "location": "723 2nd St, Annapolis",
        "cost": "$5 adults, $3 children",
        "highlights": ["Local Maritime History", "Bay Ecology", "Historic Building"]
      }
    ]
  },
  "Virginia": {
    "Free": [
      {
        "name": "Virginia Museum of Fine Arts",
        "description": "Comprehensive art collection with Fabergé eggs",
        "location": "200 N Arthur Ashe Blvd, Richmond",
        "highlights": ["Fabergé Collection", "American Art", "African Art"]
      },
      {
        "name": "Science Museum of Virginia",
        "description": "Interactive science exhibits and dome theater",
        "location": "2500 W Broad St, Richmond",
        "cost": "$16 adults, $13.50 children",
        "highlights": ["Interactive Science", "Dome Theater", "Hands-on Exhibits"]
      },
      {
        "name": "Virginia Museum of History & Culture",
        "description": "Virginia history and culture",
        "location": "428 N Arthur Ashe Blvd, Richmond",
        "cost": "$10 adults, free for children",
        "highlights": ["Virginia History", "Civil War Exhibits", "Cultural Programs"]
      },
      {
        "name": "Chrysler Museum of Art",
        "description": "Art collection with glass studio",
        "location": "1 Memorial Place, Norfolk",
        "highlights": ["Glass Collection", "American Art", "Glass Studio"]
      },
      {
        "name": "Virginia Aquarium & Marine Science Center",
        "description": "Marine life and conservation",
        "location": "717 General Booth Blvd, Virginia Beach",
        "cost": "$32 adults, $24 children",
        "highlights": ["Marine Life", "Conservation Programs", "Boat Tours"]
      },
      {
        "name": "Mariners' Museum and Park",
        "description": "Maritime history and USS Monitor artifacts",
        "location": "100 Museum Dr, Newport News",
        "cost": "$1 adults, free for children",
        "highlights": ["USS Monitor", "Maritime History", "Park Trails"]
      },
      {
        "name": "Frontier Culture Museum",
        "description": "Living history museum of early American settlers",
        "location": "1290 Richmond Ave, Staunton",
        "cost": "$12 adults, $7 children",
        "highlights": ["Living History", "Historic Buildings", "Cultural Demonstrations"]
      },
      {
        "name": "Virginia Living Museum",
        "description": "Native Virginia wildlife and plants",
        "location": "524 J Clyde Morris Blvd, Newport News",
        "cost": "$20 adults, $15 children",
        "highlights": ["Native Wildlife", "Botanical Gardens", "Planetarium"]
      }
    ]
  }
};

// Get museum suggestions based on location and budget
function getMuseumSuggestions(location, budget) {
  const museums = museumData[location];
  if (!museums) return [];
  
  const suggestions = [];
  
  // Add free museums
  if (museums.Free) {
    for (const museum of museums.Free.slice(0, 3)) {
      suggestions.push({
        name: museum.name,
        description: `${museum.description}. Highlights include: ${museum.highlights.join(', ')}.`,
        estimated_cost: "Free",
        location_hint: museum.location
      });
    }
  }
  
  // Add paid museums based on budget
  if (museums.Paid && budget !== "Free") {
    for (const museum of museums.Paid.slice(0, 2)) {
      if (museum.cost !== "Closed") {
        suggestions.push({
          name: museum.name,
          description: `${museum.description}. Highlights include: ${museum.highlights.join(', ')}.`,
          estimated_cost: museum.cost,
          location_hint: museum.location
        });
      }
    }
  }
  
  return suggestions;
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
            "name": "Rock Creek Park Nature Trail",
            "description": "Explore the largest urban park in the country with 32 miles of trails. Perfect for bird watching, photography, or enjoying nature before the city wakes up.",
            "estimated_cost": "Free",
            "location_hint": "Rock Creek Park, various trailheads"
          },
          {
            "name": "Tidal Basin Cherry Blossom Walk",
            "description": "Take a contemplative morning walk around the Tidal Basin. The 2.1-mile loop offers stunning views of the Jefferson Memorial and Washington Monument.",
            "estimated_cost": "Free",
            "location_hint": "Tidal Basin, near Jefferson Memorial"
          },
          {
            "name": "Capitol Hill Architecture Tour",
            "description": "Explore the historic Capitol Hill neighborhood in the morning light. Admire beautiful row houses, visit Eastern Market, and learn about the area's rich history.",
            "estimated_cost": "Free",
            "location_hint": "Capitol Hill neighborhood, Eastern Market area"
          },
          {
            "name": "Smithsonian Museum Art Interpretation",
            "description": "Visit the National Gallery of Art and create your own interpretations of artworks. Write short stories, poems, or create sketches inspired by what you see.",
            "estimated_cost": "Free",
            "location_hint": "National Gallery of Art, 6th St and Constitution Ave NW"
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
            "name": "Potomac Riverfront Walk",
            "description": "Stroll along the Potomac and Anacostia rivers on the waterfront boardwalks. Enjoy views of the water, boats, and city skyline while watching for wildlife.",
            "estimated_cost": "Free",
            "location_hint": "The Wharf, Georgetown Waterfront, East Potomac Park"
          },
          {
            "name": "Georgetown Shopping & Architecture",
            "description": "Explore Georgetown's historic cobblestone streets, browse unique boutiques, and admire Federal-style architecture. Visit the historic C&O Canal.",
            "estimated_cost": "Free (browsing)",
            "location_hint": "Georgetown, M Street and Wisconsin Avenue"
          },
          {
            "name": "National Arboretum Exploration",
            "description": "Discover 446 acres of gardens, collections, and research facilities. See the famous Capitol Columns and seasonal displays.",
            "estimated_cost": "Free",
            "location_hint": "National Arboretum, 3501 New York Ave NE"
          },
          {
            "name": "Dupont Circle Fountain & Neighborhood",
            "description": "Visit the iconic Dupont Circle fountain and explore the vibrant neighborhood known for its galleries, bookstores, and historic architecture.",
            "estimated_cost": "Free",
            "location_hint": "Dupont Circle, Connecticut Avenue NW"
          },
          {
            "name": "Smithsonian Scavenger Hunt",
            "description": "Create a custom scavenger hunt across multiple Smithsonian museums. Find specific artifacts, artworks, or exhibits and document your discoveries.",
            "estimated_cost": "Free",
            "location_hint": "Various Smithsonian museums on the National Mall"
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
            "name": "Kennedy Center Millennium Stage",
            "description": "Enjoy free performances at the Kennedy Center's Millennium Stage. Every evening at 6 PM, they host free concerts, dance performances, and cultural events.",
            "estimated_cost": "Free",
            "location_hint": "John F. Kennedy Center for the Performing Arts"
          },
          {
            "name": "Monument Night Photography",
            "description": "Capture the monuments in a different light with evening photography. The Lincoln Memorial, Jefferson Memorial, and Washington Monument are especially beautiful when lit up.",
            "estimated_cost": "Free",
            "location_hint": "National Mall monuments"
          },
          {
            "name": "The Wharf Waterfront Evening",
            "description": "Experience DC's newest waterfront development with restaurants, music venues, and beautiful Potomac River views. Street performers and events happen regularly.",
            "estimated_cost": "Free (entertainment)",
            "location_hint": "The Wharf, Southwest Waterfront"
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
          },
          {
            "name": "Smithsonian Museum Marathon",
            "description": "Visit multiple Smithsonian museums in one day and create a 'Museum Marathon' blog. Document your journey through art, history, and science.",
            "estimated_cost": "Free",
            "location_hint": "Various Smithsonian museums on the National Mall"
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
            "name": "Historic Annapolis Walking Tour",
            "description": "Explore America's sailing capital with cobblestone streets, colonial architecture, and the US Naval Academy. Visit the Maryland State House and City Dock.",
            "estimated_cost": "Free",
            "location_hint": "Historic Annapolis, State Circle and Market Space"
          },
          {
            "name": "Baltimore Inner Harbor Promenade",
            "description": "Walk the famous Inner Harbor waterfront, see historic ships, and enjoy views of the Patapsco River. Visit the Maryland Science Center area.",
            "estimated_cost": "Free",
            "location_hint": "Baltimore Inner Harbor, Pratt Street"
          },
          {
            "name": "Sandy Point State Park Beach",
            "description": "Experience Maryland's beautiful Chesapeake Bay coastline with sandy beaches, fishing, and views of the Bay Bridge.",
            "estimated_cost": "Free",
            "location_hint": "Sandy Point State Park, near Annapolis"
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
          },
          {
            "name": "Baltimore Inner Harbor Photography",
            "description": "Create a photo story of Baltimore's Inner Harbor, capturing the contrast between historic ships and modern development.",
            "estimated_cost": "Free",
            "location_hint": "Baltimore Inner Harbor"
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
            "name": "Mount Vernon Estate & Gardens",
            "description": "Visit George Washington's historic plantation home and explore the mansion, gardens, and outbuildings. Learn about America's first president.",
            "estimated_cost": "Free (grounds), $25 for mansion tour",
            "location_hint": "Mount Vernon Estate, Mount Vernon, VA"
          },
          {
            "name": "Arlington National Cemetery",
            "description": "Pay respects at this solemn national cemetery. Watch the Changing of the Guard at the Tomb of the Unknown Soldier.",
            "estimated_cost": "Free",
            "location_hint": "Arlington National Cemetery"
          },
          {
            "name": "Virginia Beach Oceanfront",
            "description": "Experience Virginia's famous beach resort city with a 3-mile boardwalk, sandy beaches, and Atlantic Ocean views.",
            "estimated_cost": "Free",
            "location_hint": "Virginia Beach Boardwalk and Beach"
          },
          {
            "name": "Shenandoah National Park",
            "description": "Explore 200,000 acres of protected lands with waterfalls, wildlife, and scenic Skyline Drive. Perfect for hiking and nature photography.",
            "estimated_cost": "Free",
            "location_hint": "Shenandoah National Park, Northern Virginia"
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
            "name": "Old Town Alexandria Historic Walk",
            "description": "Stroll through cobblestone streets in this charming colonial seaport. Visit the Torpedo Factory Art Center and walk along the Potomac River waterfront.",
            "estimated_cost": "Free",
            "location_hint": "Old Town Alexandria, King Street and waterfront"
          },
          {
            "name": "Virginia Wine Country Tour",
            "description": "Explore Virginia's scenic wine regions in Loudoun County. Many wineries offer free tastings and beautiful mountain views.",
            "estimated_cost": "Free (some wineries), $10-25 for tastings",
            "location_hint": "Loudoun County wine country"
          },
          {
            "name": "Richmond's Monument Avenue",
            "description": "Walk or bike along historic Monument Avenue to see impressive statues and beautiful Victorian mansions in one of America's most beautiful boulevards.",
            "estimated_cost": "Free",
            "location_hint": "Monument Avenue, Richmond"
          },
          {
            "name": "Norfolk Botanical Garden",
            "description": "Explore 175 acres of themed gardens with over 60 different garden areas. Beautiful year-round with seasonal displays.",
            "estimated_cost": "Free",
            "location_hint": "Norfolk Botanical Garden, Norfolk"
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

// Export museum data for potential use in other parts of the app
export { museumData };
