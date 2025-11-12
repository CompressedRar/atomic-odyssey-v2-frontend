import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import periodicJspon from "../assets/periodic-table.json"
import compounds from "../assets/quiz-compound.json"
import "../styles/Classic.css";
import { auth } from "../configs/FirebaseConfig";
import { getDatabase, ref, get, set, push } from "firebase/database";

const elementsData  = Object.values(periodicJspon)

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

  const TOTAL_QUESTIONS = 10; // or any number you want

  const navigate = useNavigate();

  const [currentCompoundIndex, setCurrentCompoundIndex] = useState(0);
  const [selectedElements, setSelectedElements] = useState({});
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [isGameOver, setIsGameOver] = useState(false);
  const [activeModal, setActiveModal] = useState(null);
  const [showOverlay, setShowOverlay] = useState(true);
  const [showQuitConfirm, setShowQuitConfirm] = useState(false);
  const [shuffledCompounds, setShuffledCompounds] = useState([]);



  const currentCompound = shuffledCompounds[currentCompoundIndex];


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
    if (currentCompoundIndex + 1 >= shuffledCompounds.length) {
      endGame();
    } else {
      setCurrentCompoundIndex((prev) => prev + 1);
      setSelectedElements({});
    }
  };
  const saveScoreToHistory = async (answeredQuestions) => {
    try {
        const user = auth.currentUser;
        if (!user) return;

        const db = getDatabase();
        const userRef = ref(db, `users/${user.uid}`);
        const snapshot = await get(userRef);

        let username = "Anonymous";
        let profilePic = "https://via.placeholder.com/50";
        if (snapshot.exists()) {
        const data = snapshot.val();
        if (data.username) username = data.username;
        if (data.profilePic) profilePic = data.profilePic;
        }

        const totalTimeTaken = TOTAL_GAME_TIME - timeLeft;

        // ✅ Use push() to create a unique entry for each game
        const historyRef = ref(db, `history/Classic/${user.uid}`);
        const newEntryRef = push(historyRef);

        await set(newEntryRef, {
        uid: user.uid,
        name: username,
        email: user.email,
        profilePic,
        score,
        totalTimeTaken,
        timestamp: Date.now(),
        answeredQuestions: answeredQuestions || [],
        });

        console.log("✅ Score added to history!");
    } catch (err) {
        console.error("❌ Error saving score:", err);
    }
    };

  const endGame = () => {
    setIsGameOver(true);
    saveScoreToLeaderboard(score)
    saveScoreToHistory(score)
    setActiveModal("gameover");
  };

  const handleRestart = () => {
  const newList = [...compounds]
    .sort(() => Math.random() - 0.5)
    .slice(0, TOTAL_QUESTIONS);

  setShuffledCompounds(newList);
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

  useEffect(() => {
  // Shuffle compounds on game start
    const shuffled = [...compounds]
      .sort(() => Math.random() - 0.5)
      .slice(0, TOTAL_QUESTIONS); // limit number of questions

    setShuffledCompounds(shuffled);
  }, []);


if (!currentCompound) return null;


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
              <button onClick={() => navigate("/main")}>Exit</button>
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
