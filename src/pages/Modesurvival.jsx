import { useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Modesurvival.css";
import BackgroundVideo from "../components/BackgroundVideo";

const Modesurvival = () => {
  const navigate = useNavigate();

  const handleExit = () => {
    navigate(-1);
  };

  const audioRef = useRef(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (audio) {
      audio.volume = 0.3; // 🎧 adjust volume here
      const playAudio = () => {
        audio.play().catch(() => {
          console.warn("Autoplay blocked. Waiting for user interaction...");
        });
      };

      playAudio();

      // fallback in case browser blocks autoplay
      const handleInteraction = () => {
        audio.play().catch(() => { });
        document.removeEventListener("click", handleInteraction);
      };
      document.addEventListener("click", handleInteraction);
    }
  }, []);

  return (
    <div className="Modesurvival-container">
      <BackgroundVideo />

      <audio
        ref={audioRef}
        src="videos/sound.mp4"
        loop
        autoPlay
        style={{ display: "none" }}
      />

      <div
        className="top-buttons"
        style={{ position: "fixed", top: "10px", left: "10px", zIndex: 999 }}
      >
        <button
          className="exit-btn"
          onClick={handleExit}
          style={{
            fontSize: "1.5rem",
            padding: "10px 15px",
            borderRadius: "8px",
            background: "transparent",
            color: "#fff",
            fontWeight: "bold",
            cursor: "pointer",
          }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.background = "rgba(255,255,255,0.2)")
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.background = "transparent")
          }
        >
          ←
        </button>
      </div>

      <h1 className="title">Select Difficulty Level</h1>

      <div className="button-group">
        <button
          className="Modesurvival-btn easy"
          onClick={() => navigate("/endless")}
        >
          Normal
        </button>
        <button
          className="Modesurvival-btn hard"
          onClick={() => navigate("/shard")}
        >
          Hard
        </button>
      </div>
    </div>
  );
};

export default Modesurvival;