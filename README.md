# 🗑️ Seiketsu — Smart Dustbin Locator & Citizen Engagement Platform

> *Seiketsu (清潔) — Japanese for "cleanliness"*

Seiketsu is a full-stack web application that helps citizens locate nearby public dustbins, report overflowing bins, and earn recognition for contributing to a cleaner city. It uses machine learning to identify at-risk vs. high-engagement users based on their activity.

---

## 🚩 Problem Statement

Many cleanliness initiatives fail because they focus on changing habits. Seiketsu takes a different approach: if someone wants to dispose of waste properly but can't find a bin, or the nearest one is already overflowing, that's an infrastructure problem — not a behavior problem. This app solves that.

---

## ✨ Features

- 📍 **Interactive Map** — View nearby public dustbins powered by Leaflet.js + OpenStreetMap
- 🛰️ **Auto Location Detection** — GPS-based detection on app open
- 🚨 **Overflow Reporting** — Report full or damaged bins with one tap
- 📬 **Dustbin Requests** — Citizens can request new dustbin placements
- 🏆 **Leaderboard** — Gamified ranking system for top contributors
- 🤖 **ML Engagement Badge** — Logistic Regression model predicts user engagement (At Risk / High Engagement)
- 🛠️ **Admin Dashboard** — Review, approve, and reject dustbin requests
- 🔔 **Notifications** — Real-time updates on request status

---

## 🔄 User Flow

1. User registers and opens the dashboard
2. Location is detected automatically via GPS
3. Nearest dustbins are shown on the map
4. User can request a new dustbin, report overflow, or navigate to nearest bin
5. ML model predicts engagement level based on user activity
6. Admin reviews and approves/rejects requests
7. Leaderboard updates based on contributions

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React, Vite, Leaflet.js |
| Backend | Node.js, Express.js |
| Database | MongoDB Atlas |
| ML Service | Python, Flask, scikit-learn |
| Deployment | Vercel (frontend), Render (backend + ML) |

---

## 📁 Project Structure
```
Seiketsu/
├── backend/                          # Node.js Express API
│   ├── src/
│   │   ├── config/
│   │   │   └── db.js                 # MongoDB connection
│   │   ├── controllers/
│   │   │   ├── admin.controller.js
│   │   │   ├── auth.controller.js
│   │   │   ├── dustbin.controller.js
│   │   │   ├── dustbinRequest.controller.js
│   │   │   ├── notification.controller.js
│   │   │   ├── stats.controller.js
│   │   │   └── user.controller.js
│   │   ├── middleware/
│   │   │   ├── admin.middleware.js
│   │   │   ├── auth.middleware.js
│   │   │   ├── error.middleware.js
│   │   │   └── validate.middleware.js
│   │   ├── models/
│   │   │   ├── Dustbin.js
│   │   │   ├── DustbinRequest.js
│   │   │   ├── Notification.js
│   │   │   └── User.js
│   │   ├── routes/
│   │   │   ├── admin.routes.js
│   │   │   ├── auth.routes.js
│   │   │   ├── dustbin.routes.js
│   │   │   ├── dustbinRequest.routes.js
│   │   │   ├── ml.routes.js
│   │   │   ├── notification.routes.js
│   │   │   ├── stats.routes.js
│   │   │   └── user.routes.js
│   │   └── utils/
│   │       └── AppError.js
│   ├── app.js
│   ├── server.js
│   └── package.json
│
├── frontend/frontend/                # React + Vite
│   ├── src/
│   │   ├── api/
│   │   │   ├── axios.js
│   │   │   └── ml.js
│   │   ├── auth/
│   │   │   └── AuthContext.js
│   │   ├── pages/
│   │   │   ├── AdminDashboard.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Leaderboard.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── MapView.jsx
│   │   │   └── Register.jsx
│   │   ├── App.js
│   │   └── index.js
│   └── package.json
│
└── ml/                               # Python ML Service
├── app.py                        # Flask prediction API
├── train_model.py                # Model training script
├── model.pkl                     # Trained ML model
└── requirements.txt
...
---

## 🚀 Getting Started

### Prerequisites

- Node.js v18+
- Python 3.10+
- MongoDB Atlas account
- Render account (for deployment)
- Vercel account (for frontend deployment)

### Installation

```bash
# Clone the repository
git clone https://github.com/ParthaPratimMahanta79/seiketsu1.0v.git
cd seiketsu

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend/frontend
npm install

# Install ML dependencies
cd ../../ml
pip install -r requirements.txt
```

### Environment Variables

Create a `.env` file in the `backend/` folder:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
```

### Running Locally

```bash
# Start backend
cd backend
npm run dev

# Start frontend
cd frontend/frontend
npm run dev

# Start ML service
cd ml
python app.py
```

---

## 🌐 API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/register` | Register a new user |
| POST | `/api/auth/login` | Login and get token |
| GET | `/api/dustbins` | Get all dustbin locations |
| POST | `/api/dustbin-requests` | Submit a new dustbin request |
| GET | `/api/admin/requests` | Get all requests (admin) |
| PATCH | `/api/admin/requests/:id/approve` | Approve a request (admin) |
| PATCH | `/api/admin/requests/:id/reject` | Reject a request (admin) |
| GET | `/api/stats/my-stats` | Get user stats |
| GET | `/api/notifications` | Get user notifications |
| POST | `/api/ml/predict` | Get ML engagement prediction |

---

## 🤖 ML Model

The engagement prediction model uses **Logistic Regression** trained on:

| Feature | Description |
|---|---|
| `requests_made` | Number of dustbin requests submitted |
| `bins_navigated` | Number of times user navigated to a bin |
| `reports_sent` | Number of overflow reports submitted |
| `reports_approved` | Number of approved reports |
| `leaderboard_score` | User's leaderboard score |

**Output**: `engagement: 1` (High Engagement) or `engagement: 0` (At Risk) with a confidence score.

---

## 🗺️ Roadmap

- [x] Interactive map with dustbin markers
- [x] GPS-based location detection
- [x] Dustbin request submission
- [x] Admin dashboard with approve/reject
- [x] Leaderboard system
- [x] ML engagement prediction badge
- [x] User notifications
- [ ] Municipal authority email alerts
- [ ] Upvote system for reports
- [ ] PWA support for offline access
- [ ] Mobile app (React Native)

---

## 💡 Why Seiketsu

- Built solo as a full-stack + ML project
- Uses entirely free-tier services
- Suitable for portfolios, hackathons, and internship applications
- Real-world civic tech use case

---

## 📄 License

[MIT](LICENSE)

---

