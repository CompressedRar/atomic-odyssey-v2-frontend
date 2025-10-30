import { useState } from "react";
import { auth } from "../configs/FirebaseConfig";
import {
  signInWithEmailAndPassword,
  sendEmailVerification,
  sendPasswordResetEmail,
} from "firebase/auth";
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

      msg.Success("Login successful!");
      window.location.replace("/main");
    } catch (error) {
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
              Enter your registered email to receive a account recovery link.
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
            Don't have an account? <a href="/register">Click here.</a>
          </span>
        </div>
      </div>

      {/* CSS */}
      <style>{`
/* === Forgot Password Modal (Interactive Version) === */
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

/* Divider */
.modal-divider {
  width: 60%;
  height: 2px;
  background: linear-gradient(90deg, transparent, #00ffc8, transparent);
  margin: 0 auto 1.4rem;
  border-radius: 2px;
  animation: pulseLine 2.2s infinite ease-in-out;
}

/* === Main Login Container Background Enhancement === */
.login-form-container {
  background: rgba(0, 0, 0, 0.65); /* dark semi-transparent background */
  padding: 2rem 2.5rem;
  border-radius: 20px;
  box-shadow: 0 0 30px rgba(0, 0, 0, 0.5);
  border: 1px solid rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(8px); /* adds a soft glassy blur effect */
  color: #fff; /* makes labels and text visible */
  background: rgba(20, 20, 20, 0.55);
  backdrop-filter: blur(5px);
}

/* Description */
.forgot-desc {
  font-size: 0.96rem;
  color: #cfcfcf;
  margin-bottom: 1.8rem;
  line-height: 1.55;
  letter-spacing: 0.3px;
}

.forgot-container {
  display: flex;
  align-items: center;
  justify-content: flex-end; /* optional — if you want it right-aligned */
  font-size: 0.96rem;
  white-space: nowrap; /* ✅ prevents line break */
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

/* Input Group */
.forgot-input-group {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.8rem;
  flex-wrap: wrap;
}

/* Input */
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

/* Button */
.modal-btn {
  background: linear-gradient(145deg, #00ffc8, #00b89e);
  color: #000;
  font-weight: 700;
  letter-spacing: 0.3px;
  border: none;
  margin-top: 5px;
  border-radius: 14px;
  padding: 0.95rem 1.3rem;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 0 18px rgba(0, 255, 200, 0.2);
  position: relative;
  overflow: hidden;
}
.modal-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 0 25px rgba(0, 255, 200, 0.5);
}
.modal-btn:active {
  transform: scale(0.97);
}

/* Glowing pulse inside button */
.modal-btn::after {
  content: "";
  position: absolute;
  inset: 0;
  background: rgba(255, 255, 255, 0.2);
  opacity: 0;
  transition: opacity 0.3s;
}
.modal-btn:hover::after {
  opacity: 1;
  animation: btnPulse 1.5s infinite ease-in-out;
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
  color: #00ffc8;
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
`}</style>
    </div>
  );
}

export default LoginPage;