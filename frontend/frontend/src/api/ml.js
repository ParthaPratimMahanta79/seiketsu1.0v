export const predictUser = async () => {
  const res = await fetch("https://seiketsu1-0v-3.onrender.com/api/ml/predict", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });
  return res.json();
};

export const startNavigation = async (binName) => {
  const res = await fetch("https://seiketsu1-0v-3.onrender.com/api/navigation/start", {
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
  const res = await fetch(
    `https://seiketsu1-0v-3.onrender.com/api/navigation/${eventId}/complete`,
    {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    }
  );
  return res.json();
};