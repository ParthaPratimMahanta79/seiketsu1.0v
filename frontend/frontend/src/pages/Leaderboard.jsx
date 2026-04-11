import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../api/axios";
import "./Leaderboard.css";

const MEDALS = ["🥇", "🥈", "🥉"];

function getInitials(name) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export default function Leaderboard() {
  const [leaders, setLeaders] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchLeaders = async () => {
      try {
        const res = await axios.get("/stats/top-contributors");
        setLeaders(res.data);
      } catch (err) {
        console.log(err);
      }
    };

    fetchLeaders();
  }, []);

  // Reorder podium: 2nd, 1st, 3rd for visual height effect
  const podiumOrder = [leaders[1], leaders[0], leaders[2]].filter(Boolean);
  const podiumRankMap = [1, 0, 2]; // maps podiumOrder index → actual rank index

  return (
    <div className="leaderboard-container">

      {/* BACK BUTTON */}
      <button className="leaderboard-back" onClick={() => navigate("/dashboard")}>
        ← Back to Dashboard
      </button>

      {/* HEADER */}
      <div className="leaderboard-header">
        <h1>🏆 Top Contributors</h1>
        <p>Citizens making the biggest impact on our city</p>
      </div>

      {/* PODIUM — TOP 3 */}
      {leaders.length > 0 && (
        <div className="podium">
          {podiumOrder.map((user, i) => {
            const rankIndex = podiumRankMap[i];
            return (
              <div key={user.userId} className={`podium-slot rank-${rankIndex}`}>
                <div className="podium-avatar">
                  {getInitials(user.name)}
                  <span className="podium-medal">{MEDALS[rankIndex]}</span>
                </div>
                <div className="podium-card">
                  <div className="podium-name">{user.name}</div>
                  <div className="podium-score">{user.score}</div>
                  <div className="podium-score-label">Points</div>
                  <div className="podium-stats">
                    <div className="podium-stat">
                      <span className="podium-stat-val">{user.approvedRequests}</span>
                      <span className="podium-stat-label">Approved</span>
                    </div>
                  </div>
                </div>
                <div className="podium-base">
                  #{rankIndex + 1}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* FULL TABLE */}
      <div className="leaderboard-table-wrapper">
        <div className="leaderboard-table-title">All Contributors</div>

        {leaders.length === 0 ? (
          <div className="leaderboard-empty">
            <span>🌱</span>
            No contributors yet. Be the first!
          </div>
        ) : (
          <table className="leaderboard-table">
            <thead>
              <tr>
                <th>Rank</th>
                <th>Name</th>
                <th>Approved</th>
                <th>Reports</th>
                <th>Score</th>
              </tr>
            </thead>
            <tbody>
              {leaders.map((user, index) => (
                <tr
                  key={user.userId}
                  className={
                    index === 0 ? "top-1" :
                    index === 1 ? "top-2" :
                    index === 2 ? "top-3" : ""
                  }
                >
                  <td>
                    <div className="rank-cell">
                      {index < 3 && (
                        <span className="rank-medal">{MEDALS[index]}</span>
                      )}
                      <span>{index + 1}</span>
                    </div>
                  </td>
                  <td>
                    <div className="name-cell">
                      <div className="name-avatar">{getInitials(user.name)}</div>
                      <span className="name-text">{user.name}</span>
                    </div>
                  </td>
                  <td className="num-cell">{user.approvedRequests ?? "—"}</td>
                  <td className="num-cell">{user.overflowReports ?? "—"}</td>
                  <td className="score-cell">{user.score}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}