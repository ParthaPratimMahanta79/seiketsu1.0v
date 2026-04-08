from flask import Flask, request, jsonify # type: ignore
import pickle
from flask_cors import CORS # type: ignore

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

@app.route("/predict", methods=["POST"])
def predict():
    data = request.json

    user = [[
        data['requests_made'],
        data['bins_navigated'],
        data['reports_sent'],
        data['reports_approved'],
        data['leaderboard_score']
    ]]

    prediction = model.predict(user)[0]
    prob = model.predict_proba(user)[0][1]

    return jsonify({
        "engagement": int(prediction),
        "confidence": float(prob)
    })

if __name__ == "__main__":
    app.run(port=5001, debug=True)