import { useState, useEffect } from "react";
import { auth } from "../configs/FirebaseConfig";
import {
    createUserWithEmailAndPassword,
    sendEmailVerification,
    signOut,
} from "firebase/auth";
import { getDatabase, ref, set } from "firebase/database";
import "../styles/Login.css";
import "../styles/SignUp.css";
import "../styles/animations.css";
import msg from "../components/CustomAlerts.js";
import Swal from "sweetalert2";
import BackgroundVideo from "../components/BackgroundVideo.jsx";

function SignUpPage() {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [profile, setProfile] = useState(null);
    const [profileBoxText, setProfileBoxText] = useState("Add Image");
    const [preview, setPreview] = useState(null);
    const [isLoading, setLoading] = useState(false);

    const toggleShowPassword = () => setShowPassword((prev) => !prev);

    const handleProfilePicture = (e) => {
        const file = e.target.files[0];
        if (file) {
            setProfile(file);
            setPreview(URL.createObjectURL(file));
            setProfileBoxText("");
        } else {
            setProfileBoxText("Add Image");
            setProfile(null);
            setPreview(null);
        }
    };

    useEffect(() => {
        return () => {
            if (preview) URL.revokeObjectURL(preview);
        };
    }, [preview]);

    const handleSignUp = async (e) => {
        e.preventDefault();

        // Validation
        if (!username.trim()) return msg.Error("Username must not be empty.");
        if (!email.trim()) return msg.Error("Email must not be empty.");
        if (!profile) return msg.Error("Profile image must be uploaded.");
        if (password !== confirmPassword) return msg.Error("Passwords must match.");
        if (password.length < 8) return msg.Error("Password must be at least 8 characters.");

        setLoading(true);

        try {
            // Convert profile to Base64
            const toBase64 = (file) =>
                new Promise((resolve, reject) => {
                    const reader = new FileReader();
                    reader.readAsDataURL(file);
                    reader.onload = () => resolve(reader.result);
                    reader.onerror = (err) => reject(err);
                });

            const profileBase64 = await toBase64(profile);

            // 1️⃣ Create user
            const userCredentials = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredentials.user;

            // 2️⃣ Send email verification
            try {
                await sendEmailVerification(user, {
                    url: "https://tofis-app.web.app/verify-email", // your verification page
                });
                console.log("✅ Verification email sent to:", email);
            } catch (verificationError) {
                console.error("❌ Failed to send verification email:", verificationError);
                msg.Error("Failed to send verification email. Please try again later.");
            }

            // 3️⃣ Save user info to Realtime Database
            const db = getDatabase();
            await set(ref(db, "users/" + user.uid), {
                username,
                email,
                profilePic: profileBase64,
                mmr: 0,
                stars: 0,
                verified: false,
            });

            // 4️⃣ Sign out immediately
            await signOut(auth);

            // 5️⃣ Show success Swal
            Swal.fire({
                icon: "success",
                title: "Account Created!",
                html: "A verification email has been sent. Please verify your email before logging in.",
                confirmButtonText: "Continued",
            }).then(() => {
                window.location.href = "/";
            });

            // 6️⃣ Reset form
            setUsername("");
            setEmail("");
            setPassword("");
            setConfirmPassword("");
            setProfile(null);
            setProfileBoxText("Add Image");
            setPreview(null);

        } catch (error) {
            console.error("❌ Sign up failed:", error);

            // ✅ Handle "email already in use"
            if (error.code === "auth/email-already-in-use") {
                msg.Error("This email is already registered. Please use another email or login.");
            } else {
                msg.Error(error.message);
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div id="main-wrapper" className="sign-wrapper">
            <div
                className="loading-screen"
                style={{ display: isLoading ? "flex" : "none" }}
            >
                <span className="material-symbols-outlined" id="loading-icon">
                    progress_activity
                </span>
                <label>Processing...</label>
            </div>

            <BackgroundVideo />

            <div className="sign-up-container">
                <form onSubmit={handleSignUp} className="sign-up-form">
                    <div className="title-container">
                        <h1>Register to</h1>
                        <h1 id="title">Atomic Odyssey</h1>
                    </div>

                    <div className="textbox profile-container">
                        <span>Profile Picture</span>
                        <input
                            type="file"
                            id="profile-picture"
                            onChange={handleProfilePicture}
                            accept="image/*"
                            hidden
                        />
                        <label htmlFor="profile-picture" className="profile-button">
                            {profileBoxText}
                            {preview && (
                                <img src={preview} alt="preview" id="profile-image-container" />
                            )}
                        </label>
                    </div>

                    <div className="textbox">
                        <span>Username</span>
                        <input
                            type="text"
                            placeholder="John Doe"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />
                    </div>

                    <div className="textbox">
                        <span>Email</span>
                        <input
                            type="email"
                            placeholder="johndoe@gmail.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>

                    <div className="textbox">
                        <span>Password</span>
                        <input
                            type={showPassword ? "text" : "password"}
                            placeholder="8 characters or more..."
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>

                    <div className="textbox">
                        <span>Confirm Password</span>
                        <input
                            type={showPassword ? "text" : "password"}
                            placeholder="8 characters or more..."
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                        />
                    </div>

                    <div className="login-options">
                        <div className="remember-container">
                            <input type="checkbox" id="remember" />
                            <label htmlFor="remember" onClick={toggleShowPassword}>
                                Show Password
                            </label>
                        </div>
                    </div>

                    <button id="login-button" type="submit">
                        Register
                    </button>

                    <span id="new-account-link">
                        Already have an account? <a href="/">Click here.</a>
                    </span>
                </form>
            </div>
        </div>
    );
}

export default SignUpPage;