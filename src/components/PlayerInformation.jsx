import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../configs/FirebaseConfig";
import { getDatabase, ref, get, update, onValue, push, set } from "firebase/database";
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
        const gamesPlayedData = {}; // ✅ new object to store gamesPlayed

        for (const mode of gameModes) {
          const leaderboardSnap = await get(ref(db, `leaderboards/${mode}/${user.uid}`));

          if (leaderboardSnap.exists()) {
            const data = leaderboardSnap.val();
            scores[mode] = data.score || 0;
            gamesPlayedData[mode] = data.gamesPlayed || 0; // ✅ add this
          } else {
            scores[mode] = 0;
            gamesPlayedData[mode] = 0; // ✅ default to 0
          }
        }

        // ✅ Compute totals
        const scoreValues = Object.values(scores);
        const totalScore = scoreValues.reduce((acc, val) => acc + val, 0);

        const totalMatches = Object.values(gamesPlayedData).reduce(
          (acc, val) => acc + val,
          0
        );

        const avgScore =
          totalMatches > 0 ? (totalScore / totalMatches).toFixed(1) : 0;

        const masteryPoints = Math.round(totalScore / 10);

        // ✅ Set userInfo state
        setUserInfo({
          ...userData,
          email: user.email,
          scores,
          gamesPlayedData, // ✅ optional, if you want to display per mode
          totalMatches,
          avgScore,
          masteryPoints,
        });

        // ✅ Set edit data
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

      if (editData.email && editData.email !== user.email)
        await updateEmail(user, editData.email);
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

  // 🔥 Global Chat states
  const [showGlobalChat, setShowGlobalChat] = useState(false);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const db = getDatabase();

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
      setShowSettings(true); // ✅ open the correct modal
    }, 400);
  };

  const handleBackgroundChange = (newBg) => {
    setBackground(newBg);
    update(ref(db, `players/${auth.currentUser.uid}`), { background: newBg });
  };

  // 🔴 GLOBAL CHAT – Realtime listener
  useEffect(() => {
    if (!showGlobalChat) return;
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
    return () => unsubscribe();
  }, [showGlobalChat]);

  const handleSendMessage = async () => {
    if (!message.trim()) return;
    const user = auth.currentUser;
    if (!user) return;

    try {
      // 🔥 Get user data from Realtime Database (for accurate username + profilePic)
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
    return <div className="player-info-container">Loading player info...</div>;

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
          <span className="player-ign">
            <span>{userInfo.username}</span>
            <span className="additional-player-info">
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
            <button className="modal-btn" onClick={handleViewProfile}>
              View Profile
            </button>
            <button className="modal-btn" onClick={handleEditAccount}>
              Edit Account
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
          <div id = "chat-container" className="settings-modal chat-modal"  onClick={(e) => e.stopPropagation()}>
            <span
              className="close-btn material-symbols-outlined"
              onClick={() => setShowGlobalChat(false)}
            >
              close
            </span>

            <h2>Global Chat</h2>
            <div className="modal-divider"></div>

            <div className="chat-messages">
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

`}</style>
    </>
  );
}

export default PlayerInformation;