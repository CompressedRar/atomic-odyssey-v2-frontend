import { useState } from "react";
import { auth } from "../configs/FirebaseConfig";
import {
  signInWithEmailAndPassword,
  sendEmailVerification,
  sendPasswordResetEmail,
} from "firebase/auth";
import { getDatabase, ref, get } from "firebase/database"; // ✅ Import RTDB
import "../styles/App.css";
import "../styles/Login.css";
import msg from "../components/CustomAlerts.js";
import BackgroundVideo from "../components/BackgroundVideo.jsx";

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState("password");
  const [isLoading, setLoading] = useState("none");
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [resetEmail, setResetEmail] = useState("");

  // === LOGIN FUNCTION ===
  const handleSignIn = async (e) => {
    e.preventDefault();
    setLoading("flex");
    try {
      const userCredentials = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredentials.user;

      if (!user.emailVerified) {
        await auth.signOut();
        msg.Error("Please verify your email before logging in.");

        setTimeout(async () => {
          await sendEmailVerification(user);
          msg.Success("A new verification email has been sent to your inbox.");
        }, 1000);

        setLoading("none");
        return;
      }

      // ✅ Check if user is admin
      const db = getDatabase();
      const userRef = ref(db, "users/" + user.uid);
      const snapshot = await get(userRef);

      if (snapshot.exists()) {
        const userData = snapshot.val();
        if (userData.isAdmin === true) {
          msg.Success("Welcome, Admin!");
          window.location.replace("/admin");
        } else {
          msg.Success("Login successful!");
          window.location.replace("/main");
        }
      } else {
        msg.Error("User record not found in database.");
        await auth.signOut();
      }
    } catch (error) {
      console.error("Login Error:", error);
      msg.Error("The email or password is incorrect.");
    } finally {
      setLoading("none");
    }
  };

  // === PASSWORD TOGGLE ===
  const toggleShowPassword = () =>
    setShowPassword((prev) => (prev === "password" ? "text" : "password"));

  // === FORGOT PASSWORD SEND FUNCTION ===
  const handleForgotPassword = async (e) => {
    e.preventDefault();

    if (!resetEmail) {
      msg.Error("Please enter your email.");
      return;
    }

    try {
      setLoading("flex");
      await sendPasswordResetEmail(auth, resetEmail);
      msg.Success("Password reset email sent! Check your inbox.");
      setShowForgotModal(false);
      setResetEmail("");
    } catch (error) {
      if (error.code === "auth/invalid-email") {
        msg.Error("Invalid email format.");
      } else if (error.code === "auth/user-not-found") {
        msg.Error("No account found with this email.");
      } else {
        msg.Error("Error sending password reset email.");
      }
    } finally {
      setLoading("none");
    }
  };

  return (
    <div id="main-wrapper" className="login-wrapper">
      {/* Loading Screen */}
      <div className="loading-screen" style={{ display: isLoading }}>
        <span className="material-symbols-outlined" id="loading-icon">
          progress_activity
        </span>
        <label>Processing...</label>
      </div>

      <video
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        className="background-video"
      >
        <source src="/videos/3.mp4" type="video/mp4" />
      </video>

      {/* === Forgot Password Modal === */}
      {showForgotModal && (
        <div className="modal-overlay" onClick={() => setShowForgotModal(false)}>
          <div
            className="forgot-password-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <span
              className="material-symbols-outlined close-btn"
              onClick={() => setShowForgotModal(false)}
            >
              close
            </span>
            <h2>Forgot Password?</h2>
            <div className="modal-divider"></div>
            <p className="forgot-desc">
              Enter your registered email to receive an account recovery link.
            </p>

            <div className="forgot-input-group">
              <input
                type="email"
                className="modal-input"
                placeholder="Enter your email..."
                value={resetEmail}
                onChange={(e) => setResetEmail(e.target.value)}
              />

              <button className="modal-btn" onClick={handleForgotPassword}>
                Send Recovery Link
              </button>
            </div>
          </div>
        </div>
      )}

      {/* === MAIN LOGIN FORM === */}
      <div className="login-container">
        <div className="login-form-container">
          <form onSubmit={handleSignIn} className="login-form">
            <div className="title-container">
              <h1>Login to</h1>
              <h1 id="title">Atomic Odyssey</h1>
            </div>

            <div className="textbox">
              <span>Email</span>
              <input
                type="email"
                placeholder="johndoe@gmail.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="textbox">
              <span>Password</span>
              <input
                type={showPassword}
                placeholder="Password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <div className="login-options">
              <div className="remember-container">
                <input type="checkbox" id="remember" />
                <label htmlFor="remember" onClick={toggleShowPassword}>
                  Show Password
                </label>
              </div>
              <div className="forgot-container">
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    setShowForgotModal(true);
                  }}
                >
                  Forgot Password?
                </a>
              </div>
            </div>

            <button id="login-button">Login</button>
          </form>

          <span id="new-account-link">
            Don&apos;t have an account? <a href="/register">Click here.</a>
          </span>
        </div>
      </div>

      {/* === Styles (same as before) === */}
      <style>{`
/* === Forgot Password Modal === */
.forgot-password-modal {
  position: relative;
  width: 440px;
  max-width: 90%;
  background: radial-gradient(circle at top left, #1b1b1b, #0d0d0d);
  border: 1px solid rgba(0, 255, 200, 0.15);
  color: #fff;
  border-radius: 22px;
  padding: 2.2rem 2.4rem;
  box-shadow: 0 0 40px rgba(0, 255, 200, 0.08);
  text-align: center;
  animation: fadeInPop 0.35s ease-out;
  overflow: hidden;
}

.modal-divider {
  width: 60%;
  height: 2px;
  background: linear-gradient(90deg, transparent, #00ffc8, transparent);
  margin: 0 auto 1.4rem;
  border-radius: 2px;
  animation: pulseLine 2.2s infinite ease-in-out;
}

.login-form-container {
  background: rgba(0, 0, 0, 0.65);
  padding: 2rem 2.5rem;
  border-radius: 20px;
  box-shadow: 0 0 30px rgba(0, 0, 0, 0.5);
  border: 1px solid rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(8px);
  color: #fff;
  background: rgba(20, 20, 20, 0.55);
  backdrop-filter: blur(5px);
}

.forgot-desc {
  font-size: 0.96rem;
  color: #cfcfcf;
  margin-bottom: 1.8rem;
  line-height: 1.55;
  letter-spacing: 0.3px;
}

.forgot-container a {
  color: #4d7eff;
  text-decoration: none;
  transition: 0.3s ease;
}
.forgot-container a:hover {
  color: #00ff84;
  text-decoration: underline;
}

.modal-input {
  flex: 1;
  min-width: 230px;
  background: #111;
  border: 1px solid rgba(255, 255, 255, 0.15);
  color: #fff;
  padding: 0.9rem 1.2rem;
  border-radius: 14px;
  transition: all 0.25s ease;
  font-size: 0.95rem;
  outline: none;
}
.modal-input:focus {
  border-color: #00ffc8;
  box-shadow: 0 0 16px rgba(0, 255, 200, 0.4);
  transform: scale(1.02);
}

.modal-btn {
  background: linear-gradient(145deg, #00ffc8, #00b89e);
  color: #000;
  font-weight: 700;
  border: none;
  margin-top: 5px;
  border-radius: 14px;
  padding: 0.95rem 1.3rem;
  cursor: pointer;
  transition: all 0.3s ease;
}
.modal-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 0 25px rgba(0, 255, 200, 0.5);
}
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
  color: #00ffc8;
  transform: rotate(90deg);
}
@keyframes fadeInPop {
  from { opacity: 0; transform: scale(0.85) translateY(10px); }
  to { opacity: 1; transform: scale(1) translateY(0); }
}
@keyframes pulseLine {
  0%, 100% { opacity: 0.5; transform: scaleX(1); }
  50% { opacity: 1; transform: scaleX(1.1); }
}
`}</style>
    </div>
  );
}

export default LoginPage;
