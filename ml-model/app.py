import os
import requests
from flask import Flask, request, jsonify
import pandas as pd
import pickle

app = Flask(__name__)


def get_allowed_origins():
    configured = {
        origin.strip()
        for origin in os.getenv("ALLOWED_ORIGINS", "").split(",")
        if origin.strip()
    }
    defaults = {
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "https://visionedd-frontend.onrender.com",
    }
    return configured | defaults


@app.after_request
def add_cors_headers(response):
    origin = request.headers.get("Origin")

    if origin in get_allowed_origins():
        response.headers["Access-Control-Allow-Origin"] = origin
        response.headers["Vary"] = "Origin"

    response.headers["Access-Control-Allow-Headers"] = "Content-Type"
    response.headers["Access-Control-Allow-Methods"] = "POST, OPTIONS"
    return response

# Load model
model = pickle.load(open("model.pkl", "rb"))
encoder = pickle.load(open("encoder.pkl", "rb"))
FEATURES = ["analytical", "creativity", "social", "tech"]

@app.route("/predict", methods=["POST", "OPTIONS"])
def predict():
    if request.method == "OPTIONS":
        return "", 204

    data = request.get_json() or {}

    missing_features = [feature for feature in FEATURES if feature not in data]

    if missing_features:
        return jsonify({
            "error": f"Missing required scores: {', '.join(missing_features)}"
        }), 400

    for feature in FEATURES:
        value = data[feature]

        if not isinstance(value, (int, float)) or value < 1 or value > 5:
            return jsonify({
                "error": f"{feature} score must be a number between 1 and 5"
            }), 400

    features = pd.DataFrame(
        [
            {
                "analytical": data["analytical"],
                "creativity": data["creativity"],
                "social": data["social"],
                "tech": data["tech"],
            }
        ]
    )

    probs = model.predict_proba(features)[0]

    top_indices = probs.argsort()[-3:][::-1]

    SUPABASE_URL = "https://dmbcwefbuhdmparaaivr.supabase.co"
    SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRtYmN3ZWZidWhkbXBhcmFhaXZyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzcxMzIxNDAsImV4cCI6MjA5MjcwODE0MH0.JLGI5PwsKHM-ZUi6xor6IsFVXHuj1zHOFqZoZVpan68"

    results = []
    for i in top_indices:
        career_name = encoder.inverse_transform([i])[0]

        # Fetch career_id from Supabase
        response = requests.get(
            f"{SUPABASE_URL}/rest/v1/careers?name=eq.{career_name}",
            headers={
                "apikey": SUPABASE_KEY,
                "Authorization": f"Bearer {SUPABASE_KEY}"
            }
        )

        career_data = response.json()
        career_id = career_data[0]["id"] if career_data else None

        results.append({
            "career": career_name,
            "career_id": career_id,
            "match": round(probs[i] * 100, 2)
        })

    return jsonify(results)

if __name__ == "__main__":
    port = int(os.getenv("PORT", "5001"))
    app.run(host="0.0.0.0", port=port, debug=True)

