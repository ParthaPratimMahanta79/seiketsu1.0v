const API_BASE = "https://seiketsu1-0v-3.onrender.com/api";

// Render's free tier sleeps after ~15 min idle. Ping the backend (which in
// turn wakes the Python ML service) as soon as the app loads, so everything
// is awake by the time someone clicks "Check Engagement". Fire-and-forget.
fetch(`${API_BASE}/ml/warmup`).catch(() => {});

export const predictUser = async () => {
  const res = await fetch(`${API_BASE}/ml/predict`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });
  return res.json();
};

export const startNavigation = async (binName) => {
  const res = await fetch(`${API_BASE}/navigation/start`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
    body: JSON.stringify({ binName }),
  });
  return res.json(); // { eventId }
};

export const completeNavigation = async (eventId) => {
  const res = await fetch(`${API_BASE}/navigation/${eventId}/complete`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });
  return res.json();
};