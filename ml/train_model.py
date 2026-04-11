import pandas as pd # type: ignore
from sklearn.linear_model import LogisticRegression # type: ignore
import pickle

data = {
    'requests_made': [2,0,3,1,4,1,5,0,2,3],
    'bins_navigated': [5,1,6,0,7,2,8,1,4,5],
    'reports_sent': [1,0,2,1,3,0,2,0,1,2],
    'reports_approved': [1,0,2,0,3,0,2,0,1,2],
    'leaderboard_score': [10,2,15,3,20,4,25,1,8,12],
    'engagement': [1,0,1,0,1,0,1,0,1,1]
}

df = pd.DataFrame(data)

X = df[['requests_made','bins_navigated','reports_sent','reports_approved','leaderboard_score']]
y = df['engagement']

model = LogisticRegression()
model.fit(X, y)

pickle.dump(model, open("model.pkl", "wb"))

print("✅ Model saved successfully!")