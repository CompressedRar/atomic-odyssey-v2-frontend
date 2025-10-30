// src/pages/VerifyEmail.jsx
import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { auth } from "../configs/FirebaseConfig";
import { applyActionCode, checkActionCode, reload } from "firebase/auth";
import Swal from "sweetalert2";

function VerifyEmail() {
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState(""); // "success", "error", "already"
  const [message, setMessage] = useState("");
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const mode = searchParams.get("mode");
    const oobCode = searchParams.get("oobCode");

    if (!mode || !oobCode) {
      setStatus("error");
      setMessage("Invalid verification link.");
      setLoading(false);
      return;
    }

    if (mode === "verifyEmail") {
      // Verify email
      applyActionCode(auth, oobCode)
        .then(() => {
          setStatus("success");
          setMessage("Your email has been successfully verified!");
          // Optionally reload user
          if (auth.currentUser) reload(auth.currentUser);
        })
        .catch((error) => {
          if (error.code === "auth/expired-action-code") {
            setStatus("error");
            setMessage("This verification link has expired.");
          } else if (error.code === "auth/invalid-action-code") {
            setStatus("error");
            setMessage("This verification link is invalid.");
          } else {
            setStatus("error");
            setMessage(error.message);
          }
        })
        .finally(() => setLoading(false));
    }
  }, [searchParams]);

  const handleLoginRedirect = () => {
    navigate("/"); // redirect to login page
  };

  if (loading) {
    return <div className="loading-screen">Verifying your email...</div>;
  }

  return (
    <div className="verify-container">
      <h2>{status === "success" ? "✅ Success!" : "❌ Error"}</h2>
      <p>{message}</p>
      <button onClick={handleLoginRedirect}>Go to Login</button>
    </div>
  );
}

export default VerifyEmail;