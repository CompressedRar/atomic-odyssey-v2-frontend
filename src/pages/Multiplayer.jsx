import React, { useEffect, useState } from "react";
import { ref, set, get, update, onValue, push, remove } from "firebase/database";
import { db, auth } from "../configs/FirebaseConfig";
import { onAuthStateChanged } from "firebase/auth";
import "../styles/Competitive.css";
import "../styles/animations.css";

export default function MultiplayerLobby({ onStartGame }) {
  const [playerName, setPlayerName] = useState("");
  const [roomCode, setRoomCode] = useState("");
  const [joinCode, setJoinCode] = useState("");
  const [roomData, setRoomData] = useState(null);
  const [userInfo, setUserInfo] = useState(null);
  const [searching, setSearching] = useState(false);
  const [isHost, setIsHost] = useState(false);
  const MAX_PLAYERS = 5;

  // 🔹 Load user info
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

  // 🔹 Create a new room
  const createRoom = async () => {
    if (!playerName) return alert("You must be logged in!");
    setSearching(true);

    const newRoomRef = push(ref(db, "rooms"));
    const newCode = newRoomRef.key.slice(0, 6).toUpperCase();

    await set(ref(db, `rooms/${newCode}`), {
      host: playerName,
      players: {
        [playerName]: { name: playerName, score: 0, online: true },
      },
      gameStarted: false,
      createdAt: Date.now(),
    });

    setRoomCode(newCode);
    setIsHost(true);
    setSearching(false);
  };

  // 🔹 Join existing room via code
  const joinRoom = async () => {
    if (!joinCode.trim()) return alert("Enter a valid room code.");
    const code = joinCode.trim().toUpperCase();
    const roomRef = ref(db, `rooms/${code}`);
    const snapshot = await get(roomRef);

    if (!snapshot.exists()) {
      alert("Room not found!");
      return;
    }

    const data = snapshot.val();
    const playerCount = Object.keys(data.players || {}).length;

    if (playerCount >= MAX_PLAYERS) {
      alert("Room is full!");
      return;
    }

    await update(ref(db, `rooms/${code}/players/${playerName}`), {
      name: playerName,
      score: 0,
      online: true,
    });

    setRoomCode(code);
    setIsHost(data.host === playerName);
  };

  // 🔹 Leave or cancel matchmaking
  const leaveRoom = async () => {
    if (!roomCode) return;

    const roomRef = ref(db, `rooms/${roomCode}`);
    const snapshot = await get(roomRef);
    if (!snapshot.exists()) return;

    const data = snapshot.val();

    // Remove player
    await remove(ref(db, `rooms/${roomCode}/players/${playerName}`));

    // If host leaves, delete room
    if (data.host === playerName) {
      await remove(roomRef);
    }

    setRoomCode("");
    setRoomData(null);
    setIsHost(false);
  };

  // 🔹 Start game (only host)
  const startGame = async () => {
    if (!isHost) return;
    await update(ref(db, `rooms/${roomCode}`), { gameStarted: true });
  };

  // 🔹 Listen for room updates
  useEffect(() => {
    if (!roomCode) return;
    const roomRef = ref(db, `rooms/${roomCode}`);
    const unsub = onValue(roomRef, (snapshot) => {
      if (!snapshot.exists()) {
        setRoomData(null);
        setRoomCode("");
        return;
      }

      const data = snapshot.val();
      setRoomData(data);

      if (data.gameStarted) {
        onStartGame(roomCode, userInfo);
      }
    });
    return () => unsub();
  }, [roomCode, userInfo, onStartGame]);

  return (
    <div className="pvp-container">
      <h1 className="text-3xl font-bold mb-2">Multiplayer Lobby</h1>
      <p className="text-gray-400 mb-6">Play with up to {MAX_PLAYERS} players!</p>

      {/* ======= Create / Join Room Section ======= */}
      {!roomCode ? (
        <div className="flex flex-col items-center gap-3 multi-start">
          <button
            onClick={createRoom}
            disabled={searching}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold w-60"
          >
            {searching ? "Creating Room..." : "Create Room"}
          </button>

          <div className="flex items-center gap-2 join-input">
            <input
              type="text"
              placeholder="Enter Room Code"
              value={joinCode}
              onChange={(e) => setJoinCode(e.target.value)}
              className="px-3 py-2 rounded border text-black"
            />
            <button
              onClick={joinRoom}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded font-semibold"
            >
              Join
            </button>
          </div>
        </div>
      ) : (
        /* ======= In-Lobby Section ======= */
        <div className="flex flex-col items-center gap-3  multi-lobby">
          <div className="bg-gray-900 p-6 rounded-lg shadow-lg w-96 text-center">
            <div className="room-code">
                 <h2 className="text-xl font-bold mb-2">Room Code:</h2>
                    <h3 className="text-2xl font-mono text-yellow-400">{roomCode}</h3>
            </div>

            <h3 className="text-lg text-gray-300 mt-4 player">Players:</h3>
            <ul className="mt-2 text-white">
              {Object.values(roomData?.players || {}).map((p, i) => (
                <li key={i} className="py-1">
                  {p.name}
                  {roomData?.host === p.name && (
                    <span className="text-yellow-500 text-sm ml-2">(Host)</span>
                  )}
                </li>
              ))}
            </ul>

            <p className="text-gray-400 mt-4">
              {Object.keys(roomData?.players || {}).length}/{MAX_PLAYERS} Players
            </p>

            {/* Buttons */}
            <div className="mt-4 flex flex-col gap-2 multi-buttons">
              {isHost && (
                <button
                  onClick={startGame}
                  disabled={
                    Object.keys(roomData?.players || {}).length < 2 ||
                    roomData?.gameStarted
                  }
                  className={`${
                    roomData?.gameStarted
                      ? "bg-gray-600"
                      : "bg-green-600 hover:bg-green-700"
                  } text-white px-4 py-2 rounded`}
                >
                  Start Game
                </button>
              )}

              <button
                onClick={leaveRoom}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
              >
                Leave Room
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
