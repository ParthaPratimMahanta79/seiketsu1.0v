import numpy as np
import pandas as pd

rng = np.random.default_rng(42)
N = 1200

active_days          = rng.integers(1, 91, size=N)
login_frequency      = np.clip(rng.poisson(lam=active_days * 0.15), 0, None)
requests_made        = np.clip(rng.poisson(lam=login_frequency * 0.4 + 0.5), 0, None)
navigation_frequency = np.clip(rng.poisson(lam=login_frequency * 0.6), 0, None)
bins_navigated       = np.clip(navigation_frequency + rng.poisson(lam=2, size=N), 0, None)
reporting_frequency  = np.clip(rng.poisson(lam=login_frequency * 0.25), 0, None)
reports_sent         = np.clip(reporting_frequency + rng.poisson(lam=0.5, size=N), 0, None)

quality_factor = np.clip(rng.normal(0.6, 0.2, size=N), 0.05, 0.98)
reports_approved = np.array([
    rng.binomial(n, p) if n > 0 else 0
    for n, p in zip(reports_sent, quality_factor)
])
reports_rejected = reports_sent - reports_approved

successful_routes = np.clip(bins_navigated - rng.poisson(lam=1.0, size=N), 0, None)

leaderboard_score = (
    reports_approved * 15 + bins_navigated * 3 + requests_made * 2
    + rng.normal(0, 8, size=N)
)
leaderboard_score = np.clip(leaderboard_score, 0, None)

churn_latent = rng.normal(0, 1, size=N)
recent_activity = np.clip(
    (login_frequency * 0.3) - (churn_latent > 1.2) * rng.uniform(1, 4, size=N),
    0, None
)

df = pd.DataFrame({
    "requests_made": requests_made,
    "bins_navigated": bins_navigated,
    "reports_sent": reports_sent,
    "reports_approved": reports_approved,
    "reports_rejected": reports_rejected,
    "leaderboard_score": leaderboard_score.round(1),
    "successful_routes": successful_routes,
    "active_days": active_days,
    "recent_activity": recent_activity.round(1),
    "login_frequency": login_frequency,
    "navigation_frequency": navigation_frequency,
    "reporting_frequency": reporting_frequency,
})

z = (
    0.35 * (df["reports_approved"] / (df["reports_sent"].replace(0, np.nan))).fillna(0)
    + 0.25 * np.tanh(df["recent_activity"] / 10)
    + 0.20 * np.tanh(df["leaderboard_score"] / 150)
    + 0.15 * np.tanh(df["bins_navigated"] / 30)
    + 0.10 * np.tanh(df["requests_made"] / 15)
    - 0.20 * (df["reports_rejected"] / (df["reports_sent"].replace(0, np.nan))).fillna(0)
)
noise = rng.normal(0, 0.18, size=N)
z_noisy = z + noise
threshold = np.median(z_noisy)
df["engagement"] = (z_noisy > threshold).astype(int)

df.to_csv("seiketsu_dataset.csv", index=False)
print(f"Generated {len(df)} samples")
print(df["engagement"].value_counts())
print(df.describe().T[["mean", "std", "min", "max"]])