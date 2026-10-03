"""
TEMPLATE for extracting real training data from the existing Seiketsu
MongoDB database once available. Replace generate_dataset.py's synthetic
output with the CSV this produces (same column names) and the rest of
the pipeline (features.py, train_pipeline.py, app.py) needs NO changes.

Adjust collection/field names to match your actual schema.
"""
import pandas as pd
from pymongo import MongoClient  # pip install pymongo

def extract_dataset(mongo_uri: str, db_name: str) -> pd.DataFrame:
    client = MongoClient(mongo_uri)
    db = client[db_name]

    # Example aggregation per user — adjust field/collection names to your schema
    users = list(db.users.find({}, {
        "_id": 1, "createdAt": 1, "lastActiveAt": 1
    }))

    rows = []
    for u in users:
        uid = u["_id"]
        requests_made = db.dustbin_requests.count_documents({"userId": uid})
        bins_navigated = db.navigation_events.count_documents({"userId": uid})
        reports = list(db.reports.find({"userId": uid}))
        reports_sent = len(reports)
        reports_approved = sum(1 for r in reports if r.get("status") == "approved")
        reports_rejected = sum(1 for r in reports if r.get("status") == "rejected")
        verified_disposals = sum(1 for r in reports if r.get("verified") is True)
        leaderboard = db.leaderboard.find_one({"userId": uid}) or {}
        leaderboard_score = leaderboard.get("score", 0)
        successful_routes = db.navigation_events.count_documents(
            {"userId": uid, "completed": True}
        )
        active_days = (u.get("lastActiveAt") - u.get("createdAt")).days if u.get("lastActiveAt") else 0
        login_frequency = db.login_events.count_documents({"userId": uid})
        navigation_frequency = bins_navigated
        reporting_frequency = reports_sent
        # recent_activity: e.g. actions in the last 7 days — needs a time-windowed query
        recent_activity = db.activity_events.count_documents({
            "userId": uid,
            "timestamp": {"$gte": pd.Timestamp.utcnow() - pd.Timedelta(days=7)}
        })

        # LABEL: you must define ground truth engagement independently of the
        # features above (e.g. "still active after 30 days" or a product-defined
        # rule) — never derive the label FROM the same features you're predicting
        # with, or you leak the target into the input.
        label = None  # <- fill in from your own engagement definition

        rows.append({
            "requests_made": requests_made, "bins_navigated": bins_navigated,
            "reports_sent": reports_sent, "reports_approved": reports_approved,
            "reports_rejected": reports_rejected, "leaderboard_score": leaderboard_score,
            "verified_disposals": verified_disposals, "successful_routes": successful_routes,
            "active_days": active_days, "recent_activity": recent_activity,
            "login_frequency": login_frequency, "navigation_frequency": navigation_frequency,
            "reporting_frequency": reporting_frequency, "engagement": label,
        })

    return pd.DataFrame(rows)

if __name__ == "__main__":
    df = extract_dataset("mongodb://localhost:27017", "seiketsu")
    df.to_csv("seiketsu_dataset.csv", index=False)