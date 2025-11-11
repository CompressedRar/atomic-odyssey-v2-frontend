import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Quizzes.css";
import "../styles/animations.css";
import Competitive from "./Competitive";
import MatchmakingLobby from "./MatchMakingLobby";
import BattleRoom from "./BattleRoom";

function Quizzes() {
  const navigate = useNavigate();
  const [roomInfo, setRoomInfo] = useState(null);

  const handleModeClick = (mode) => {
    switch (mode) {
      case "time": navigate("/difficulty"); break;
      case "classic": navigate("/main"); break;
      case "modesurvival": navigate("/modesurvival"); break;
      case "fusion": navigate("/fusion"); break;
      case "nonmetals": navigate("/nonmetals"); break;
      case "metalloids": navigate("/metalloids"); break;
      case "metals": navigate("/metals"); break;
      case "noblegas": navigate("/noblegas"); break;
      case "pvp": navigate("/pvp"); break;
      case "playground": navigate("/playground"); break;
      default: break;
    }
  };

  // 🔹 Callback to cancel match from MatchmakingLobby
  const handleCancelMatch = () => {
    setRoomInfo(null); // resets the BattleRoom display
  };

  return (
    <div className="quizzes-container">
      <h1>Game Modes</h1>
      <div className="quiz-modes-container">

        {/* Fusion Mode */}
        <span className="quiz-mode" id="fusion" onClick={() => handleModeClick("fusion")}>
          <div className="quiz-bg"></div>
          <div className="quiz-grad"></div>
          <div className="quiz-desc">
            <span className="mode-name">Fusion</span>
            <span className="mode-desc">Mix and feel the thrill of creating compounds.</span>
          </div>
        </span>

        {/* Classic Mode */}
        <span className="quiz-mode" id="classic" onClick={() => handleModeClick("classic")}>
          <div className="quiz-bg"></div>
          <div className="quiz-grad"></div>
          <div className="quiz-desc">
            <span className="mode-name">Classic</span>
            <span className="mode-desc">Can you guess the placements of all the elements?</span>
          </div>
        </span>

        {/* Time Trial */}
        <span className="quiz-mode" id="time" onClick={() => handleModeClick("time")}>
          <div className="quiz-bg"></div>
          <div className="quiz-grad"></div>
          <div className="quiz-desc">
            <span className="mode-name">Time Trial</span>
            <span className="mode-desc">How fast can you clear all of the questions?</span>
          </div>
        </span>

        {/* Survival */}
        <span className="quiz-mode" id="endless" onClick={() => handleModeClick("modesurvival")}>
          <div className="quiz-bg"></div>
          <div className="quiz-grad"></div>
          <div className="quiz-desc">
            <span className="mode-name">Survival Mode</span>
            <span className="mode-desc">Survive endless questions as long as you can.</span>
          </div>
        </span>

        {/* PvP */}
        <span className="quiz-mode" id="pvp">
          <div className="quiz-bg"></div>
          <div className="quiz-grad"></div>
          <div className="quiz-desc">
            <MatchmakingLobby
              onStartGame={(roomCode, userInfo) =>
                setRoomInfo({ roomCode, userInfo })
              }
              onCancelMatch={handleCancelMatch} // 🔹 pass cancel callback
            />
          </div>
        </span>
      </div>

      {/* BattleRoom display */}
      {roomInfo && (
        <BattleRoom {...roomInfo} />
      )}

      <br />
      <h1>Review </h1>
      <div className="quiz-modes-container">

        <span className="quiz-mode" id="playground" onClick={() => handleModeClick("playground")}>
          <div className="quiz-bg"></div>
          <div className="quiz-grad"></div>
          <div className="quiz-desc">
            <span className="mode-name">Mixing Playground</span>
            <span className="mode-desc">Try different combination different elements.</span>
          </div>
        </span>
        {/* Non-Metals */}
        <span className="quiz-mode" id="nonmetals" onClick={() => handleModeClick("nonmetals")}>
          <div className="quiz-bg"></div>
          <div className="quiz-grad"></div>
          <div className="quiz-desc">
            <span className="mode-name">Non Metals</span>
            <span className="mode-desc">Explore the adaptability of Non-Metals</span>
          </div>
        </span>

        {/* Metalloids */}
        <span className="quiz-mode" id="metalloids" onClick={() => handleModeClick("metalloids")}>
          <div className="quiz-bg"></div>
          <div className="quiz-grad"></div>
          <div className="quiz-desc">
            <span className="mode-name">Metalloids</span>
            <span className="mode-desc">Metalloids: For all your semi-electrical needs.</span>
          </div>
        </span>

        {/* Metals */}
        <span className="quiz-mode" id="metals" onClick={() => handleModeClick("metals")}>
          <div className="quiz-bg"></div>
          <div className="quiz-grad"></div>
          <div className="quiz-desc">
            <span className="mode-name">Metals</span>
            <span className="mode-desc">Built to last, designed to impress.</span>
          </div>
        </span>

        {/* Noble Gases */}
        <span className="quiz-mode" id="noblegas" onClick={() => handleModeClick("noblegas")}>
          <div className="quiz-bg"></div>
          <div className="quiz-grad"></div>
          <div className="quiz-desc">
            <span className="mode-name">Noble Gases</span>
            <span className="mode-desc">The element of non-commitment.</span>
          </div>
        </span>
      </div>
    </div>
  );
}

export default Quizzes;