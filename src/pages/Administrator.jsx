import React, { useState, useEffect } from "react";
import "../styles/AdminDashboard.css";
import UsersPage from "./UsersPage";
import AdminLeaderboard from "./AdminLeaderboard";
import AdminChatLogs from "./AdminChatLogs";
import { auth } from "../configs/FirebaseConfig";
import { getDatabase, ref, get } from "firebase/database";
import { onAuthStateChanged, signOut } from "firebase/auth";
import Swal from "sweetalert2";

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [adminInfo, setAdminInfo] = useState(null);

  // 🔹 Fetch currently logged-in admin info
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) return;

      try {
        const db = getDatabase();
        const snapshot = await get(ref(db, "users/" + user.uid));
        let userData = {};
        if (snapshot.exists()) userData = snapshot.val();

        setAdminInfo({
          username: userData.username || user.displayName || user.email?.split("@")[0],
          email: user.email,
          profilePic:
            userData.profilePic ||
            user.photoURL ||
            "https://cdn-icons-png.flaticon.com/512/847/847969.png",
        });
      } catch (error) {
        console.error("Error fetching admin info:", error);
      }
    });

    return () => unsubscribe();
  }, []);

  // 🔹 Fetch users from backend
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch("http://127.0.0.1:5000/api/user/get-all");
        const data = await res.json();
        if (data.success) {
          setUsers(data.users);
        } else {
          console.error("Failed to load users:", data.error);
        }
      } catch (err) {
        console.error("Error fetching users:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  // 🔹 Compute dashboard stats
  const totalUsers = users.length;
  const activeUsers = users.filter((u) => !u.disabled).length;
  const disabledUsers = totalUsers - activeUsers;
  const recentUsers = [...users].slice(-5).reverse();

  // 🔹 Handle logout
  const handleLogout = async () => {
    const result = await Swal.fire({
      title: "Confirm Logout",
      text: "Are you sure you want to logout?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#555",
      confirmButtonText: "Yes, Logout",
      background: "#1a1a1a",
      color: "#fff",
    });

    if (result.isConfirmed) {
      try {
        await signOut(auth);
        Swal.fire({
          title: "Logged Out",
          text: "You have been successfully logged out.",
          icon: "success",
          background: "#1a1a1a",
          color: "#fff",
          confirmButtonColor: "#27ae60",
          timer: 1500,
          showConfirmButton: false,
        });
        window.location.href = "/";
      } catch (error) {
        Swal.fire({
          title: "Error",
          text: "Failed to logout. Please try again.",
          icon: "error",
          background: "#1a1a1a",
          color: "#fff",
          confirmButtonColor: "#e74c3c",
        });
        console.error("Logout failed:", error);
      }
    }
  };

  return (
    <div className="admin-dashboard">
      {/* Sidebar */}
      <aside className="sidebar">
        <h2 className="logo">Atomic Odyssey</h2>

        <nav className="nav">
          <a
            href="#"
            className={`nav-link ${activeTab === "dashboard" ? "active" : ""}`}
            onClick={() => setActiveTab("dashboard")}
          >
            <span className="material-icons icon">dashboard</span> Dashboard
          </a>
          <a
            href="#"
            className={`nav-link ${activeTab === "users" ? "active" : ""}`}
            onClick={() => setActiveTab("users")}
          >
            <span className="material-icons icon">people</span> Users
          </a>
          <a
            href="#"
            className={`nav-link ${activeTab === "leaderboards" ? "active" : ""}`}
            onClick={() => setActiveTab("leaderboards")}
          >
            <span className="material-icons icon">emoji_events</span> Leaderboards
          </a>
          <a
            href="#"
            className={`nav-link ${activeTab === "chats" ? "active" : ""}`}
            onClick={() => setActiveTab("chats")}
          >
            <span className="material-icons icon">chat</span> Chat Logs
          </a>
        </nav>

        <div className="logout">
          <a href="#" className="nav-link logout-link" onClick={handleLogout}>
            <span className="material-icons icon">logout</span> Logout
          </a>
        </div>
      </aside>

      {/* Main Content */}
      {activeTab === "dashboard" ? (
        <main className="main">
          <header className="header">
            <h1>Admin Dashboard</h1>

            <div className="admin-profile">
              <img
                src={
                  adminInfo?.profilePic ||
                  "https://cdn-icons-png.flaticon.com/512/847/847969.png"
                }
                alt="Admin"
                className="profile-pic"
                style={{
                  width: "40px",
                  height: "40px",
                  borderRadius: "50%",
                  objectFit: "cover",
                  marginRight: "10px",
                }}
              />
              <div>
                <strong>{adminInfo?.username || "Admin"}</strong>
                <p
                  style={{
                    fontSize: "0.8rem",
                    color: "#aaa",
                    margin: 0,
                  }}
                >
                  {adminInfo?.email}
                </p>
              </div>
            </div>
          </header>

          {/* Stats Row */}
          <section className="stats">
            <div className="card">
              <div>
                <h4>Total Users</h4>
                <p className="stat-number">{loading ? "..." : totalUsers}</p>
              </div>
              <span className="material-icons stat-icon">people</span>
            </div>

            <div className="card">
              <div>
                <h4>Active Users</h4>
                <p className="stat-number">{loading ? "..." : activeUsers}</p>
              </div>
              <span className="material-icons stat-icon">verified_user</span>
            </div>

            <div className="card">
              <div>
                <h4>Disabled Users</h4>
                <p className="stat-number">{loading ? "..." : disabledUsers}</p>
              </div>
              <span className="material-icons stat-icon">person_off</span>
            </div>
          </section>

          {/* Recent Users Table */}
          <section className="table-section">
            <h2>Recent Users</h2>

            {loading ? (
              <p>Loading users...</p>
            ) : (
              <table className="user-table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Profile</th>
                    <th>Username</th>
                    <th>Email</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {recentUsers.length > 0 ? (
                    recentUsers.map((user, index) => (
                      <tr key={user.uid}>
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
                        <td>{user.email || "N/A"}</td>
                        <td>
                          <span
                            className={`badge ${
                              user.disabled ? "banned" : "active"
                            }`}
                          >
                            {user.disabled ? "Disabled" : "Active"}
                          </span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" className="text-center">
                        No users found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            )}
          </section>
        </main>
      ) : null}

      {activeTab === "users" && <UsersPage />}
      {activeTab === "leaderboards" && <AdminLeaderboard />}
      {activeTab === "chats" && <AdminChatLogs />}
    </div>
  );
}
