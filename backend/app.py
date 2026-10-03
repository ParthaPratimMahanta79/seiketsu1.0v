from flask import Flask, request, jsonify  # type: ignore
from flask_cors import CORS  # type: ignore
import os
import pickle
import pandas as pd
from features import engineer_features, FEATURE_COLS_RAW

app = Flask(__name__)
CORS(app)

# Load the pre-trained pipeline (trained offline via train_pipeline.py).
# No inline training at request time or at startup — this is the fix for
# the old approach, which retrained a LogisticRegression on 6 hard-coded
# rows every single time the process started.
MODEL_PATH = os.path.join(os.path.dirname(__file__), "model.pkl")
with open(MODEL_PATH, "rb") as f:
    bundle = pickle.load(f)

model = bundle["model"]
label_map = bundle["label_map"]          # {0: "At Risk", 1: "High Engagement"}


def safe_float(val, default=0.0):
    try:
        return float(val)
    except (ValueError, TypeError):
        return default


@app.route("/predict", methods=["POST"])
def predict():
    data = request.json or {}

    row = {col: safe_float(data.get(col, 0)) for col in FEATURE_COLS_RAW}
    X_raw = pd.DataFrame([row])
    X = engineer_features(X_raw)

    prediction = int(model.predict(X)[0])
    prob = float(model.predict_proba(X)[0][1])

    # Same response shape as the original API: {"engagement": 0/1, "confidence": float}
    # so nothing calling this endpoint needs to change on that side.
    return jsonify({
        "engagement": prediction,
        "confidence": round(prob, 4)
    })


@app.route("/health", methods=["GET"])
def health():
    return jsonify({"status": "ok"})


if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5001))
    app.run(host="0.0.0.0", port=port)