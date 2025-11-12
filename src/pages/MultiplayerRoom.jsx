import React, { useEffect, useState, useRef } from "react";
import {
  ref,
  set,
  get,
  update,
  remove,
  onDisconnect,
  onValue,
  getDatabase,
} from "firebase/database";
import { db, auth } from "../configs/FirebaseConfig";
import { onAuthStateChanged } from "firebase/auth";
import periodicTable from "../assets/periodic-table.json";
import Confetti from "react-confetti";

export default function MultiplayerRoom({ roomCode }) {
  const containerRef = useRef(null);
  const [isActive, setIsActive] = useState(false);
  const [user, setUser] = useState(null);
  const [username, setUsername] = useState(null);
  const [roomData, setRoomData] = useState(null);
  const [question, setQuestion] = useState(null);
  const [winner, setWinner] = useState(null);
  const [loading, setLoading] = useState(true);
  const [questionAnimate, setQuestionAnimate] = useState(false);
  const [showQuitConfirm, setShowQuitConfirm] = useState(false);
  const [localQuit, setLocalQuit] = useState(false);

  const MAX_POINTS = 10;
  const MIN_PLAYERS = 2; // minimum to start
  const elements = Object.values(periodicTable);

  // Detect visibility
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setIsActive(entry.isIntersecting),
      { threshold: 0.5 }
    );
    if (containerRef.current) observer.observe(containerRef.current);
    return () => {
      if (containerRef.current) observer.unobserve(containerRef.current);
    };
  }, []);

  // Load user and username
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      if (!u) return;
      setUser(u);
      try {
        const snapshot = await get(ref(getDatabase(), `users/${u.uid}`));
        setUsername(
          snapshot.exists()
            ? snapshot.val().username || u.email.split("@")[0]
            : u.email.split("@")[0]
        );
      } catch (err) {
        console.error("Error loading username:", err);
      }
    });
    return () => unsub();
  }, []);

  // Player presence
  useEffect(() => {
    if (!username || !roomCode) return;
    const playerRef = ref(db, `rooms/${roomCode}/players/${username}/online`);
    set(playerRef, true);
    onDisconnect(playerRef).set(false);
  }, [username, roomCode]);

  // Listen for room updates
  useEffect(() => {
    if (!roomCode) return;
    const roomRef = ref(db, `rooms/${roomCode}`);
    const unsub = onValue(roomRef, async (snapshot) => {
      if (!snapshot.exists()) return;
      const data = snapshot.val();
      setRoomData(data);
      setQuestion(data.currentQuestion || null);
      setWinner(data.winner || null);
      setLoading(false);

      // Host auto-setup next question only if game started
      if (
        data.gameStarted &&
        !data.currentQuestion &&
        !data.winner &&
        data.host === username
      ) {
        startNewQuestion();
      }
    });
    return () => unsub();
  }, [roomCode, username]);

  // Generate questions
  const shuffle = (arr) => [...arr].sort(() => Math.random() - 0.5);
  const generateQuestion = () => {
    const el = elements[Math.floor(Math.random() * elements.length)];
    const types = [
      {
        text: `What is the symbol of ${el.name}?`,
        correct: el.symbol,
        choices: shuffle([
          el.symbol,
          ...elements
            .filter((e) => e.symbol !== el.symbol)
            .slice(0, 3)
            .map((e) => e.symbol),
        ]),
      },
      {
        text: `What is the atomic number of ${el.name}?`,
        correct: String(el.number),
        choices: shuffle([
          String(el.number),
          ...elements
            .filter((e) => e.number !== el.number)
            .slice(0, 3)
            .map((e) => String(e.number)),
        ]),
      },
      {
        text: `Which element has the symbol ${el.symbol}?`,
        correct: el.name,
        choices: shuffle([
          el.name,
          ...elements
            .filter((e) => e.symbol !== el.symbol)
            .slice(0, 3)
            .map((e) => e.name),
        ]),
      },
    ];
    return types[Math.floor(Math.random() * types.length)];
  };

  // Start question (only host)
  const startNewQuestion = async () => {
    if (!roomData || !username || roomData.host !== username) return;
    if (roomData.winner) return;
    const newQ = generateQuestion();
    await update(ref(db, `rooms/${roomCode}`), {
      currentQuestion: newQ,
      answered: false,
      feedback: null,
    });
  };

  // Handle answer
  const handleAnswer = async (choice) => {
    if (!question || !username || winner) return;
    const roomRef = ref(db, `rooms/${roomCode}`);
    const snapshot = await get(roomRef);
    const data = snapshot.val();
    if (!data) return;

    const correct = choice === question.correct;
    const updates = {};

    if (correct) {
      const newScore = (data.players[username]?.score || 0) + 1;
      updates[`players/${username}/score`] = newScore;
      updates.feedback = `${username} answered correctly!`;
      updates.answered = true;

      // Check for win condition
      if (newScore >= MAX_POINTS) {
        // Determine top scorer
        const sorted = Object.entries(data.players).sort(
          (a, b) => (b[1].score || 0) - (a[1].score || 0)
        );
        const [top] = sorted;
        updates.winner = top[0];
        updates.feedback = `${top[0]} wins the battle!`;
      }
    } else {
      updates.feedback = `${username} answered wrong!`;
      updates.answered = false;
    }

    await update(roomRef, updates);
  };

  // Auto next question after correct answer
  useEffect(() => {
    if (roomData?.feedback?.includes("answered correctly") && !roomData?.winner) {
      const t = setTimeout(() => startNewQuestion(), 2000);
      return () => clearTimeout(t);
    }
  }, [roomData?.feedback, roomData?.winner]);

  // Winner detection
  useEffect(() => {
    if (roomData?.winner) setWinner(roomData.winner);
  }, [roomData?.winner]);

  // Quit game
  const handleQuitGame = async () => {
    if (!username || !roomCode || !roomData) return;

    const roomRef = ref(db, `rooms/${roomCode}`);
    const players = roomData.players || {};

    await update(ref(db, `rooms/${roomCode}/players/${username}`), {
      online: false,
    });

    const remaining = Object.entries(players).filter(
      ([n, p]) => n !== username && p.online
    );

    if (remaining.length > 0) {
      // Highest scorer among remaining
      const [winnerName] = remaining.sort(
        (a, b) => (b[1].score || 0) - (a[1].score || 0)
      )[0];
      await update(roomRef, { winner: winnerName, ended: true });
    } else {
      await update(roomRef, { ended: true });
    }

    setLocalQuit(true);
    setShowQuitConfirm(false);
  };

  const handleRestart = () => window.location.reload();

  if (loading || !username) return <div>Loading...</div>;
  if (roomData?.ended && !winner && !localQuit)
    return <div className="text-white text-center mt-10">This battle has ended.</div>;

  return (
    <div ref={containerRef} className="battle-room relative">
      {/* Quit Button */}
      {!winner && !localQuit && (
        <button
          className="quit-btn absolute top-4 right-4 text-white bg-red-500 hover:bg-red-600 px-3 py-1 rounded"
          onClick={() => setShowQuitConfirm(true)}
        >
          X
        </button>
      )}

      {/* Host-only Start Game Button */}
      {roomData?.host === username && !roomData?.gameStarted && (
        <div className="absolute top-10 left-1/2 -translate-x-1/2">
          <button
            className="bg-green-500 hover:bg-green-600 px-6 py-2 rounded text-white font-semibold"
            onClick={async () => {
              const playersCount = Object.keys(roomData.players || {}).length;
              if (playersCount < MIN_PLAYERS) {
                alert(`Need at least ${MIN_PLAYERS} players to start.`);
                return;
              }
              await update(ref(db, `rooms/${roomCode}`), { gameStarted: true });
            }}
          >
            Start Game
          </button>
        </div>
      )}

      {/* Waiting message */}
      {!roomData?.gameStarted && roomData?.host !== username && (
        <p className="text-center text-gray-300 mt-6">
          Waiting for host to start the game...
        </p>
      )}

      {/* Scoreboard */}
      <div className="scores-container">
        {Object.values(roomData?.players || {})
          .sort((a, b) => (b.score ?? 0) - (a.score ?? 0))
          .map((p, index) => {
            const isTop1 = index === 0;
            return (
              <span
                key={p.name}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: isTop1 ? "10px 15px" : "6px 12px",
                  borderRadius: "10px",
                  marginBottom: "8px",
                  fontWeight: "700",
                  fontSize: isTop1 ? "1.2rem" : "1rem",
                  transform: isTop1 ? "scale(1.08)" : "scale(1)",
                  boxShadow: isTop1
                    ? "0 0 15px rgba(255, 215, 0, 0.7)"
                    : "0 0 8px rgba(100, 0, 255, 0.4)",
                  background: isTop1
                    ? "linear-gradient(90deg, #ffd700, #ffb700)"
                    : "linear-gradient(90deg, #3d1bff, #6400ff)",
                  color: isTop1 ? "#000" : "#fff",
                  transition: "all 0.3s ease",
                }}
              >
                <span>
                  {index + 1}. {p.name}
                </span>
                <span
                  style={{
                    background: isTop1 ? "#fff" : "#ffcd00",
                    color: "#000",
                    padding: "5px 10px",
                    borderRadius: "6px",
                    fontWeight: "700",
                    minWidth: "30px",
                    textAlign: "center",
                  }}
                >
                  {p.score ?? 0}
                </span>
              </span>
            );
          })}
      </div>

      {/* Question Section */}
      {roomData?.gameStarted && question && (
        <div className={`question-container ${questionAnimate ? "fade-in" : ""}`}>
          <h2 className="question">{question.text}</h2>
          <div className="choices">
            {question.choices.map((c, i) => (
              <button
                key={i}
                onClick={() => handleAnswer(c)}
                className="bg-blue-600 hover:bg-blue-700 rounded py-2 px-4"
              >
                {c}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Feedback */}
      {roomData?.feedback && <p className="feeds">{roomData.feedback}</p>}

      {/* Winner/Loser Overlay */}
      {(winner || localQuit) && (
        <div
          onClick={handleRestart}
          className={`result-overlay ${localQuit ? "loser" : winner === username ? "winner" : "loser"
            }`}
        >
          {!localQuit && winner === username && (
            <Confetti numberOfPieces={600} recycle={false} gravity={0.25} />
          )}
          <h1>{localQuit ? "DEFEAT!" : winner === username ? "VICTORY!" : "DEFEAT!"}</h1>
          <p>
            {localQuit
              ? "You quit the game."
              : winner === username
                ? "Click to play again!"
                : "Click to try again."}
          </p>
        </div>
      )}

      {/* Quit Confirmation */}
      {showQuitConfirm && (
        <div className="quit-confirm-overlay">
          <div className="quit-confirm-modal">
            <h2>Quit Game?</h2>
            <p>Are you sure you want to end the game?</p>
            <div className="quit-confirm-buttons">
              <button className="yes-btn" onClick={handleQuitGame}>
                Yes
              </button>
              <button className="no-btn" onClick={() => setShowQuitConfirm(false)}>
                No
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
