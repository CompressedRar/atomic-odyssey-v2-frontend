import React, { useEffect, useState } from "react";
import {
  ref,
  set,
  get,
  update,
  onValue,
  getDatabase,
} from "firebase/database";
import { db, auth } from "../configs/FirebaseConfig";
import {
  onAuthStateChanged,
} from "firebase/auth";

export default function Lobby({ onStartGame }) {
  const [playerName, setPlayerName] = useState("");
  const [roomCode, setRoomCode] = useState("");          // actual joined room
  const [roomCodeInput, setRoomCodeInput] = useState(""); // what user types
  const [isHost, setIsHost] = useState(false);
  const [roomData, setRoomData] = useState(null);
  const [userInfo, setUserInfo] = useState(null);

  // 🔹 Create a new battle room
  const createRoom = async () => {
    if (!playerName) return alert("Enter your name first!");

    const code = Math.random().toString(36).substr(2, 6).toUpperCase();
    await set(ref(db, `rooms/${code}`), {
      host: playerName,
      players: {
        [playerName]: { name: playerName, score: 0 },
      },
      gameStarted: false,
    });
    setRoomCode(code);
    setIsHost(true);
  };

  // 🔹 Join an existing room
  const joinRoom = async () => {
    if (!playerName) return alert("Enter your name first!");
    if (!roomCodeInput) return alert("Enter a room code!");

    const roomRef = ref(db, `rooms/${roomCodeInput}`);
    const snapshot = await get(roomRef);
    if (snapshot.exists()) {
      const data = snapshot.val();
      if (Object.keys(data.players).length >= 5) {
        alert("Room is full!");
        return;
      }

      await update(roomRef, {
        [`players/${playerName}`]: { name: playerName, score: 0 },
      });

      // ✅ officially join the room after successful update
      setRoomCode(roomCodeInput);
      setIsHost(false);
    } else {
      alert("Room not found!");
    }
  };

  // 🔹 Start the game (host only)
  const startGame = async () => {
    await update(ref(db, `rooms/${roomCode}`), { gameStarted: true });
  };

  // 🔹 Listen for live updates in this room
  useEffect(() => {
    if (!roomCode) return;
    const roomRef = ref(db, `rooms/${roomCode}`);
    const unsubscribe = onValue(roomRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        setRoomData(data);

        if (data.gameStarted) {
          onStartGame(roomCode, userInfo); // move to the battle screen
        }
      }
    });

    return () => unsubscribe();
  }, [roomCode, playerName, onStartGame]);

  // 🔹 Load user info from Firebase Auth + Realtime Database
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) return;

      try {
        const db = getDatabase();
        const snapshot = await get(ref(db, "users/" + user.uid));
        let userData = {};
        if (snapshot.exists()) userData = snapshot.val();

        setUserInfo({
          ...userData,
          email: user.email,
        });

        setPlayerName(userData.username || user.email.split("@")[0]);
      } catch (error) {
        console.error("Error fetching user info:", error);
      }
    });

    return () => unsubscribe();
  }, []);

  // 🔹 UI
  return (
    <div className="flex flex-col items-center justify-center p-6 text-center">
      {!roomCode ? (
        <>
          <h1 className="text-3xl font-bold mb-4">Atomic Odyssey ⚛️</h1>
          <p className="text-gray-600 mb-3">Welcome, {playerName}</p>

          <div className="flex gap-2 mb-3">
            <button
              onClick={createRoom}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
            >
              Create Room
            </button>

            <input
              type="text"
              placeholder="Room Code"
              value={roomCodeInput}
              onChange={(e) => setRoomCodeInput(e.target.value.toUpperCase())}
              className="border rounded px-3 py-2 w-32 text-center"
            />

            <button
              onClick={joinRoom}
              className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
            >
              Join
            </button>
          </div>
        </>
      ) : (
        <div className="mt-4">
          <h2 className="text-xl font-semibold mb-2">
            Room Code: <span className="text-blue-600">{roomCode}</span>
          </h2>

          {roomData && (
            <div className="mb-4">
              <h3 className="font-semibold">Players:</h3>
              {Object.values(roomData.players || {}).map((p) => (
                <p key={p.name}>{p.name}</p>
              ))}
            </div>
          )}

          {isHost && (
            <button
              onClick={startGame}
              disabled={
                !roomData ||
                Object.keys(roomData.players || {}).length < 2
              }
              className={`${
                Object.keys(roomData?.players || {}).length < 2
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-red-500 hover:bg-red-600"
              } text-white px-5 py-2 rounded`}
            >
              Start Battle
            </button>
          )}
        </div>
      )}
    </div>
  );
}
