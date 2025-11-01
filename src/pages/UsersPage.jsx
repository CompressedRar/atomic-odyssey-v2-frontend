import React, { useEffect, useState } from "react";
import { ref, onValue, update } from "firebase/database";
import { db } from "../configs/FirebaseConfig";
import "../styles/AdminDashboard.css";

export default function UsersPage() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [sortField, setSortField] = useState("username");
  const [sortOrder, setSortOrder] = useState("asc");
  const [loading, setLoading] = useState(false);

  // 🔹 Load users from Realtime Database
  useEffect(() => {
  const fetchUsers = async () => {
    try {
      const res = await fetch("http://127.0.0.1:5000/api/user/get-all");
      const data = await res.json();
      if (data.success) {
        setUsers(data.users);
      } else {
        alert("Failed to load users: " + data.error);
      }
    } catch (err) {
      console.error(err);
      alert("Error connecting to backend.");
    }
  };
  fetchUsers();
}, []);

  // 🔹 Handle disable / enable user via Flask Admin API
  const handleDisableToggle = async (uid, currentStatus) => {
    const confirmMsg = currentStatus
      ? "Reactivate this account?"
      : "Disable this account?";
    if (!window.confirm(confirmMsg)) return;

    setLoading(true);
    try {
      const res = await fetch("http://127.0.0.1:5000/api/user/disable", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ uid, disabled: !currentStatus }),
      });

      const data = await res.json();
      if (data.success) {
        alert(data.message);

        // Reflect the change in local Firebase (for immediate UI feedback)
        await update(ref(db, `users/${uid}`), { disabled: !currentStatus });

        // Update local UI without full refresh
        setUsers((prev) =>
          prev.map((user) =>
            user.uid === uid ? { ...user, disabled: !currentStatus } : user
          )
        );
      } else {
        alert("Error: " + data.error);
      }
    } catch (err) {
      console.error(err);
      alert("Failed to connect to backend.");
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Filter & Sort logic
  const filteredUsers = users
    .filter(
      (u) =>
        u.username?.toLowerCase().includes(search.toLowerCase()) ||
        u.email?.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => {
      let valA = a[sortField] || "";
      let valB = b[sortField] || "";
      if (sortField === "mmr") {
        valA = parseInt(valA) || 0;
        valB = parseInt(valB) || 0;
      }
      if (valA < valB) return sortOrder === "asc" ? -1 : 1;
      if (valA > valB) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });

  const toggleSort = (field) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  return (
    <div className="main">
      <header className="header">
        <h1>Users</h1>
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search by username or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </header>

      <section className="table-section">
        <table className="user-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Profile</th>
              <th onClick={() => toggleSort("username")} className="sortable">
                Username{" "}
                {sortField === "username" && (sortOrder === "asc" ? "▲" : "▼")}
              </th>
              <th>Email</th>
              <th onClick={() => toggleSort("mmr")} className="sortable">
                MMR {sortField === "mmr" && (sortOrder === "asc" ? "▲" : "▼")}
              </th>
              <th>Stars</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {filteredUsers.length > 0 ? (
              filteredUsers.map((user, index) => (
                <tr key={user.id}>
                  <td>{index + 1}</td>
                  <td>
                    <img
                      src={
                        user.profilePic ||
                        "https://cdn-icons-png.flaticon.com/512/847/847969.png"
                      }
                      alt="profile"
                      className="profile-pic"
                    />
                  </td>
                  <td>{user.username || "N/A"}</td>
                  <td>{user.email}</td>
                  <td>{user.mmr ?? 0}</td>
                  <td>{user.stars ?? 0}</td>
                  <td>
                    <span
                      className={`badge ${
                        user.disabled ? "banned" : "active"
                      }`}
                    >
                      {user.disabled ? "Disabled" : "Active"}
                    </span>
                  </td>
                  <td>
                    <button
                      className={`btn-small ${
                        user.disabled ? "btn-green" : "btn-red"
                      }`}
                      onClick={() =>
                        handleDisableToggle(user.uid, user.disabled)
                      }
                      disabled={loading}
                    >
                      {loading
                        ? "Processing..."
                        : user.disabled
                        ? "Enable"
                        : "Disable"}
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" className="text-center">
                  No users found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </section>
    </div>
  );
}
