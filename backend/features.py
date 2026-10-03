"""
Shared feature engineering module, imported by BOTH the training pipeline
and the Flask API, so training-time and inference-time preprocessing can
never drift apart.
"""
import numpy as np
import pandas as pd

FEATURE_COLS_RAW = [
    "requests_made", "bins_navigated", "reports_sent", "reports_approved",
    "reports_rejected", "leaderboard_score",
    "successful_routes", "active_days", "recent_activity",
    "login_frequency", "navigation_frequency", "reporting_frequency",
]

def engineer_features(X: pd.DataFrame) -> pd.DataFrame:
    X = X.copy()

    X["approval_rate"] = X["reports_approved"] / X["reports_sent"].replace(0, np.nan)
    X["approval_rate"] = X["approval_rate"].fillna(0).clip(0, 1)

    X["rejection_rate"] = X["reports_rejected"] / X["reports_sent"].replace(0, np.nan)
    X["rejection_rate"] = X["rejection_rate"].fillna(0).clip(0, 1)

    X["route_success_rate"] = X["successful_routes"] / X["bins_navigated"].replace(0, np.nan)
    X["route_success_rate"] = X["route_success_rate"].fillna(0).clip(0, 1)

    X["activity_per_active_day"] = X["login_frequency"] / X["active_days"].replace(0, np.nan)
    X["activity_per_active_day"] = X["activity_per_active_day"].fillna(0)

    return X