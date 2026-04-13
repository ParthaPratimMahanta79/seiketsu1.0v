from flask import Flask, request, jsonify # type: ignore
import pickle
from flask_cors import CORS # type: ignore
import os

app = Flask(__name__)
CORS(app)

# Load model
from sklearn.linear_model import LogisticRegression # type: ignore
import numpy as np # type: ignore

X = np.array([
    [2,5,1,1,10],
    [0,1,0,0,2],
    [3,6,2,2,15],
    [1,0,1,0,3],
    [4,7,3,3,20],
    [1,2,0,0,4]
])

y = np.array([1,0,1,0,1,0])

model = LogisticRegression()
model.fit(X, y)

def safe_int(val, default=0):
    try:
        return int(val)
    except (ValueError, TypeError):
        return default

@app.route("/predict", methods=["POST"])
def predict():
    data = request.json

    user = [[
        safe_int(data.get('requests_made', 0)),
        safe_int(data.get('bins_navigated', 0)),
        safe_int(data.get('reports_sent', 0)),
        safe_int(data.get('reports_approved', 0)),
        safe_int(data.get('leaderboard_score', 0))
    ]]

    prediction = model.predict(user)[0]
    prob = model.predict_proba(user)[0][1]

    return jsonify({
        "engagement": int(prediction),
        "confidence": float(prob)
    })

if __name__ == "__main__":
   port = int(os.environ.get("PORT", 5001))
   app.run(host="0.0.0.0", port=port)