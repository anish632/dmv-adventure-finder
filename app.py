from flask import Flask, request, jsonify
from flask_cors import CORS
import google.generativeai as genai
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

app = Flask(__name__)
CORS(app)

# Configure Google Gemini AI
api_key = os.getenv('GEMINI_API_KEY')
if not api_key:
    raise ValueError("GEMINI_API_KEY environment variable not set")

genai.configure(api_key=api_key)
model = genai.GenerativeModel('gemini-2.0-flash-exp')

@app.route('/api/suggestions', methods=['POST'])
def get_suggestions():
    try:
        data = request.get_json()
        location = data.get('location')
        time = data.get('time')
        budget = data.get('budget')
        
        if not all([location, time, budget]):
            return jsonify({'error': 'Missing required parameters'}), 400
        
        prompt = f"""
        I'm looking for creative and fun things to do. Please give me 4 unique suggestions based on these criteria:
        - Location: {location}
        - Time of Day: {time}
        - Budget: {budget}

        Focus on interesting, non-cliche ideas. For example, instead of "visit a museum," suggest "a late-night tour of a specific exhibit" or "a scavenger hunt in the National Portrait Gallery."

        Return the response as a JSON array with the following structure:
        [
            {{
                "name": "A short, catchy name for the activity",
                "description": "A creative and appealing one-paragraph description of the activity",
                "estimated_cost": "A brief description of the potential cost, like 'Free', '$10-$20 per person', etc.",
                "location_hint": "A hint about where this activity could take place, e.g., 'Georgetown waterfront' or 'Shenandoah National Park'"
            }}
        ]
        """
        
        response = model.generate_content(prompt)
        
        # Parse the response to extract JSON
        import json
        import re
        
        # Try to extract JSON from the response
        text = response.text
        json_match = re.search(r'\[.*\]', text, re.DOTALL)
        
        if json_match:
            suggestions = json.loads(json_match.group())
        else:
            # Fallback: try to parse the entire response as JSON
            suggestions = json.loads(text)
        
        return jsonify(suggestions)
        
    except Exception as e:
        print(f"Error: {str(e)}")
        return jsonify({'error': 'An error occurred while generating suggestions'}), 500

@app.route('/health', methods=['GET'])
def health_check():
    return jsonify({'status': 'healthy'})

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
