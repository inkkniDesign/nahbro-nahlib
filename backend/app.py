from flask import Flask, request, jsonify
import openai
from flask_cors import CORS
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

app = Flask(__name__)

# Fix CORS to allow frontend access
CORS(app, resources={r"/*": {"origins": "*"}})  # ✅ Fix for Browser Access

# Load OpenAI API Key
openai_api_key = os.getenv("OPENAI_API_KEY")
if not openai_api_key:
    raise ValueError("⚠️ ERROR: OPENAI_API_KEY is missing! Add it to .env or Render.")

openai.api_key = openai_api_key

# Predefined categories for AI-generated scenarios
CATEGORIES = {
    "nightlife": "Describe a crazy night out involving at least two people.",
    "sports": "Make up an unexpected sports event that became legendary.",
    "coffee_shop": "Write a bizarre encounter at a coffee shop.",
    "work_drama": "Tell a ridiculous office story that nobody would believe.",
}

@app.route('/')
def home():
    return "Nah Bro AI-Lib Backend is running!"

@app.route('/generate', methods=['POST'])
def generate_story():
    """Handles AI scenario rewriting and Mad Libs generation."""
    try:
        data = request.json
        user_scenario = data.get("scenario", "").strip()
        category = data.get("category", "").lower()

        if user_scenario:
            prompt = f"Rewrite the following situation into a funny Mad Libs-style story with missing nouns, verbs, and adjectives:\n\n'{user_scenario}'\n\nReplace key words with placeholders like [Noun], [Verb], and [Adjective]. Keep it exaggerated and in a humorous tone."
        elif category in CATEGORIES:
            prompt = f"Write a funny Mad Libs-style story about {CATEGORIES[category]}. Include placeholders for [Noun], [Verb], and [Adjective]."
        else:
            return jsonify({"error": "Invalid request. Provide a scenario or select a category."}), 400

        response = openai.chat.completions.create(
            model="gpt-4",
            messages=[{"role": "user", "content": prompt}]
        )

        ai_story = response.choices[0].message.content

        # ✅ Limit story length to 2500 characters
        if len(ai_story) > 2500:
            ai_story = ai_story[:2500] + "..."  # Truncate and add ellipsis

        return jsonify({"story": ai_story})

    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route('/regenerate', methods=['POST'])
def regenerate_story():
    """Allows users to regenerate a new version of the AI story."""
    try:
        data = request.json
        category = data.get("category", "").lower()

        if category not in CATEGORIES:
            return jsonify({"error": "Invalid category for regeneration."}), 400

        prompt = f"Write a fresh, funnier version of a Mad Libs-style story about {CATEGORIES[category]}. Use placeholders for [Noun], [Verb], and [Adjective]."

        response = openai.chat.completions.create(
            model="gpt-4",
            messages=[{"role": "user", "content": prompt}]
        )

        new_story = response.choices[0].message.content  # ✅ Ensures correct response handling
        return jsonify({"story": new_story})

    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    port = int(os.environ.get("PORT", 5000))  # Default to 5000 for local dev
    app.run(host='0.0.0.0', port=port, debug=True)
