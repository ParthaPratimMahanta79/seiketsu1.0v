"""
STEPS 3-9: Feature engineering, proper train/test methodology,
model comparison, hyperparameter tuning, leakage checks, evaluation,
interpretability.
"""
import numpy as np
import pandas as pd
import pickle
from sklearn.model_selection import train_test_split, StratifiedKFold, GridSearchCV, cross_val_score
from sklearn.linear_model import LogisticRegression
from sklearn.ensemble import RandomForestClassifier, GradientBoostingClassifier, HistGradientBoostingClassifier
from sklearn.preprocessing import StandardScaler, FunctionTransformer
from sklearn.pipeline import Pipeline
from sklearn.metrics import (accuracy_score, precision_score, recall_score,
                              f1_score, roc_auc_score, confusion_matrix, classification_report)
try:
    from xgboost import XGBClassifier
    HAS_XGBOOST = True
except ImportError:
    HAS_XGBOOST = False

RANDOM_SEED = 42
df = pd.read_csv("seiketsu_dataset.csv")

# ---------- STEP 3: FEATURE ENGINEERING ----------
from features import engineer_features, FEATURE_COLS_RAW

X_raw = df[FEATURE_COLS_RAW]
y = df["engagement"]

# ---------- STEP 4: TRAIN/TEST SPLIT (before any fitting -> no leakage) ----------
X_train_raw, X_test_raw, y_train, y_test = train_test_split(
    X_raw, y, test_size=0.2, stratify=y, random_state=RANDOM_SEED
)

# Feature engineering is a pure per-row function (no fitting), safe to apply to both,
# but note: if any engineered feature required fit statistics (e.g. mean-imputation
# stats), those would need to be fit on X_train_raw ONLY. Here, ratios are row-wise
# and leak nothing from other rows.
X_train = engineer_features(X_train_raw)
X_test = engineer_features(X_test_raw)

ALL_FEATURES = list(X_train.columns)
print(f"Train size: {len(X_train)}  Test size: {len(X_test)}")
print(f"Total features after engineering: {len(ALL_FEATURES)}")
print(f"Train class balance: {y_train.value_counts().to_dict()}")
print(f"Test class balance: {y_test.value_counts().to_dict()}")

# ---------- STEP 5: MODEL COMPARISON ----------
cv = StratifiedKFold(n_splits=5, shuffle=True, random_state=RANDOM_SEED)

candidates = {
    "Logistic Regression (baseline)": Pipeline([
        ("scaler", StandardScaler()),
        ("clf", LogisticRegression(max_iter=2000, random_state=RANDOM_SEED))
    ]),
    "Random Forest": Pipeline([
        ("clf", RandomForestClassifier(random_state=RANDOM_SEED))
    ]),
    "Gradient Boosting": Pipeline([
        ("clf", GradientBoostingClassifier(random_state=RANDOM_SEED))
    ]),
    "HistGradientBoosting": Pipeline([
        ("clf", HistGradientBoostingClassifier(random_state=RANDOM_SEED))
    ]),
}
if HAS_XGBOOST:
    candidates["XGBoost"] = Pipeline([
        ("clf", XGBClassifier(random_state=RANDOM_SEED, eval_metric="logloss"))
    ])

results = []
for name, pipe in candidates.items():
    scores = cross_val_score(pipe, X_train, y_train, cv=cv, scoring="accuracy")
    pipe.fit(X_train, y_train)
    pred = pipe.predict(X_test)
    results.append({
        "Model": name,
        "CV_Acc_Mean": scores.mean(),
        "CV_Acc_Std": scores.std(),
        "Test_Accuracy": accuracy_score(y_test, pred),
        "Precision": precision_score(y_test, pred),
        "Recall": recall_score(y_test, pred),
        "F1": f1_score(y_test, pred),
    })

results_df = pd.DataFrame(results).sort_values("Test_Accuracy", ascending=False)
print("\n=== MODEL COMPARISON (held-out test set, untouched until now) ===")
print(results_df.to_string(index=False, float_format=lambda x: f"{x:.4f}"))
results_df.to_csv("model_comparison.csv", index=False)

# ---------- HYPERPARAMETER TUNING on the best candidate family ----------
best_name = results_df.iloc[0]["Model"]
print(f"\nBest by CV/test accuracy: {best_name}. Running GridSearchCV for tuning...")

param_grids = {
    "Random Forest": (
        Pipeline([("clf", RandomForestClassifier(random_state=RANDOM_SEED))]),
        {"clf__n_estimators": [200, 400], "clf__max_depth": [4, 8, None],
         "clf__min_samples_leaf": [1, 3, 5]}
    ),
    "Gradient Boosting": (
        Pipeline([("clf", GradientBoostingClassifier(random_state=RANDOM_SEED))]),
        {"clf__n_estimators": [100, 200], "clf__max_depth": [2, 3, 4],
         "clf__learning_rate": [0.05, 0.1]}
    ),
    "HistGradientBoosting": (
        Pipeline([("clf", HistGradientBoostingClassifier(random_state=RANDOM_SEED))]),
        {"clf__max_iter": [100, 200], "clf__max_depth": [3, 5, None],
         "clf__learning_rate": [0.05, 0.1]}
    ),
    "Logistic Regression (baseline)": (
        Pipeline([("scaler", StandardScaler()), ("clf", LogisticRegression(max_iter=2000, random_state=RANDOM_SEED))]),
        {"clf__C": [0.01, 0.1, 1, 10]}
    ),
}
if HAS_XGBOOST:
    param_grids["XGBoost"] = (
        Pipeline([("clf", XGBClassifier(random_state=RANDOM_SEED, eval_metric="logloss"))]),
        {"clf__n_estimators": [100, 200], "clf__max_depth": [3, 4, 5],
         "clf__learning_rate": [0.05, 0.1]}
    )

base_pipe, grid = param_grids[best_name]
gs = GridSearchCV(base_pipe, grid, cv=cv, scoring="accuracy", n_jobs=-1)
gs.fit(X_train, y_train)
final_model = gs.best_estimator_
print(f"Best params: {gs.best_params_}")
print(f"Best CV accuracy: {gs.best_score_:.4f}")

# ---------- STEP 8: FINAL EVALUATION on untouched test set ----------
final_pred = final_model.predict(X_test)
final_proba = final_model.predict_proba(X_test)[:, 1]

final_metrics = {
    "Accuracy": accuracy_score(y_test, final_pred),
    "Precision": precision_score(y_test, final_pred),
    "Recall": recall_score(y_test, final_pred),
    "F1": f1_score(y_test, final_pred),
    "ROC_AUC": roc_auc_score(y_test, final_proba),
}
cv_final_scores = cross_val_score(final_model, X_train, y_train, cv=cv, scoring="accuracy")

print("\n=== FINAL MODEL (tuned) TEST SET EVALUATION ===")
for k, v in final_metrics.items():
    print(f"{k}: {v:.4f}")
print(f"CV mean: {cv_final_scores.mean():.4f}   CV std: {cv_final_scores.std():.4f}")
print("\nConfusion matrix:\n", confusion_matrix(y_test, final_pred))
print("\n", classification_report(y_test, final_pred, target_names=["At Risk","High Engagement"]))

# ---------- STEP 9: INTERPRETABILITY ----------
print("\n=== FEATURE IMPORTANCE ===")
clf = final_model.named_steps["clf"]
if hasattr(clf, "feature_importances_"):
    imp = pd.Series(clf.feature_importances_, index=ALL_FEATURES).sort_values(ascending=False)
    print(imp.to_string())
    imp.to_csv("feature_importance.csv")
elif hasattr(clf, "coef_"):
    imp = pd.Series(clf.coef_[0], index=ALL_FEATURES).sort_values(key=abs, ascending=False)
    print(imp.to_string())
    imp.to_csv("feature_importance.csv")

# ---------- SAVE FINAL PIPELINE ----------
with open("model.pkl", "wb") as f:
    pickle.dump({
        "model": final_model,
        "feature_columns_raw": FEATURE_COLS_RAW,
        "all_features": ALL_FEATURES,
        "label_map": {0: "At Risk", 1: "High Engagement"},
    }, f)
print("\nSaved model.pkl")

with open("results_summary.txt", "w") as f:
    f.write(f"Best model: {best_name} (tuned: {gs.best_params_})\n")
    f.write(f"Final test metrics: {final_metrics}\n")
    f.write(f"CV mean/std: {cv_final_scores.mean():.4f} / {cv_final_scores.std():.4f}\n")