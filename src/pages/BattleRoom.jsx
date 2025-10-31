import React, { useEffect, useState } from "react";
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

export default function BattleRoom({ roomCode }) {
  const [user, setUser] = useState(null);
  const [username, setUsername] = useState(null);
  const [roomData, setRoomData] = useState(null);
  const [question, setQuestion] = useState(null);
  const [winner, setWinner] = useState(null);
  const [loading, setLoading] = useState(true);

  const MAX_POINTS = 10;
  const elements = Object.values(periodicTable);

  // ✅ Load username from DB
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      if (!u) return;
      setUser(u);

      try {
        const dbRef = ref(getDatabase(), "users/" + u.uid);
        const snapshot = await get(dbRef);
        if (snapshot.exists()) {
          const data = snapshot.val();
          setUsername(data.username || u.email.split("@")[0]);
        } else {
          setUsername(u.email.split("@")[0]);
        }
      } catch (err) {
        console.error("Error loading username:", err);
      }
    });
    return () => unsub();
  }, []);

  // ✅ Handle player presence
  useEffect(() => {
    if (!username || !roomCode) return;
    const db = getDatabase();
    const playerRef = ref(db, `rooms/${roomCode}/players/${username}/online`);
    set(playerRef, true);
    onDisconnect(playerRef).set(false);
  }, [username, roomCode]);

  // ✅ Listen for room updates
  useEffect(() => {
  if (!roomCode) return;
  const roomRef = ref(db, `rooms/${roomCode}`);

  let hasStarted = false; // track auto-start status in this effect

  const unsub = onValue(roomRef, async (snapshot) => {
    if (!snapshot.exists()) return;
    const data = snapshot.val();
    setRoomData(data);
    setQuestion(data.currentQuestion || null);
    setWinner(data.winner || null);
    setLoading(false);

    // 🧠 Auto-start only ONCE when ready
    const playerCount = Object.keys(data.players || {}).length;
    if (
      !hasStarted &&
      data.host === username &&
      !data.currentQuestion &&
      playerCount >= 2 &&
      !data.answered &&
      !data.winner
    ) {
      hasStarted = true;
      console.log("🟢 Auto-starting first question...");
      setTimeout(() => startNewQuestion(), 1000); // slight delay
    }
  });

  return () => unsub();
}, [roomCode, username]);

  // ✅ Generate questions
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

  // ✅ Host starts question
  const startNewQuestion = async () => {
    if (!roomData || !username || roomData.host !== username) return;
    const newQ = generateQuestion();
    await update(ref(db, `rooms/${roomCode}`), {
      currentQuestion: newQ,
      answered: false,
      feedback: null,
    });
  };

  // ✅ Player answers
  const handleAnswer = async (choice) => {
    if (!question || !username || winner) return;
    const roomRef = ref(db, `rooms/${roomCode}`);
    const snapshot = await get(roomRef);
    const data = snapshot.val();
    if (!data || data.answered) return;

    const correct = choice === question.correct;
    const updates = { answered: true };

    if (correct) {
      const newScore = (data.players[username]?.score || 0) + 1;
      updates[`players/${username}/score`] = newScore;
      updates.feedback = `${username} answered correctly!`;
      if (newScore >= MAX_POINTS) updates.winner = username;
    } else {
      updates.feedback = `${username} answered wrong!`;
    }

    await update(roomRef, updates);
  };

  // ✅ Auto next question
  useEffect(() => {
    if (roomData?.answered && !roomData?.winner) {
      const t = setTimeout(() => startNewQuestion(), 2000);
      return () => clearTimeout(t);
    }
  }, [roomData?.answered, roomData?.winner]);

  // ✅ End room when no one online
  useEffect(() => {
    if (!roomData || !roomCode) return;
    const players = Object.values(roomData.players || {});
    const onlinePlayers = players.filter((p) => p.online);

    if (players.length > 0 && onlinePlayers.length === 0) {
      const roomRef = ref(db, `rooms/${roomCode}`);
      update(roomRef, { ended: true });
      setTimeout(async () => {
        const snap = await get(roomRef);
        const latest = snap.val();
        const stillOnline = Object.values(latest.players || {}).some(
          (p) => p.online
        );
        if (!stillOnline) await remove(roomRef);
      }, 10000);
    }
  }, [roomData, roomCode]);

  // ✅ UI
  if (loading || !username) return <div>Loading...</div>;
  if (roomData?.ended)
    return (
      <div className="text-white text-center mt-10">This battle has ended.</div>
    );

  if (winner)
    return (
      <div className="victory battle-room">
        <h1 className="text-3xl font-bold mb-4">
        {winner} wins the battle!
        </h1>
        <button
          onClick={() => window.location.reload()}
          className="bg-blue-600 hover:bg-blue-700 px-5 py-2 rounded"
        >
          Back to Home
        </button>
      </div>
    );

  return (
    <div className="battle-room">
      <div className="scores-container">
        {Object.values(roomData?.players || {}).map((p) => (
          <span className="sc" key={p.name}>
            <span>{p.name}:</span><span className="pl-sc">{p.score ?? 0}</span>
          </span>
        ))}
      </div>
      {question ? (
        <div className="question-container">
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
      ) : (
        roomData?.host === username && (
          <button
            onClick={startNewQuestion}
            className="mt-6 py-2 px-6 bg-green-600 hover:bg-green-700 rounded"
          >
            Start Battle
          </button>
        )
      )}
      {roomData?.feedback && (
        <p className="feeds">{roomData.feedback}</p>
      )}
    </div>
  );
}
