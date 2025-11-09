import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import periodicJspon from "../assets/periodic-table.json"
import "../styles/Classic.css";
import { auth } from "../configs/FirebaseConfig";
import { getDatabase, ref, get, set } from "firebase/database";

const elementsData  = Object.values(periodicJspon)

const compounds = [
  { formula: "H2O", elements: { H: 2, O: 1 }, name: "Water" },
  { formula: "CO2", elements: { C: 1, O: 2 }, name: "Carbon Dioxide" },
  { formula: "NH3", elements: { N: 1, H: 3 }, name: "Ammonia" },
  { formula: "CH4", elements: { C: 1, H: 4 }, name: "Methane" },
  { formula: "NaCl", elements: { Na: 1, Cl: 1 }, name: "Sodium Chloride" },

  // Additional Common Compounds
  { formula: "O2", elements: { O: 2 }, name: "Oxygen Gas" },
  { formula: "H2", elements: { H: 2 }, name: "Hydrogen Gas" },
  { formula: "N2", elements: { N: 2 }, name: "Nitrogen Gas" },
  { formula: "HCl", elements: { H: 1, Cl: 1 }, name: "Hydrogen Chloride" },
  { formula: "CO", elements: { C: 1, O: 1 }, name: "Carbon Monoxide" },

  // Acids
  { formula: "H2SO4", elements: { H: 2, S: 1, O: 4 }, name: "Sulfuric Acid" },
  { formula: "HNO3", elements: { H: 1, N: 1, O: 3 }, name: "Nitric Acid" },
  { formula: "H2CO3", elements: { H: 2, C: 1, O: 3 }, name: "Carbonic Acid" },

  // Bases
  { formula: "NaOH", elements: { Na: 1, O: 1, H: 1 }, name: "Sodium Hydroxide" },
  { formula: "KOH", elements: { K: 1, O: 1, H: 1 }, name: "Potassium Hydroxide" },
  { formula: "Ca(OH)2", elements: { Ca: 1, O: 2, H: 2 }, name: "Calcium Hydroxide" },

  // More Useful Compounds
  { formula: "CaCO3", elements: { Ca: 1, C: 1, O: 3 }, name: "Calcium Carbonate" },
  { formula: "KCl", elements: { K: 1, Cl: 1 }, name: "Potassium Chloride" },
  { formula: "MgO", elements: { Mg: 1, O: 1 }, name: "Magnesium Oxide" },
  { formula: "Fe2O3", elements: { Fe: 2, O: 3 }, name: "Iron(III) Oxide / Rust" },
  { formula: "SO2", elements: { S: 1, O: 2 }, name: "Sulfur Dioxide" },
  { formula: "SO3", elements: { S: 1, O: 3 }, name: "Sulfur Trioxide" },
  { formula: "NO2", elements: { N: 1, O: 2 }, name: "Nitrogen Dioxide" },
  { formula: "N2O", elements: { N: 2, O: 1 }, name: "Nitrous Oxide / Laughing Gas" },

  { formula: "C2H6",  name: "Ethane",        elements: { C: 2, H: 6 } },
  { formula: "C3H8",  name: "Propane",       elements: { C: 3, H: 8 } },
  { formula: "C4H10", name: "Butane",        elements: { C: 4, H: 10 } },

  // Alcohols
  { formula: "CH3OH",   name: "Methanol",    elements: { C: 1, H: 4, O: 1 } },
  { formula: "C2H5OH",  name: "Ethanol",     elements: { C: 2, H: 6, O: 1 } },
  { formula: "C3H7OH",  name: "Propanol",    elements: { C: 3, H: 8, O: 1 } },

  // Organic acids
  { formula: "CH3COOH", name: "Acetic Acid", elements: { C: 2, H: 4, O: 2 } },
  { formula: "HCOOH",   name: "Formic Acid", elements: { C: 1, H: 2, O: 2 } },

  // Amines
  { formula: "CH3NH2",  name: "Methylamine", elements: { C: 1, H: 5, N: 1 } },
  { formula: "C2H5NH2", name: "Ethylamine",  elements: { C: 2, H: 7, N: 1 } },

  // Aromatic (very common example)
  { formula: "C6H6",  name: "Benzene",       elements: { C: 6, H: 6 } }
];

const groupColors = {
  "alkalimetal": "#cc80ff",           // Alkali metals
  "alkaline-earth-metal": "#c2ff00",         // Alkaline earth metals
  "transitionmetal": "#e06633",       // Transition metals
  "post-transition-metal": "#668080",  // Post-transition metals
  "metalloid": "#daa520",        // Metalloids
  "nonmetal": "#ffff30",         // Nonmetals
  "noblegas": "#b3e3f5",            // Noble gases
  "lanthanide": "#8fffc7",       // Lanthanides
  "actinide": "#008fff"          // Actinides
};

export default function FusionMode() {
  const navigate = useNavigate();

  const [currentCompoundIndex, setCurrentCompoundIndex] = useState(0);
  const [selectedElements, setSelectedElements] = useState({});
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [isGameOver, setIsGameOver] = useState(false);
  const [activeModal, setActiveModal] = useState(null);
  const [showOverlay, setShowOverlay] = useState(true);
  const [showQuitConfirm, setShowQuitConfirm] = useState(false);


  const currentCompound = compounds[currentCompoundIndex];

  const handleSelectElement = (symbol) => {
    setSelectedElements((prev) => ({
      ...prev,
      [symbol]: (prev[symbol] || 0) + 1,
    }));
  };

  const handleRemoveElement = (symbol) => {
    setSelectedElements((prev) => {
      const updated = { ...prev };
      if (updated[symbol] > 1) updated[symbol] -= 1;
      else delete updated[symbol];
      return updated;
    });
  };

  const handleSubmit = () => {
    const targetCompound = currentCompound.elements;
    const isCorrect =
      Object.keys(targetCompound).every(
        (key) => selectedElements[key] === targetCompound[key]
      ) &&
      Object.keys(selectedElements).length === Object.keys(targetCompound).length;

    if (isCorrect) {
      setScore((prev) => prev + 10);
      setFeedback("Correct!");
    } else {
      setScore((prev) => Math.max(prev - 5, 0));
      setFeedback("Wrong!");
    }

    // Show feedback briefly
    setTimeout(() => setFeedback(""), 1000);

    // Move to next compound or end game
    if (currentCompoundIndex + 1 >= compounds.length) {
      endGame();
    } else {
      setCurrentCompoundIndex((prev) => prev + 1);
      setSelectedElements({});
    }
  };

  const endGame = () => {
    setIsGameOver(true);
    saveScoreToLeaderboard(score)
    setActiveModal("gameover");
  };

  const handleRestart = () => {
    setCurrentCompoundIndex(0);
    setSelectedElements({});
    setScore(0);
    setFeedback("");
    setIsGameOver(false);
    setActiveModal(null);
    setShowOverlay(true);
  };

  const saveScoreToLeaderboard = async (answeredQuestions) => {
          try {
              const user = auth.currentUser;
              if (!user) return;
  
              const db = getDatabase();
              const userRef = ref(db, `users/${user.uid}`);
              const snapshot = await get(userRef);
  
              let username = "Anonymous";
              let profilePic = "https://via.placeholder.com/50";
              if (snapshot.exists()) {
                  if (snapshot.val().username) username = snapshot.val().username;
                  if (snapshot.val().profilePic) profilePic = snapshot.val().profilePic;
              }
  
              const leaderboardRef = ref(db, `leaderboards/Fusion/${user.uid}`);
              const leaderboardSnap = await get(leaderboardRef);
              const oldData = leaderboardSnap.exists() ? leaderboardSnap.val() : {};
              const updatedGamesPlayed = (oldData.gamesPlayed || 0) + 1;
  
              await set(leaderboardRef, {
                  uid: user.uid,
                  name: username,
                  email: user.email,
                  profilePic,
                  score,
                  gamesPlayed: updatedGamesPlayed,
                  timestamp: Date.now(),
              });
  
              console.log("✅ Score saved to leaderboard!");
          } catch (err) {
              console.error("❌ Error saving score:", err);
          }
      };



  return (
    <div className="periodic-game">
      {/* Top Bar */}
      <div className="game-options">
        <div className="top-button">
          <button onClick={() => setShowQuitConfirm(true)}>← Exit</button>
        </div>

        <div className="score-container">
          Score: <strong>{score}</strong>
        </div>
      </div>


      {/* Start Overlay */}
      {showOverlay && (
        <div
          className="fusion-target-overlay"
          onClick={() => setShowOverlay(false)}
        >
          <h1>Fusion</h1>
          <small>Tap the elements to create the indicated compound.</small>
          <p>Tap anywhere to start</p>
        </div>
      )}

      {/* Fixed Header */}
      <div className="fusion-target-header">
        <div className="compound-info">
          <span>Create</span>
          <strong>{currentCompound.formula}</strong>
          <span className="compound-name">{currentCompound.name}</span>
        </div>
        <div className="selected-display">
          {Object.keys(selectedElements).length === 0 ? (
            <p>No elements selected</p>
          ) : (
            Object.entries(selectedElements).map(([symbol, count]) => (
              <div
                key={symbol}
                className="selected-card"
                onClick={() => handleRemoveElement(symbol)}
              >
                <span className="card-symbol">{symbol}</span>
                <span className="card-count">× {count}</span>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Periodic Table Grid */}
      <div className="periodic-grid" style={{ scale: 0.9 }}>
        {elementsData.map((el) => (
          <div
            key={el.symbol}
            className="cell selectable fusion-cell"
            style={{
              gridRow: el.ypos,
              gridColumn: el.xpos,
              borderColor: groupColors[el.category],
            }}
            onClick={() => handleSelectElement(el.symbol)}
          >
            <span
              className="symbol"
              style={{ color: groupColors[el.category] }}
            >
              {el.symbol}
            </span>
          </div>
        ))}
      </div>

      {/* Floating Submit Button */}
      <div className="submit-floating" onClick={handleSubmit}>
        Submit
      </div>

      {/* Feedback Popup */}
      {feedback && <div className="feedback-popup">{feedback}</div>}

      {/* Game Over Modal */}
      {isGameOver && activeModal === "gameover" && (
        <div className="game-over-modal">
          <div className="modal-content">
            <h1>Game Over!</h1>
            <p>Final Score: {score}</p>
            <div className="modal-buttons">
              <button onClick={handleRestart}>Try Again</button>
              <button onClick={() => navigate(-1)}>Exit</button>
            </div>
          </div>
        </div>
      )}

      {showQuitConfirm && (
                <div className="quit-confirm-overlay">
                    <div className="quit-confirm-modal">
                        <h2>Quit Game?</h2>
                        <p>Are you sure you want to end the game?</p>
                        <div className="quit-confirm-buttons">
                            <button
                                className="yes-btn"
                                onClick={() => {
                                    endGame();
                                    setShowQuitConfirm(false);
                                }}
                            >
                                Yes
                            </button>
                            <button
                                className="no-btn"
                                onClick={() => setShowQuitConfirm(false)}
                            >
                                No
                            </button>
                        </div>
                    </div>
                </div>
            )}

    </div>
  );
}
