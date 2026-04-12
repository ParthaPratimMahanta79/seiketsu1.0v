export const predictUser = async (userData) => {
  const res = await fetch("https://seiketsu1-0v-3.onrender.com/api/ml/predict", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userData),
  });

  return res.json();
};