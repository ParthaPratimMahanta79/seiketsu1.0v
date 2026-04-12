import { useState, useEffect } from "react";
import { predictUser } from "../api/ml";
import MapView from "./MapView";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import "./Dashboard.css";

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [showForm, setShowForm] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [description, setDescription] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [mlResult, setMlResult] = useState(null);

  const [stats, setStats] = useState({
    approved: "—",
    pending: "—",
    overflowReports: "—",
    rank: "—",
  });

  // Fetch dashboard stats
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch("https://seiketsu1-0v-3.onrender.com/api/stats/my-stats", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        const data = await res.json();
        if (res.ok) {
          setStats(data);
        }
      } catch (err) {
        console.error("Failed to fetch stats", err);
      }
    };
    fetchStats();
  }, [submitted]);

  // Scroll reveal animation
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("section-visible");
          }
        });
      },
      { threshold: 0.15 }
    );
    document.querySelectorAll(".section-animate").forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const handlePredict = async () => {
    try {
      const data = await predictUser({
        requests_made: stats.approved || 1,
        bins_navigated: 2,
        reports_sent: stats.overflowReports || 0,
        reports_approved: stats.approved || 0,
        leaderboard_score: stats.rank || 1,
      });
      console.log("ML Result:", data);
      setMlResult(data);
    } catch (err) {
      console.error("ML prediction failed", err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedLocation) {
      alert("Please click on map to select location first.");
      return;
    }

    try {
      const response = await fetch(
        "https://seiketsu1-0v-3.onrender.com/api/dustbins",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({
            latitude: selectedLocation[0],
            longitude: selectedLocation[1],
            message: description,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(data.error || "Something went wrong");
        return;
      }

      setSubmitted(true);
      setShowForm(false);
      setDescription("");
      setSelectedLocation(null);
    } catch (err) {
      alert("Request failed");
    }
  };

  return (
    <div className="dashboard-container">

      {/* HEADER */}
      <div className="dashboard-header">
        <div className="header-top">
          <div className="header-text">
            <h1>👋 Welcome, {user?.name}</h1>
            <p>Helping keep our city clean & smart 🌱</p>
          </div>
          <nav className="header-nav">
            <a href="#about" className="nav-anchor-btn">📖 About</a>
            <a href="#contact" className="nav-anchor-btn">📬 Contact</a>
          </nav>
        </div>
      </div>

      {/* STATS CARDS */}
      <div className="stats-grid">
        <div className="stat-card green">
          <h2>{stats.approved}</h2>
          <p>Approved Requests</p>
        </div>
        <div className="stat-card yellow">
          <h2>{stats.pending}</h2>
          <p>Pending Requests</p>
        </div>
        <div className="stat-card red">
          <h2>{stats.overflowReports}</h2>
          <p>Overflow Reports</p>
        </div>
        <div className="stat-card blue">
          <h2>{stats.rank}</h2>
          <p>Your Rank</p>
        </div>
      </div>

      {/* ACTION BUTTONS */}
      <div className="action-row">
        <button className="primary-btn" onClick={() => setShowForm(true)}>
          🗑 Request New Dustbin
        </button>
        <button className="secondary-btn" onClick={() => navigate("/leaderboard")}>
          🏆 Top Contributors
        </button>
        <button className="secondary-btn" onClick={handlePredict}>
          🤖 Check Engagement
        </button>
      </div>

      {submitted && (
        <p className="success-msg">✅ Dustbin request submitted successfully!</p>
      )}

      {/* ML RESULT */}
      {mlResult && (
        <div style={{ marginTop: "20px", textAlign: "center" }}>
          <h3>
            {mlResult.engagement === 1
              ? "🔥 High Engagement User"
              : "⚠️ At Risk User"}
          </h3>
          <p>Confidence: {mlResult.confidence}</p>
        </div>
      )}

      {/* MAP */}
      <div className="map-wrapper">
        <MapView
          selectedLocation={selectedLocation}
          setSelectedLocation={setSelectedLocation}
        />
      </div>

      {/* DIVIDER */}
      <div className="section-divider"></div>

      {/* ABOUT SECTION */}
      <section id="about" className="about-section section-animate">
        <div className="section-label">About This Project</div>
        <h2>Seiketsu — Standardize</h2>
        <p>
          This project focuses on Seiketsu, the fourth step of the 5S methodology,
          which emphasizes standardization to maintain workplace organization and
          cleanliness. After implementing sorting, arranging, and cleaning, Seiketsu
          ensures these improvements are sustained through clear rules, visual controls,
          and standard procedures. The goal of this project is to create a consistent
          and disciplined work environment that improves efficiency, safety, and
          productivity over time.
        </p>
        <div className="about-steps">
          <span className="step-badge done">Sort</span>
          <span className="step-badge done">Set in Order</span>
          <span className="step-badge done">Shine</span>
          <span className="step-badge active">Seiketsu</span>
          <span className="step-badge done">Sustain</span>
        </div>
      </section>

      {/* CONTACT SECTION */}
      <section id="contact" className="contact-section section-animate">
        <div className="section-label">Contact & Report</div>
        <h2>Get in Touch</h2>
        <p className="contact-intro">Reach out to us or report garbage issues through the right channels.</p>

        <div className="contact-group-title">📬 Project Contact</div>
        <div className="contact-cards">
          <a href="mailto:parthapratimmahanta3@gmail.com" className="contact-card">
            <div className="contact-icon">✉️</div>
            <div className="contact-card-body">
              <span className="contact-card-label">Email</span>
              <span className="contact-card-value">parthapratimmahanta3@gmail.com</span>
            </div>
          </a>
          <a href="tel:8822891436" className="contact-card">
            <div className="contact-icon">📞</div>
            <div className="contact-card-body">
              <span className="contact-card-label">Phone</span>
              <span className="contact-card-value">+91 88228 91436</span>
            </div>
          </a>
        </div>

        <div className="contact-group-title">🏛️ GMC Helpline</div>
        <div className="contact-cards">
          <a href="tel:08811007000" className="contact-card contact-card-highlight">
            <div className="contact-icon">🚨</div>
            <div className="contact-card-body">
              <span className="contact-card-label">GMC Helpline</span>
              <span className="contact-card-value">088110 07000</span>
            </div>
          </a>
          <a href="https://wa.me/917086053941" target="_blank" rel="noreferrer" className="contact-card contact-card-whatsapp">
            <div className="contact-icon">💬</div>
            <div className="contact-card-body">
              <span className="contact-card-label">WhatsApp (Garbage Issues)</span>
              <span className="contact-card-value">70860 53941</span>
            </div>
          </a>
          <a href="https://wa.me/917086028339" target="_blank" rel="noreferrer" className="contact-card contact-card-whatsapp">
            <div className="contact-icon">💬</div>
            <div className="contact-card-body">
              <span className="contact-card-label">WhatsApp (Garbage Issues)</span>
              <span className="contact-card-value">70860 28339</span>
            </div>
          </a>
        </div>

        <div className="contact-info-banner">
          <span className="contact-info-icon">ℹ️</span>
          <p>For other areas, contact your <strong>local municipal board</strong> or file a complaint via the <strong>Swachhata App</strong>.</p>
        </div>
      </section>

      {/* MODAL FORM */}
      {showForm && (
        <div className="modal-overlay">
          <form onSubmit={handleSubmit} className="modal-form">
            <h3>Request Dustbin</h3>
            {selectedLocation && (
              <p>
                📍 {selectedLocation[0].toFixed(5)},{" "}
                {selectedLocation[1].toFixed(5)}
              </p>
            )}
            <textarea
              placeholder="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
            <button type="submit" className="submit-btn">Submit</button>
            <button
              type="button"
              className="cancel-btn"
              onClick={() => setShowForm(false)}
            >
              Cancel
            </button>
          </form>
        </div>
      )}
    </div>
  );
}