import React, { useState, useEffect } from "react";
import { getDatabase, ref, get, remove } from "firebase/database";
import "../styles/AdminDashboard.css";

export default function AdminLeaderboard() {
  const [activeTab, setActiveTab] = useState("Classic");
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [loading, setLoading] = useState(true);

  // ✅ Match your Firebase node names exactly
  const modeMap = {
    Classic: "Classic",
    "Time Trial - Easy": "timeTrialEasy",
    "Time Trial - Medium": "timeTrialMedium",
    "Time Trial - Hard": "timeTrialHard",
    "Survival - Normal": "normalSurvival",
    "Survival - Hard": "hardSurvival",
  };

  // 🔹 Fetch leaderboard data
  const fetchLeaderboard = async (modeKey) => {
    setLoading(true);
    try {
      const db = getDatabase();
      const leaderboardRef = ref(db, `leaderboards/${modeMap[modeKey]}`);
      const snapshot = await get(leaderboardRef);

      if (snapshot.exists()) {
        const data = Object.values(snapshot.val());
        // Sort highest score first
        data.sort((a, b) => (b.score || 0) - (a.score || 0));
        setLeaderboardData(data);
      } else {
        setLeaderboardData([]);
      }
    } catch (error) {
      console.error("Error fetching leaderboard:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaderboard(activeTab);
  }, [activeTab]);

  // 🔹 Allow admin to clear leaderboard
  const handleClearLeaderboard = async () => {
    if (!window.confirm(`Clear leaderboard for ${activeTab}?`)) return;
    try {
      const db = getDatabase();
      await remove(ref(db, `leaderboards/${modeMap[activeTab]}`));
      setLeaderboardData([]);
      alert(`${activeTab} leaderboard cleared.`);
    } catch (err) {
      console.error("Error clearing leaderboard:", err);
      alert("Failed to clear leaderboard.");
    }
  };

  return (
    <div className="main">
      <header className="header">
        <h1>Leaderboards</h1>
        <p className="text-muted">
          View and manage top players across all game modes.
        </p>
      </header>

      {/* Mode Selector */}
      <div className="mode-selector">
        <select
          className="dropdown-select"
          value={activeTab}
          onChange={(e) => setActiveTab(e.target.value)}
        >
          <optgroup label="Main Mode">
            <option>Classic</option>
          </optgroup>
          <optgroup label="Time Trial">
            <option>Time Trial - Easy</option>
            <option>Time Trial - Medium</option>
            <option>Time Trial - Hard</option>
          </optgroup>
          <optgroup label="Survival">
            <option>Survival - Normal</option>
            <option>Survival - Hard</option>
          </optgroup>
        </select>

      </div>

      {/* Leaderboard Table */}
      <section className="table-section">
        <h2>{activeTab} Leaderboard</h2>

        {loading ? (
          <p>Loading...</p>
        ) : leaderboardData.length === 0 ? (
          <p className="text-center">No data found for {activeTab}</p>
        ) : (
          <table className="user-table">
            <thead>
              <tr>
                <th>Rank</th>
                <th>Profile</th>
                <th>Username</th>
                <th>Email</th>
                <th>
                  {activeTab.includes("Classic")
                    ? "Time (s)"
                    : activeTab.includes("Survival")
                    ? "Solved"
                    : "Score"}
                </th>
              </tr>
            </thead>
            <tbody>
              {leaderboardData.map((player, index) => (
                <tr key={index}>
                  <td>#{index + 1}</td>
                  <td>
                    <img
                      src={
                        player.profilePic ||
                        "https://cdn-icons-png.flaticon.com/512/847/847969.png"
                      }
                      alt="profile"
                      className="profile-pic"
                    />
                  </td>
                  <td>{player.name || "Unknown"}</td>
                  <td>{player.email || "N/A"}</td>
                  <td>
                    {activeTab.includes("Classic")
                      ? `${player.totalTimeTaken || 0}s`
                      : activeTab.includes("Survival")
                      ? player.questions || 0
                      : player.score || 0}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </div>
  );
}
