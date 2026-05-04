import os
import pickle

import pandas as pd
import requests
from flask import Flask, jsonify, request

app = Flask(__name__)

SUPABASE_URL = "https://dmbcwefbuhdmparaaivr.supabase.co"
SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmN3ZWZidWhkbXBhcmFhaXZyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzcxMzIxNDAsImV4cCI6MjA5MjcwODE0MH0.JLGI5PwsKHM-ZUi6xor6IsFVXHuj1zHOFqZoZVpan68"
FEATURES = [
    "programming",
    "algorithms",
    "os_networks",
    "dbms",
    "oop",
    "computer_architecture",
    "software_engineering",
    "cyber_security",
    "machine_learning",
    "cloud_computing",
    "compiler_design",
    "computer_graphics",
]


def get_allowed_origins():
    configured = {
        origin.strip()
        for origin in os.getenv("ALLOWED_ORIGINS", "").split(",")
        if origin.strip()
    }
    defaults = {
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "https://visioned-frontend.onrender.com"
    }
    return configured | defaults


def load_career_id_map():
    try:
        response = requests.get(
            f"{SUPABASE_URL}/rest/v1/careers?select=id,name",
            headers={
                "apikey": SUPABASE_KEY,
                "Authorization": f"Bearer {SUPABASE_KEY}",
            },
            timeout=5,
        )
        response.raise_for_status()
        careers = response.json() or []
        return {
            str(career.get("name", "")).strip(): career.get("id")
            for career in careers
            if career.get("name")
        }
    except requests.RequestException as error:
        print(f"Failed to preload career map: {error}")
        return {}


@app.after_request
def add_cors_headers(response):
    origin = request.headers.get("Origin")

    if origin in get_allowed_origins():
        response.headers["Access-Control-Allow-Origin"] = origin
        response.headers["Vary"] = "Origin"

    response.headers["Access-Control-Allow-Headers"] = "Content-Type"
    response.headers["Access-Control-Allow-Methods"] = "GET, POST, OPTIONS"
    return response


model = pickle.load(open("model.pkl", "rb"))
encoder = pickle.load(open("encoder.pkl", "rb"))
CAREER_ID_BY_NAME = load_career_id_map()


@app.get("/health")
def health():
    return jsonify({
        "status": "ok",
        "careerCount": len(CAREER_ID_BY_NAME),
    })


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

    features = pd.DataFrame([
        {feature: data[feature] for feature in FEATURES}
    ])

    probs = model.predict_proba(features)[0]
    top_indices = probs.argsort()[-3:][::-1]

    results = []
    for index in top_indices:
        career_name = encoder.inverse_transform([index])[0]
        results.append({
            "career": career_name,
            "career_id": CAREER_ID_BY_NAME.get(career_name),
            "match": round(probs[index] * 100, 2),
        })

    return jsonify(results)


if __name__ == "__main__":
    port = int(os.getenv("PORT", "5001"))
    app.run(host="0.0.0.0", port=port, debug=False)
