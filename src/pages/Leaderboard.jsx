import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { getDatabase, ref, get } from "firebase/database";
import BackgroundVideo from "../components/BackgroundVideo";
import "../styles/Leaderboard.css";

function Leaderboard() {
  const [activeTab, setActiveTab] = useState("Classic");
  const [showTimeTrialModes, setShowTimeTrialModes] = useState(false);
  const [showSurvivalModes, setShowSurvivalModes] = useState(false);
  const [leaderboardData, setLeaderboardData] = useState([]);

  const modeMap = {
    Classic: "Classic",
    "Time Trial - Easy": "timeTrialEasy",
    "Time Trial - Medium": "timeTrialMeduim",
    "Time Trial - Hard": "timeTrialHard",
    "Survival - Normal": "normalSurvival",
    "Survival - Hard": "hardSurvival",
  };

  useEffect(() => {
    const db = getDatabase();
    const path = modeMap[activeTab] || "Classic";
    const leaderboardRef = ref(db, `leaderboards/${path}`);

    get(leaderboardRef).then((snapshot) => {
      if (snapshot.exists()) {
        const data = Object.values(snapshot.val());
        data.sort((a, b) => b.score - a.score);
        setLeaderboardData(data);
      } else {
        setLeaderboardData([]);
      }
    });
  }, [activeTab]);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setShowTimeTrialModes(false);
    setShowSurvivalModes(false);
  };

  return (
    <div className="leaderboard-page">

      <div className="leaderboard-container">
        <h1 className="leaderboard-title">Leaderboard</h1>

        {/* === MODE SELECT BUTTONS === */}
        <div className="mode-bar">
          {/* Classic */}
          <motion.button
            whileTap={{ scale: 0.95 }}
            className={`mode-pill ${activeTab === "Classic" ? "active" : ""}`}
            onClick={() => handleTabChange("Classic")}
          >
            Classic
          </motion.button>

          {/* Time Trial */}
          <div className="dropdown">
            <motion.button
              whileTap={{ scale: 0.95 }}
              className={`mode-pill ${activeTab.includes("Time Trial") ? "active" : ""}`}
              onClick={() => {
                setShowTimeTrialModes(!showTimeTrialModes);
                setShowSurvivalModes(false);
              }}
            >
              Time Trial
            </motion.button>

            <AnimatePresence>
              {showTimeTrialModes && (
                <motion.div
                  className="dropdown-menu glass"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                >
                  {["Easy", "Medium", "Hard"].map((mode) => (
                    <button
                      key={mode}
                      className={`dropdown-item ${activeTab === `Time Trial - ${mode}` ? "active" : ""
                        }`}
                      onClick={() => handleTabChange(`Time Trial - ${mode}`)}
                    >
                      {mode}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Survival */}
          <div className="dropdown">
            <motion.button
              whileTap={{ scale: 0.95 }}
              className={`mode-pill ${activeTab.includes("Survival") ? "active" : ""}`}
              onClick={() => {
                setShowSurvivalModes(!showSurvivalModes);
                setShowTimeTrialModes(false);
              }}
            >
              Survival
            </motion.button>

            <AnimatePresence>
              {showSurvivalModes && (
                <motion.div
                  className="dropdown-menu glass"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                >
                  {["Normal", "Hard"].map((mode) => (
                    <button
                      key={mode}
                      className={`dropdown-item ${activeTab === `Survival - ${mode}` ? "active" : ""
                        }`}
                      onClick={() => handleTabChange(`Survival - ${mode}`)}
                    >
                      {mode}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* === LEADERBOARD LIST === */}
        <div className="leaderboards-list">
          {leaderboardData.length === 0 ? (
            <p className="no-data">No scores yet for {activeTab}</p>
          ) : (
            leaderboardData.map((player, index) => {
              // ✅ Determine what to display based on activeTab
              let displayValue = player.score || 0;
              let label = "Score";

              if (activeTab.toLowerCase().includes("classic")) {
                displayValue = player.totalTimeTaken || 0;
                label = "Time";
              } else if (activeTab.toLowerCase().includes("survival")) {
                displayValue = player.questions || 0;
                label = "Solved";
              } else if (activeTab.toLowerCase().includes("timetrial")) {
                displayValue = player.score || 0;
                label = "Score";
              }

              // ✅ Format display (add "s" for seconds if Classic)
              const formattedValue =
                label === "Time"
                  ? `${displayValue}s`
                  : displayValue;

              return (
                <motion.div
                  key={index}
                  className="leaderboard-item glass"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <span className="rank">#{index + 1}</span>

                  <div className="player-info">
                    <img
                      src={player.profilePic || "/images/default-avatar.png"}
                      alt="Profile"
                      className="player-avatar"
                    />
                    <div className="player-text">
                      <span className="player-name">{player.name}</span>
                      {player.email && (
                        <span className="player-email">{player.email}</span>
                      )}
                    </div>
                  </div>

                  {/* ✅ Clean stat display */}
                  <div className="player-score">
                    <span className="score-label">
                      {label}:{" "}
                      <span className="score-value">{formattedValue}</span>
                    </span>
                  </div>
                </motion.div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}

export default Leaderboard;