import React, { useEffect, useState } from "react";
import { getDatabase, ref, onValue, remove } from "firebase/database";
import "../styles/AdminDashboard.css"; // reuse dark theme styles

export default function AdminChatLogs() {
  const [messages, setMessages] = useState([]);
  const [search, setSearch] = useState("");

  // 🔹 Fetch all global chat messages in real-time
  useEffect(() => {
    const db = getDatabase();
    const chatRef = ref(db, "globalChat");

    const unsubscribe = onValue(chatRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        const chatArray = Object.entries(data).map(([id, msg]) => ({
          id,
          ...msg,
        }));

        // Sort by timestamp (latest first)
        chatArray.sort((a, b) => b.timestamp - a.timestamp);
        setMessages(chatArray);
      } else {
        setMessages([]);
      }
    });

    return () => unsubscribe();
  }, []);

  // 🔹 Delete message from database
  const handleDeleteMessage = async (id) => {
    if (!window.confirm("Are you sure you want to delete this message?")) return;

    try {
      const db = getDatabase();
      await remove(ref(db, `globalChat/${id}`));
      alert("Message deleted successfully!");
    } catch (error) {
      console.error("Error deleting message:", error);
      alert("Failed to delete message.");
    }
  };

  // 🔹 Filter messages by username or message text
  const filteredMessages = messages.filter(
    (msg) =>
      msg.username?.toLowerCase().includes(search.toLowerCase()) ||
      msg.message?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="main">
      {/* Header */}
      <header className="header">
        <h1>Chat Logs</h1>
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search messages or usernames..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </header>

      {/* Chat Logs Table */}
      <section className="table-section">
        <h2>Global Chat Logs</h2>

        {filteredMessages.length === 0 ? (
          <p className="text-center">No messages found.</p>
        ) : (
          <table className="user-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Profile</th>
                <th>Username</th>
                <th>Message</th>
                <th>Timestamp</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredMessages.map((msg, index) => (
                <tr key={msg.id}>
                  <td>{index + 1}</td>
                  <td>
                    <img
                      src={
                        msg.profilePic ||
                        "https://cdn-icons-png.flaticon.com/512/847/847969.png"
                      }
                      alt="profile"
                      className="profile-pic"
                    />
                  </td>
                  <td>{msg.username || "Unknown"}</td>
                  <td style={{ maxWidth: "300px", wordBreak: "break-word" }}>
                    {msg.message}
                  </td>
                  <td>
                    {msg.timestamp
                      ? new Date(msg.timestamp).toLocaleString()
                      : "N/A"}
                  </td>
                  <td>
                    <button
                      className="btn-small btn-red"
                      onClick={() => handleDeleteMessage(msg.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </div>
  );
}
