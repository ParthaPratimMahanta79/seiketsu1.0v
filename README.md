# 🗑️ Seiketsu — Smart Dustbin Locator & Overflow Report System

> *Seiketsu (清潔) — Japanese for "cleanliness"*

Seiketsu is a full-stack web application that helps people locate nearby public dustbins and report overflowing or damaged ones. It doesn't try to change human behavior — it simply removes the friction for people who already want to act responsibly.

---

## 🚩 Problem Statement

Many cleanliness initiatives fail because they focus on changing habits. Seiketsu takes a different approach: if someone wants to dispose of waste properly but can't find a bin, or the nearest one is already overflowing, that's an infrastructure problem — not a behavior problem. This app solves that.

---

## ✨ Features (MVP)

- 📍 **Interactive Map** — View nearby public dustbins at a glance
- 🛰️ **Auto Location Detection** — GPS-based detection on app open
- 🚨 **Overflow Reporting** — Report full or damaged bins with one tap
- 📸 **Photo Upload** — Attach a photo with automatic timestamp
- 🛠️ **Admin Dashboard** *(optional)* — View and manage submitted reports

---

## 🔄 User Flow

1. User opens the web app
2. Location is detected automatically via GPS
3. Nearest dustbins are shown on the map
4. User disposes of waste or taps "Report" on a full/damaged bin
5. Report is stored for municipal action or data analysis

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | HTML, CSS, JavaScript / React |
| Backend | Node.js + Express |
| Database | MongoDB / Firebase |
| Maps | Google Maps API / OpenStreetMap (Leaflet.js) |
| Image Storage | Cloudinary / Firebase Storage |

---

## 📁 Project Structure

```
Seiketsu/
├── backend/
│   └── src/
│       ├── config/
│       │   └── db.js
│       ├── controllers/
│       │   ├── auth.controller.js
│       │   ├── dustbin.controller.js
│       │   ├── dustbinRequest.controller.js
│       │   ├── notification.controller.js
│       │   ├── stats.controller.js
│       │   └── user.controller.js
│       ├── middleware/
│       │   ├── admin.middleware.js
│       │   ├── auth.middleware.js
│       │   ├── error.middleware.js
│       │   └── validate.middleware.js
│       ├── models/
│       │   ├── Dustbin.js
│       │   ├── DustbinRequest.js
│       │   ├── Notification.js
│       │   └── User.js
│       ├── routes/
│       │   ├── admin.routes.js
│       │   ├── auth.routes.js
│       │   ├── dustbin.routes.js
│       │   ├── dustbinRequest.routes.js
│       │   ├── notification.routes.js
│       │   ├── stats.routes.js
│       │   └── user.routes.js
│       └── utils/
│           └── validators/
│               └── auth.validator.js
│   ├── app.js
│   ├── server.js
│   ├── .env
│   └── package.json
├── frontend/
│   ├── public/
│   └── src/
│       ├── api/
│       │   └── axios.js
│       ├── auth/
│       │   └── AuthContext.js
│       ├── pages/
│       │   ├── AdminDashboard.jsx / .css
│       │   ├── Dashboard.jsx / .css
│       │   ├── Leaderboard.jsx / .css
│       │   ├── Login.jsx / .css
│       │   ├── MapView.jsx
│       │   └── Register.jsx
│       ├── App.js / App.css
│       └── index.js / index.css
│   └── package.json
├── Documents/
│   └── Smart_Dustbin_Locator_Project.pdf
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js v18+
- MongoDB Atlas account (or local MongoDB) / Firebase project
- Google Maps API key or OpenStreetMap (free)
- Cloudinary account (free tier available) / Firebase Storage

### Installation

```bash
# Clone the repository
git clone https://github.com/your-username/seiketsu.git
cd seiketsu

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Fill in your API keys and DB URI in .env

# Start the development server
npm run dev
```

### Environment Variables

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
GOOGLE_MAPS_API_KEY=your_google_maps_key
CLOUDINARY_URL=your_cloudinary_url
```

---

## 🌐 API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/register` | Register a new user |
| POST | `/api/auth/login` | Login and get token |
| GET | `/api/users` | Get user info |
| GET | `/api/dustbins` | Get all dustbin locations |
| POST | `/api/dustbins` | Add a new dustbin (admin) |
| GET | `/api/dustbin-requests` | Get all overflow/damage reports |
| POST | `/api/dustbin-requests` | Submit a new report |
| GET | `/api/admin` | Admin overview |
| GET | `/api/stats` | Usage and report statistics |
| GET | `/api/notifications` | Get user notifications |

---

## 🗺️ Roadmap

- [x] Core map view with dustbin markers
- [x] GPS-based location detection
- [x] Report submission with photo upload
- [ ] Admin dashboard with report management
- [ ] Municipal authority email alerts
- [ ] Upvote system for reports (crowd-verified)
- [ ] PWA support for offline access

---

## 💡 Why Seiketsu is Realistic

- Can be built solo by a single student
- Requires no funding or external volunteers
- Completable within **1–2 weeks**
- Suitable for portfolios, hackathons, and internship applications
- Uses free-tier services throughout the stack

---

## 🤝 Contributing

Pull requests are welcome! For major changes, please open an issue first to discuss what you'd like to change.

---

## 📄 License

[MIT](LICENSE)

---

<p align="center">Built with 💚 for cleaner communities</p>
