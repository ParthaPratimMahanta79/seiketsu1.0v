export const predictUser = async (userData) => {
  const res = await fetch("https://seiketsu-backend.onrender.com/api/predict", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userData),
  });

  return res.json();
};