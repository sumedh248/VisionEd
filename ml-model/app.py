from flask import Flask, request, jsonify
import pandas as pd
import pickle

app = Flask(__name__)

ALLOWED_ORIGINS = {"http://localhost:5173", "http://127.0.0.1:5173"}


@app.after_request
def add_cors_headers(response):
    origin = request.headers.get("Origin")

    if origin in ALLOWED_ORIGINS:
        response.headers["Access-Control-Allow-Origin"] = origin

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

    results = []
    for i in top_indices:
        results.append({
            "career": encoder.inverse_transform([i])[0],
            "match": round(probs[i] * 100, 2)
        })

    return jsonify(results)

if __name__ == "__main__":
    app.run(debug=True)
