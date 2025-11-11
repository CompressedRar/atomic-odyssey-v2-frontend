import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../configs/FirebaseConfig";
import { getDatabase, ref, get, update, onValue, push, set } from "firebase/database";
import { getAuth } from "firebase/auth";
import {
  onAuthStateChanged,
  signOut,
  updateEmail,
  updatePassword,
  reauthenticateWithCredential,
  EmailAuthProvider,
} from "firebase/auth";
import Swal from "sweetalert2";
import "../styles/PlayerInfo.css";

function PlayerInformation() {
  const [userInfo, setUserInfo] = useState(null);
  const [showSettings, setShowSettings] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showViewProfile, setShowViewProfile] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [historyData, setHistoryData] = useState([]);

  const [editData, setEditData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    currentPassword: "",
    profilePic: "",
    showPassword: false,
    showConfirmPassword: false,
  });

  // 🔹 Move this to top-level so JSX can access it
  const gameDisplayNames = {
    Classic: "Classic",
    Fusion: "Fusion",
    competitive: "Competitive",
    hardSurvival: "Hard Survival",
    normalSurvival: "Normal Survival",
    timeTrialEasy: "Time Trial Easy",
    timeTrialMedium: "Time Trial Medium",
    timeTrialHard: "Time Trial Hard",
  };

  const fetchLeaderboardHistory = async () => {
    try {
      const auth = getAuth();
      const user = auth.currentUser;
      if (!user) {
        console.error("User not authenticated.");
        return;
      }

      const db = getDatabase();

      const games = Object.keys(gameDisplayNames);
      const userHistory = [];

      for (const game of games) {
        const leaderboardRef = ref(db, `leaderboards/${game}/${user.uid}`);
        const snapshot = await get(leaderboardRef);

        if (snapshot.exists()) {
          const record = snapshot.val();
          userHistory.push({
            username: record.username || record.name || "You",
            game,
            score: record.score || 0,
            timestamp: record.timestamp || 0,
          });
        }
      }

      userHistory.sort((a, b) => b.timestamp - a.timestamp);
      setHistoryData(userHistory);
    } catch (error) {
      console.error("Error fetching leaderboard history:", error);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) return;

      try {
        const db = getDatabase();

        // Fetch user info
        const snapshot = await get(ref(db, "users/" + user.uid));
        let userData = {};
        if (snapshot.exists()) userData = snapshot.val();

        // Define all game modes
        const gameModes = [
          "Classic",
          "hardSurvival",
          "normalSurvival",
          "timeTrialEasy",
          "timeTrialMedium",
          "timeTrialHard",
        ];

        const scores = {};
        const gamesPlayedData = {};

        for (const mode of gameModes) {
          const leaderboardSnap = await get(ref(db, `leaderboards/${mode}/${user.uid}`));

          if (leaderboardSnap.exists()) {
            const data = leaderboardSnap.val();
            scores[mode] = data.score || 0;
            gamesPlayedData[mode] = data.gamesPlayed || 0;
          } else {
            scores[mode] = 0;
            gamesPlayedData[mode] = 0;
          }
        }

        const totalScore = Object.values(scores).reduce((acc, val) => acc + val, 0);
        const totalMatches = Object.values(gamesPlayedData).reduce((acc, val) => acc + val, 0);
        const avgScore = totalMatches > 0 ? (totalScore / totalMatches).toFixed(1) : 0;
        const masteryPoints = Math.round(totalScore / 10);

        setUserInfo({
          ...userData,
          email: user.email,
          scores,
          gamesPlayedData,
          totalMatches,
          avgScore,
          masteryPoints,
        });

        setEditData({
          username: userData.username || "",
          email: user.email || "",
          password: "",
          confirmPassword: "",
          currentPassword: "",
          profilePic: userData.profilePic || "",
          showPassword: false,
          showConfirmPassword: false,
        });
      } catch (error) {
        console.error("Error fetching user info:", error);
      }
    });

    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
    window.location.href = "/";
  };

  const handleViewProfile = () => {
    setShowSettings(false);
    setShowViewProfile(true);
  };

  const handleEditAccount = () => {
    setShowSettings(false);
    setShowEditModal(true);
  };

  const handleSaveChanges = async () => {
    const user = auth.currentUser;
    const db = getDatabase();
    const updates = {};

    if (!user)
      return Swal.fire({
        title: "Oops!",
        text: "User not logged in!",
        icon: "error",
        background: "#1a1a1a",
        color: "#fff",
        confirmButtonColor: "#f39c12",
      });

    if (editData.password && editData.password !== editData.confirmPassword) {
      return Swal.fire({
        title: "Error",
        text: "Passwords do not match!",
        icon: "error",
        background: "#1a1a1a",
        color: "#fff",
        confirmButtonColor: "#e74c3c",
      });
    }

    try {
      if (editData.username && editData.username !== userInfo.username)
        updates[`users/${user.uid}/username`] = editData.username;
      if (editData.profilePic && editData.profilePic !== userInfo.profilePic)
        updates[`users/${user.uid}/profilePic`] = editData.profilePic;
      if (editData.email && editData.email !== user.email)
        updates[`users/${user.uid}/email`] = editData.email;

      if ((editData.email && editData.email !== user.email) || editData.password) {
        if (!editData.currentPassword) {
          return Swal.fire({
            title: "Error",
            text: "Please enter your current password to update email or password.",
            icon: "error",
            background: "#1a1a1a",
            color: "#fff",
            confirmButtonColor: "#e74c3c",
          });
        }

        const credential = EmailAuthProvider.credential(
          user.email,
          editData.currentPassword
        );
        await reauthenticateWithCredential(user, credential);
      }

      if (Object.keys(updates).length > 0) await update(ref(db), updates);

      if (editData.email && editData.email !== user.email) await updateEmail(user, editData.email);
      if (editData.password) await updatePassword(user, editData.password);

      setUserInfo((prev) => ({
        ...prev,
        username: editData.username || prev.username,
        profilePic: editData.profilePic || prev.profilePic,
        email: editData.email || prev.email,
      }));

      Swal.fire({
        title: "Success!",
        text: "Profile updated successfully!",
        icon: "success",
        background: "#1a1a1a",
        color: "#fff",
        confirmButtonColor: "#27ae60",
      });

      setShowEditModal(false);
    } catch (error) {
      Swal.fire({
        title: "Error",
        text:
          error.code === "auth/wrong-password"
            ? "Current password is incorrect."
            : "Failed to update profile. Please try again.",
        icon: "error",
        background: "#1a1a1a",
        color: "#fff",
        confirmButtonColor: "#e74c3c",
      });
      console.error(error);
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setEditData((prev) => ({ ...prev, profilePic: reader.result }));
      Swal.fire({
        title: "Nice!",
        text: "Profile picture updated (temporary preview)!",
        icon: "success",
        background: "#1a1a1a",
        color: "#fff",
        confirmButtonColor: "#27ae60",
      });
    };
    reader.readAsDataURL(file);
  };

  const navigate = useNavigate();
  const audioRef = useRef(null);
  const [isRotating, setIsRotating] = useState(false);
  const [background, setBackground] = useState("default-bg");

  const [showGlobalChat, setShowGlobalChat] = useState(false);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const db = getDatabase();
  const chatContainerRef = useRef(null);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const handleExit = () => {
    navigate(-1);
  };

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.play().catch(() => { });
    }
  }, []);

  const handleSettingsClick = () => {
    setIsRotating(true);
    setTimeout(() => {
      setIsRotating(false);
      setShowSettings(true);
    }, 400);
  };

  const handleBackgroundChange = (newBg) => {
    setBackground(newBg);
    update(ref(db, `players/${auth.currentUser.uid}`), { background: newBg });
  };

  useEffect(() => {
    const chatRef = ref(db, "globalChat");
    const unsubscribe = onValue(chatRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        const chatArray = Object.values(data).sort((a, b) => a.timestamp - b.timestamp);
        setMessages(chatArray);
      } else {
        setMessages([]);
      }
    });
  }, []);

  const handleSendMessage = async () => {
    if (!message.trim()) return;
    const user = auth.currentUser;
    if (!user) return;

    try {
      const userSnap = await get(ref(db, `users/${user.uid}`));
      const userData = userSnap.exists() ? userSnap.val() : {};

      const newMsgRef = push(ref(db, "globalChat"));
      await set(newMsgRef, {
        userId: user.uid,
        username: userData.username || user.displayName || user.email?.split("@")[0] || "Player",
        message: message.trim(),
        timestamp: Date.now(),
        profilePic: userData.profilePic || user.photoURL || "",
      });

      setMessage("");
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  if (!userInfo)
    return <div className="loading-screen-info">
      <span className="loading-splash"></span>
      <small>
        <span className="loading-quote"></span>
      </small>
    </div>

  return (
    <>
      <div className="player-info-container">
        <div className="profile-image-container">
          <img
            src={userInfo.profilePic}
            alt={userInfo.username || "Player"}
            onError={(e) =>
            (e.target.src =
              "https://caricom.org/wp-content/uploads/Floyd-Morris-Remake-1024x879-1.jpg")
            }
            className="profile-image"
          />
        </div>

        <div className="player-information">
          <span className="player-ign" style={{ marginTop: "15px" }}>
            <span>{userInfo.username}</span>
            <span className="additional-player-info" style={{ display: "none" }}>
              <span className="player-mmr">
                <span className="material-symbols-outlined">trophy</span>
                <span>{userInfo.mmr || 0}</span>
              </span>
              <span className="player-star">
                <span className="material-symbols-outlined">star_half</span>
                <span>{userInfo.stars || 0}</span>
              </span>
            </span>
          </span>
        </div>

        <div className="player-tools">
          <span
            className="material-symbols-outlined"
            onClick={() => setShowGlobalChat(true)}
            title="Global Chat"
            style={{display:"none"}}
          >
            chat
          </span>
          <span
            className={`material-symbols-outlined settings-icon ${isRotating ? "rotate" : ""}`}
            onClick={handleSettingsClick}
          >
            settings
          </span>
        </div>
      </div>

      {/* Settings Modal */}
      {showSettings && (
        <div
          className="settings-modal-overlay"
          onClick={() => setShowSettings(false)}
        >
          <div className="settings-modal" onClick={(e) => e.stopPropagation()}>
            <span
              className="close-btn material-symbols-outlined"
              onClick={() => setShowSettings(false)}
            >
              close
            </span>
            <h2>Settings</h2>
            <div className="modal-divider"></div>
            <button className="modal-btn" onClick={handleEditAccount}>
              Edit Account
            </button>
            <button
              className="modal-btn"
              onClick={async () => {
                await fetchLeaderboardHistory();
                setShowHistoryModal(true); // open modal after fetching
              }}
            >
              History
            </button>
            <button
              className="modal-btn logout-btn"
              onClick={() => setShowLogoutConfirm(true)}
            >
              Logout
            </button>
          </div>
        </div>
      )}

      {/* 💬 GLOBAL CHAT MODAL */}
      {showGlobalChat && (
        <div className="settings-modal-overlay" onClick={() => setShowGlobalChat(false)}>
          <div id="chat-container" className="settings-modal chat-modal" onClick={(e) => e.stopPropagation()}>
            <span
              className="close-btn material-symbols-outlined"
              onClick={() => setShowGlobalChat(false)}
            >
              close
            </span>

            <h2 className="title">Global Chat</h2>
            <div className="modal-divider"></div>

            {/* Chat messages container with ref for auto-scroll */}
            <div className="chat-messages" ref={chatContainerRef}>
              {messages.map((msg, index) => {
                const isOwn = msg.userId === auth.currentUser?.uid;
                return (
                  <div key={index} className={`chat-message ${isOwn ? "own" : ""}`}>
                    {!isOwn && (
                      <div className="chat-pair">
                        <img
                          src={
                            msg.profilePic && msg.profilePic !== ""
                              ? msg.profilePic
                              : "https://placehold.co/40x40/2b2b2b/ffffff?text=P"
                          }
                          alt="PFP"
                          className="chat-avatar"
                        />

                      </div>
                    )}
                    <div className="chat-bubble">

                      {!isOwn && <span className="chat-username">{msg.username}</span>}
                      <span className="chat-content">{msg.message}</span>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="chat-input-section">
              <input
                type="text"
                placeholder="Type your message..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
              />
              <button onClick={handleSendMessage}>Send</button>
            </div>
          </div>
        </div>
      )}

      {showGlobalChat && <div className="lobby-chat">
        <div id="chat-container" className="settings-modal chat-modal" onClick={(e) => e.stopPropagation()}>
            

            <h2 className="title">Global Chat</h2>
            <div className="modal-divider"></div>

            <div className="chat-messages" ref={chatContainerRef}>
              {messages.map((msg, index) => {
                const isOwn = msg.userId === auth.currentUser?.uid;
                return (
                  <div key={index} className={`chat-message `}>
                    
                    <div className="chat-bubble">

                      {!isOwn ? <span className="chat-username">{msg.username}</span> : <span className="chat-username">You</span> }
                      <span className="chat-content">{msg.message}</span>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="chat-input-section">
              <input
                type="text"
                placeholder="Type your message..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
              />
              <button hidden onClick={handleSendMessage}>Send</button>
            </div>
          </div>
      </div>}

      {showHistoryModal && (
        <div
          className="history-overlay"
          onClick={() => setShowHistoryModal(false)}
        >
          <div
            className="history-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="history-close"
              onClick={() => setShowHistoryModal(false)}
            >
              ✕
            </button>

            <h2 className="history-title">History</h2>
            <div className="history-divider"></div>

            <div className="history-content">
              {historyData.map((entry, index) => (
                <div key={index} className="history-card">
                  <div className="history-left">
                    <span className="history-game">
                      {gameDisplayNames[entry.game] || entry.game}
                    </span>
                    <span className="history-date">
                      {new Date(entry.timestamp).toLocaleString()}
                    </span>
                  </div>

                  <div className="history-right">
                    <span className="history-score">Score: {entry.score}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* View Profile Modal */}
      {showViewProfile && (
        <div
          className="settings-modal-overlay"
          onClick={() => setShowViewProfile(false)}
        >
          <div
            className="settings-modal view-profile-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <span
              className="close-btn material-symbols-outlined"
              onClick={() => {
                setShowViewProfile(false);
                setShowSettings(true);
              }}
            >
              close
            </span>

            <h2>Player Profile</h2>
            <div className="modal-divider"></div>

            {/* Profile Info Row */}
            <div className="profile-info-row">
              {/* Profile Image */}
              <div className="profile-pic-wrapper">
                <img
                  src={userInfo.profilePic || "https://via.placeholder.com/100"}
                  alt="Profile"
                  className="profile-preview"
                />
                <div className="profile-glow"></div>
              </div>

              {/* Username + Email */}
              <div className="profile-text">
                <h3>{userInfo.username}</h3>
                <p>{userInfo.email}</p>
              </div>
            </div>

            {/* Circular Stats Section */}
            <div className="stats-container">
              {/* Total Matches */}
              <div className="circle-stat">
                <svg className="progress-ring" width="120" height="120">
                  <circle
                    className="progress-ring__background"
                    stroke="#222"
                    strokeWidth="10"
                    fill="transparent"
                    r="50"
                    cx="60"
                    cy="60"
                  />
                  <circle
                    className="progress-ring__circle total-matches"
                    stroke="#f59e0b"
                    strokeWidth="10"
                    fill="transparent"
                    r="50"
                    cx="60"
                    cy="60"
                    strokeDasharray={2 * Math.PI * 50}
                    strokeDashoffset={
                      2 * Math.PI * 50 * (1 - userInfo.totalMatches / 100)
                    }
                  />
                </svg>
                <div className="circle-stat-label">
                  <span>Total Matches</span>
                  <strong>{userInfo.totalMatches}</strong>
                </div>
              </div>

              {/* Average Score */}
              <div className="circle-stat">
                <svg className="progress-ring" width="120" height="120">
                  <circle
                    className="progress-ring__background"
                    stroke="#222"
                    strokeWidth="10"
                    fill="transparent"
                    r="50"
                    cx="60"
                    cy="60"
                  />
                  <circle
                    className="progress-ring__circle avg-score"
                    stroke="#10b981"
                    strokeWidth="10"
                    fill="transparent"
                    r="50"
                    cx="60"
                    cy="60"
                    strokeDasharray={2 * Math.PI * 50}
                    strokeDashoffset={
                      2 * Math.PI * 50 * (1 - userInfo.avgScore / 100)
                    }
                  />
                </svg>
                <div className="circle-stat-label">
                  <span>Average Score</span>
                  <strong>{userInfo.avgScore}</strong>
                </div>
              </div>

              {/* Mastery Points */}
              <div className="circle-stat">
                <svg className="progress-ring" width="120" height="120">
                  <circle
                    className="progress-ring__background"
                    stroke="#222"
                    strokeWidth="10"
                    fill="transparent"
                    r="50"
                    cx="60"
                    cy="60"
                  />
                  <circle
                    className="progress-ring__circle mastery-points"
                    stroke="#3b82f6"
                    strokeWidth="10"
                    fill="transparent"
                    r="50"
                    cx="60"
                    cy="60"
                    strokeDasharray={2 * Math.PI * 50}
                    strokeDashoffset={
                      2 * Math.PI * 50 * (1 - userInfo.masteryPoints / 100)
                    }
                  />
                </svg>
                <div className="circle-stat-label">
                  <span>Mastery Points</span>
                  <strong>{userInfo.masteryPoints}</strong>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Profile Modal */}
      {showEditModal && (
        <div
          className="settings-modal-overlay"
          onClick={() => setShowEditModal(false)}
        >
          <div
            className="settings-modal edit-profile-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <span
              className="close-btn material-symbols-outlined"
              onClick={() => {
                setShowEditModal(false);
                setShowSettings(true);
              }}
            >
              close
            </span>

            <h2>Edit Profile</h2>
            <div className="modal-divider"></div>

            <div className="profile-upload-section">
              <img
                src={editData.profilePic || "https://via.placeholder.com/100"}
                alt="Profile Preview"
                className="profile-preview"
              />
              <label htmlFor="profilePicUpload" className="upload-label">
                <span className="material-symbols-outlined">upload</span> Upload
                New Picture
              </label>
              <input
                type="file"
                id="profilePicUpload"
                accept="image/*"
                style={{ display: "none" }}
                onChange={handleImageUpload}
              />
            </div>

            <input
              type="text"
              placeholder="Username"
              value={editData.username}
              onChange={(e) =>
                setEditData({ ...editData, username: e.target.value })
              }
              className="modal-input"
            />
            <input
              type="email"
              placeholder="Email"
              value={editData.email}
              onChange={(e) =>
                setEditData({ ...editData, email: e.target.value })
              }
              className="modal-input"
            />

            <div className="password-container">
              <input
                type="password"
                placeholder="Current Password"
                value={editData.currentPassword}
                onChange={(e) =>
                  setEditData({ ...editData, currentPassword: e.target.value })
                }
                className="modal-input"
              />
            </div>

            <div className="password-container">
              <input
                type={editData.showPassword ? "text" : "password"}
                placeholder="New Password"
                value={editData.password}
                onChange={(e) =>
                  setEditData({ ...editData, password: e.target.value })
                }
                className="modal-input"
              />
              <span
                className="material-symbols-outlined password-eye"
                onClick={() =>
                  setEditData((prev) => ({ ...prev, showPassword: !prev.showPassword }))
                }
              >
                {editData.showPassword ? "visibility" : "visibility_off"}
              </span>
            </div>

            <div className="password-container">
              <input
                type={editData.showConfirmPassword ? "text" : "password"}
                placeholder="Confirm Password"
                value={editData.confirmPassword}
                onChange={(e) =>
                  setEditData({ ...editData, confirmPassword: e.target.value })
                }
                className="modal-input"
              />
              <span
                className="material-symbols-outlined password-eye"
                onClick={() =>
                  setEditData((prev) => ({
                    ...prev,
                    showConfirmPassword: !prev.showConfirmPassword,
                  }))
                }
              >
                {editData.showConfirmPassword ? "visibility" : "visibility_off"}
              </span>
            </div>

            <button className="modal-btn" onClick={handleSaveChanges}>
              Save Changes
            </button>
          </div>
        </div>
      )}

      {/* Logout Confirmation Modal */}
      {showLogoutConfirm && (
        <div
          className="settings-modal-overlay"
          onClick={() => setShowLogoutConfirm(false)}
        >
          <div
            className="settings-modal logout-confirm-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <span
              className="close-btn material-symbols-outlined"
              onClick={() => setShowLogoutConfirm(false)}
            >
              close
            </span>

            <h2>Confirm Logout</h2>
            <div className="modal-divider"></div>

            <p style={{ color: "#ccc", marginBottom: "1.5rem" }}>
              Are you sure you want to logout?
            </p>

            <div style={{ display: "flex", gap: "1rem", justifyContent: "center" }}>
              <button
                className="modal-btn"
                style={{ background: "#555" }}
                onClick={() => setShowLogoutConfirm(false)}
              >
                Cancel
              </button>
              <button className="modal-btn logout-btn" onClick={handleLogout}>
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CSS */}
      <style>{`
.settings-modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.65);
  backdrop-filter: blur(5px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 999;
  animation: fadeIn 0.25s ease-in-out;
}

.settings-modal {
  position: relative;
  background: linear-gradient(145deg, #181818, #242424);
  color: #fff;
  padding: 2.5rem 2.5rem 2rem;
  border-radius: 18px;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.7);
  width: 580px;
  max-width: 90%;
  text-align: center;
  animation: slideUp 0.3s ease-out;
}

.settings-modal h2 {
  font-size: 1.6rem;
  margin: 0 0 1rem 0;
}

.modal-divider {
  width: 60%;
  height: 2px;
  background: rgba(255, 255, 255, 0.12);
  margin: 0.8rem auto 1.5rem;
  border-radius: 2px;
}

/* Profile Upload */
.profile-upload-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 1.5rem;
}
.profile-preview {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  object-fit: cover;
  margin-bottom: 0.8rem;
  border: 3px solid #444;
  transition: all 0.3s ease;
}
.profile-preview:hover {
  transform: scale(1.05);
  border-color: #f39c12;
}
.upload-label {
  cursor: pointer;
  color: #ddd;
  font-size: 0.95rem;
  display: flex;
  align-items: center;
  gap: 6px;
  transition: all 0.3s ease;
}
.upload-label:hover {
  color: #f39c12;
  transform: scale(1.05);
}

/* Inputs */
.modal-input {
  width: 100%;
  padding: 1rem 1.2rem;
  margin-bottom: 1.25rem; /* uniform spacing */
  border-radius: 14px;
  border: 1px solid #333;
  background: linear-gradient(145deg, #1e1e1e, #232323);
  color: #fff;
  font-size: 1rem;
  outline: none;
  height: 3rem;
  box-sizing: border-box;
  transition: all 0.25s ease;
}
.modal-input:focus {
  border-color: #f39c12;
  background: linear-gradient(145deg, #252525, #2a2a2a);
  box-shadow: 0 0 10px rgba(243, 156, 18, 0.5);
}

/* Password + Eye Icon */
.password-container {
  position: relative;
  display: flex;
  align-items: center;
  margin-bottom: 1.25rem; /* same as other inputs */
}
.password-container .modal-input {
  width: 100%;
  padding: 1rem 1.2rem;
  margin-bottom: 0.1rem; /* uniform spacing */
  border-radius: 14px;
  border: 1px solid #333;
  background: linear-gradient(145deg, #1e1e1e, #232323);
  color: #fff;
  font-size: 1rem;
  outline: none;
  height: 3rem;
  box-sizing: border-box;
  transition: all 0.25s ease;
}
.password-eye {
  position: absolute;
  right: 12px;
  font-size: 1.4rem;
  cursor: pointer;
  color: #ccc;
  top: 50%;
  transform: translateY(-50%);
  transition: color 0.2s, transform 0.2s;
}
.password-eye:hover {
  color: #f39c12;
  transform: translateY(-50%) scale(1.2);
}

/* Buttons */
.modal-btn {
  display: block;
  width: 100%;
  padding: 0.85rem;
  margin-bottom: 1rem;
  background: linear-gradient(145deg, #2b2b2b, #313131);
  border: none;
  border-radius: 14px;
  color: #fff;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.25s ease;
  box-shadow: 0 4px 6px rgba(0,0,0,0.4);
}
.modal-btn:hover {
  background: linear-gradient(145deg, #313131, #383838);
  transform: translateY(-2px);
}
.logout-btn {
  background: linear-gradient(145deg, #b91c1c, #c0392b);
  box-shadow: 0 4px 8px rgba(192, 57, 43, 0.5);
}
.logout-btn:hover {
  background: linear-gradient(145deg, #c0392b, #e74c3c);
  transform: translateY(-2px);
}

/* Close Button */
.close-btn {
  position: absolute;
  top: 12px;
  right: 12px;
  cursor: pointer;
  color: #aaa;
  transition: color 0.2s ease;
}

/* Close Button */
.close-btn {
  position: absolute;
  right: 16px;
  top: 14px;
  cursor: pointer;
  color: #888;
  font-size: 1.4rem;
  transition: 0.2s ease;
}
.close-btn:hover {
  color: #b91c1c;
  transform: rotate(90deg);
}

/* === Animations === */
@keyframes fadeInPop {
  from {
    opacity: 0;
    transform: scale(0.85) translateY(10px);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

@keyframes borderGlow {
  0% { background-position: 0% 50%; }
  100% { background-position: 200% 50%; }
}

@keyframes btnPulse {
  0%, 100% { opacity: 0.1; }
  50% { opacity: 0.4; }
}

@keyframes pulseLine {
  0%, 100% { opacity: 0.5; transform: scaleX(1); }
  50% { opacity: 1; transform: scaleX(1.1); }
}

/* === Settings Icon === */
.settings-icon {
  cursor: pointer;
  display: flex;
  align-items: center;
  margin-top: -24px;
  justify-content: center;
  transform: translateY(-4px);
  transition: transform 0.25s ease, color 0.3s ease, text-shadow 0.3s ease;
}
.settings-icon:hover {
  color: #fff;
  text-shadow: 0 0 6px rgba(255, 255, 255, 0.5);
  transform: translateY(-6px) scale(1.15);
}

/* === Rotation Animation === */
.rotate {
  animation: spinBounce 0.6s cubic-bezier(0.45, 1.5, 0.5, 1);
}
@keyframes spinBounce {
  0% { transform: rotate(0deg) scale(1); }
  40% { transform: rotate(100deg) scale(1.2); }
  70% { transform: rotate(80deg) scale(0.95); }
  100% { transform: rotate(0deg) scale(1); }
}

/* View Profile Section */
.profile-view-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
}
.profile-view-section h3 {
  margin: 0;
  font-size: 1.3rem;
}
.profile-view-section p {
  margin: 0;
  font-size: 1rem;
  color: #ccc;
}

/* Score Cards */
.score-cards-container {
  display: flex;
  flex-wrap: wrap;
  gap: 0.8rem;
  justify-content: center;
  margin-top: 1rem;
}
.score-card {
  background: linear-gradient(145deg, #1e1e1e, #232323);
  padding: 0.8rem 1rem;
  border-radius: 12px;
  box-shadow: 0 3px 6px rgba(0,0,0,0.4);
  min-width: 100px;
  text-align: center;
  color: #fff;
  transition: transform 0.2s, box-shadow 0.2s;
}
.score-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 6px 12px rgba(0,0,0,0.5);
}
.score-card h4 {
  margin: 0 0 0.2rem 0;
  font-size: 1rem;
}
.score-card p {
  margin: 0;
  font-size: 0.9rem;
  color: #f39c12;
}

/* Make scores scrollable if too many */
.scrollable-scores {
  max-height: 220px; /* limits modal height */
  overflow-y: auto;
  padding-right: 4px; /* avoid scrollbar overlaying cards */
}

/* Smooth scrollbar styling */
.scrollable-scores::-webkit-scrollbar {
  width: 6px;
}
.scrollable-scores::-webkit-scrollbar-thumb {
  background: #f39c12;
  border-radius: 3px;
}
.scrollable-scores::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.05);
}

/* Optional: tweak score cards spacing */
.score-card {
  min-width: 110px;
  margin-bottom: 0.5rem;
}

.logout-confirm-modal {
  width: 320px;      /* mas maliit kaysa sa 580px ng iba */
  padding: 1.5rem 2rem;
  text-align: center;
}
.logout-confirm-modal p {
  font-size: 0.95rem;
}
.logout-confirm-modal .modal-btn {
  width: 100px;      /* mas maliit na buttons */
  padding: 0.6rem 0;
}

/* Base modal overlay ay pwede pa rin pareho */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.65);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 999;
  backdrop-filter: blur(5px);
}

/* Logout Modal Style */
.logout-modal {
  width: 320px;
  padding: 1.5rem 2rem;
  background: linear-gradient(145deg, #181818, #242424);
  border-radius: 18px;
  text-align: center;
}

/* Edit Profile Modal Style */
.edit-profile-modal {
  width: 580px;
  padding: 2.5rem;
  background: linear-gradient(145deg, #181818, #242424);
  border-radius: 18px;
  text-align: center;
}

/* View Profile Modal Style */
.view-profile-modal {
  width: 580px;
  padding: 2.5rem;
  background: linear-gradient(145deg, #181818, #242424);
  border-radius: 18px;
  text-align: center;
}

/* Circle Stat */
.circle-stat {
  position: relative; /* Needed for absolute positioning of label */
  width: 120px;
  height: 120px;
  display: flex;
  justify-content: center;
  align-items: center;
}

/* Centered Label Inside Circle */
.circle-stat-label {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%); /* Perfect center */
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  pointer-events: none; /* So clicking on label doesn’t interfere */
}

.circle-stat-label span {
  font-size: 0.75rem;
  color: #ccc;
}

.circle-stat-label strong {
  font-size: 1rem;
  color: #fff;
}

.chat-modal {
  width: 80vw;
  height: 80vh;
  max-width: 900px;
  display: flex;
  flex-direction: column;
  background: #1b1b1b;
  padding: 1.5rem;
  border-radius: 20px;
  box-shadow: 0 0 25px rgba(0, 0, 0, 0.6);
}

.chat-messages {
  flex: 1;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
  padding: 0.8rem 1rem;
}

/* Base message layout */
.chat-message {
  display: flex;
  align-items: flex-end;
  gap: 0.4rem;
  max-width: 70%;
}

/* Align own messages to the right */
.chat-message.own {
  align-self: flex-end;
  flex-direction: row-reverse;
  justify-content: flex-end;
}

/* Avatar (hidden for own messages) */
.chat-message.own .chat-avatar {
  display: none;
}

.chat-avatar {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid #3b82f6;
}

/* 🟢 Chat bubble style */
.chat-bubble {
  display: inline-block;
  padding: 0.4rem 0.8rem;
  border-radius: 14px;
  font-size: 0.9rem;
  line-height: 1.2;
  max-width: 100%;
  word-wrap: break-word;
  width: fit-content;
  background: #2b2b2b;
  color: #e4e4e4;
  box-shadow: 0 0 4px rgba(0, 0, 0, 0.3);
}

/* 💙 Your messages (gaming theme blue) */
.chat-message.own .chat-bubble {
  background: linear-gradient(135deg, #2563eb, #3b82f6);
  color: white;
  box-shadow: 0 0 8px rgba(59, 130, 246, 0.3);
  border-radius: 16px 16px 4px 16px;
}

/* 🟣 Other users' messages (darker, subtle contrast) */
.chat-message.other .chat-bubble {
  background: #1f1f1f;
  border: 1px solid #333;
  color: #ddd;
  border-radius: 16px 16px 16px 4px;
}

/* Username (only for others) */
.chat-message.other .chat-username {
  font-size: 0.75rem;
  color: #aaa;
  margin-bottom: 0.15rem;
  display: block;
}

.chat-message.own .chat-username {
  display: none;
}

/* Avatar */
.chat-avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid #3b82f6;
}

/* Chat bubble */
.chat-bubble {
  background: #2b2b2b;
  color: #eee;
  padding: 0.6rem 0.9rem;
  border-radius: 14px;
  word-wrap: break-word;
  line-height: 1.4;
  position: relative;
  font-size: 0.95rem;
  max-width: 100%;
}

/* Blue bubble for own messages */
.chat-message.own .chat-bubble {
  background: #3b82f6;
  color: #fff;
  border-bottom-right-radius: 6px;
  border-bottom-left-radius: 14px;
}

/* Dark gray bubble for others */
.chat-message.other .chat-bubble {
  background: #2f2f2f;
  color: #eaeaea;
  border-bottom-left-radius: 6px;
  border-bottom-right-radius: 14px;
}

/* Username above the bubble */
.chat-username {
  font-size: 0.75rem;
  font-weight: 500;
  color: #aaa;
  margin-bottom: 0.2rem;
  margin-left: 4px;
}

/* Input area */
.chat-input-section {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  padding-top: 1rem;
}

.chat-input-section input {
  flex: 1;
  padding: 0.8rem 1rem;
  border-radius: 12px;
  border: none;
  outline: none;
  background: #111;
  color: white;
  font-size: 1rem;
}

.chat-input-section input:focus {
  background: #1a1a1a;
}

.chat-input-section button {
  padding: 0.8rem 1.4rem;
  border: none;
  border-radius: 12px;
  background: #f39c12;
  color: white;
  font-weight: 600;
  cursor: pointer;
  transition: 0.2s ease;
}

.chat-input-section button:hover {
  background: #e67e22;
}

/* Scrollbar */
.chat-messages::-webkit-scrollbar {
  width: 8px;
}
.chat-messages::-webkit-scrollbar-thumb {
  background: #f39c12;
  border-radius: 4px;
}

.history-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 1rem;
}
.history-table th, .history-table td {
  padding: 8px 12px;
  border: 1px solid #444;
  text-align: left;
}
.history-table th {
  background: #333;
  color: #fff;
}
.history-table tbody tr:nth-child(even) {
  background: #222;
}

/* Overlay */
.history-overlay {
  position: fixed;
  inset: 0;
  background: rgba(20, 20, 30, 0.85);
  backdrop-filter: blur(4px);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999;
}

/* Modal Container */
.history-modal {
  background: linear-gradient(180deg, #1f1f2f 0%, #12121a 100%);
  border: 2px solid #7a5c2e; /* soft gold accent */
  border-radius: 16px;
  box-shadow: 0 0 25px rgba(255, 195, 77, 0.3);
  width: 420px;
  max-height: 70vh;
  padding: 20px 24px;
  overflow-y: auto;
  position: relative;
  animation: fadeIn 0.3s ease-in-out;
}

/* Close Button */
.history-close {
  position: absolute;
  top: 12px;
  right: 16px;
  background: none;
  border: none;
  color: #ccc;
  font-size: 20px;
  cursor: pointer;
  transition: 0.2s;
}
.history-close:hover {
  color: #ffd966; /* hover gold */
}

/* Title */
.history-title {
  text-align: center;
  color: #ffd966; /* gold title */
  font-size: 1.5rem;
  font-weight: bold;
  margin-bottom: 12px;
  letter-spacing: 1px;
}

/* Divider */
.history-divider {
  height: 2px;
  width: 80%;
  background: rgba(255, 214, 102, 0.3);
  margin: 0 auto 16px;
  border-radius: 1px;
}

/* Content Scroll Area */
.history-content {
  display: flex;
  flex-direction: column;
  gap: 12px;
  max-height: 50vh;
  overflow-y: auto;
  padding-right: 6px;
}

/* Each History Entry */
.history-card {
  background: rgba(40, 40, 55, 0.7);
  border: 1px solid rgba(255, 214, 102, 0.2);
  border-radius: 10px;
  padding: 12px 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: transform 0.2s, background 0.2s;
}

.history-card:hover {
  transform: scale(1.02);
  background: rgba(60, 50, 40, 0.6);
}

/* Highlight for most recent match */
.highlight-entry {
  border: 1px solid #ffd966;
  background: rgba(255, 214, 102, 0.15);
}

/* Left Section */
.history-left {
  display: flex;
  flex-direction: column;
  color: #e0c68d;
}

.history-game {
  font-weight: 600;
  color: #ffd966;
}

.history-date {
  font-size: 0.8rem;
  color: #c8b080;
}

/* Right Section */
.history-right {
  text-align: right;
  color: #fffacd;
}

.history-username {
  font-weight: 500;
  color: #ffcc70;
}

.history-score {
  font-size: 0.9rem;
  color: #ffe89c;
}

/* Empty State */
.no-history {
  color: #aaa;
  text-align: center;
  font-style: italic;
  padding: 20px 0;
}

/* Fade animation */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}
`}</style>
    </>
  );
}

export default PlayerInformation;