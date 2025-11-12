import React, { useEffect, useState } from "react";
import { ref, set, get, update, onValue, push, remove } from "firebase/database";
import { db, auth } from "../configs/FirebaseConfig";
import { onAuthStateChanged } from "firebase/auth";
import "../styles/Competitive.css";
import "../styles/animations.css";

export default function MatchmakingLobby({ onStartGame }) {
  const [playerName, setPlayerName] = useState("");
  const [roomCode, setRoomCode] = useState("");
  const [roomData, setRoomData] = useState(null);
  const [userInfo, setUserInfo] = useState(null);
  const [searching, setSearching] = useState(false);
  const MAX_PLAYERS = 2;

  // Load current user info
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (!user) return;
      const snapshot = await get(ref(db, "users/" + user.uid));
      const userData = snapshot.exists() ? snapshot.val() : {};
      setUserInfo({ ...userData, email: user.email });
      setPlayerName(userData.username || user.email.split("@")[0]);
    });
    return () => unsub();
  }, []);

  // Find or create match
  const findMatch = async () => {
    if (!playerName) return alert("You must be logged in!");
    setSearching(true);

    const roomsRef = ref(db, "rooms");
    const snapshot = await get(roomsRef);
    const rooms = snapshot.exists() ? snapshot.val() : {};

    // Find room that is not started and not full
    const availableRoom = Object.entries(rooms).find(
      ([, data]) =>
        !data.gameStarted &&
        Object.keys(data.players || {}).length < MAX_PLAYERS
    );

    if (availableRoom) {
      const [code] = availableRoom;
      await update(ref(db, `rooms/${code}/players/${playerName}`), {
        name: playerName,
        score: 0,
        online: true,
      });
      setRoomCode(code);
    } else {
      // Create new room
      const newRoomRef = push(ref(db, "rooms"));
      const newCode = newRoomRef.key.slice(0, 6).toUpperCase();
      await set(ref(db, `rooms/${newCode}`), {
        host: playerName,
        players: {
          [playerName]: { name: playerName, score: 0, online: true },
        },
        gameStarted: false,
      });
      setRoomCode(newCode);
    }

    setSearching(false);
  };

  // Cancel matchmaking
  const cancelMatch = async () => {
    if (!roomCode) return;

    // ✅ Remove player from room properly
    await remove(ref(db, `rooms/${roomCode}/players/${playerName}`));

    setRoomCode("");
    setRoomData(null);
  };

  // Listen for live room updates
  useEffect(() => {
    if (!roomCode) return;
    const roomRef = ref(db, `rooms/${roomCode}`);
    const unsub = onValue(roomRef, async (snapshot) => {
      if (!snapshot.exists()) return;
      const data = snapshot.val();
      setRoomData(data);

      // Auto start when enough players join
      if (!data.gameStarted && Object.keys(data.players || {}).length >= MAX_PLAYERS) {
        await update(roomRef, { gameStarted: true });
      }

      if (data.gameStarted) {
        onStartGame(roomCode, userInfo);
      }
    });

    return () => unsub();
  }, [roomCode, userInfo, onStartGame]);

  return (
    <div className="pvp-container">
      <h1 className="text-3xl font-bold mb-2">Versus</h1>
      <p className="text-gray-400 mb-6">Compete and clash with other player.</p>

      {!roomCode ? (
        <button
          onClick={findMatch}
          disabled={searching}
          className={`${searching ? "bg-gray-600" : "bg-blue-500 hover:bg-blue-600"
            } text-white px-6 py-3 rounded-lg font-semibold`}
        >
          {searching ? "Finding Match..." : "Find Match"}
        </button>
      ) : (
        <div className="flex flex-col items-center gap-2">
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg w-80 text-center">
            <p className="text-yellow-400">
              {roomData?.gameStarted
                ? "Game Starting..."
                : "Waiting for opponent..."}
            </p>
          </div>

          {/* 🔹 Cancel Find Match button */}
          {!roomData?.gameStarted && (
            <button
              onClick={cancelMatch}
              className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded mt-2"
            >
              Cancel Find Match
            </button>
          )}
        </div>
      )}
    </div>
  );
}