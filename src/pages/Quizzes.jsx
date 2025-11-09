import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Quizzes.css";
import "../styles/animations.css";
import Competitive from "./Competitive";
import MatchmakingLobby from "./MatchMakingLobby";
import BattleRoom from "./BattleRoom";


function Quizzes() {
  const navigate = useNavigate();
  const [isPvp, setPvp] = useState(false)

  const [roomInfo, setRoomInfo] = useState(null);

  const handleModeClick = (mode) => {
    if (mode === "time") {
      navigate("/difficulty");
    }
    if (mode === "classic") {
      navigate("/main");
    }
    if (mode === "modesurvival") {
      navigate("/modesurvival");
    }
    if (mode === "pvp") {
      navigate("/pvp");
    }
    if (mode === "nonmetals") {
      navigate("/nonmetals");
    }
    if (mode === "metalloids") {
      navigate("/metalloids");
    }
    if (mode === "metals") {
      navigate("/metals");
    }
    if (mode === "noblegas") {
      navigate("/noblegas");
    }
    if (mode === "classic") {
      navigate("/classic");
    }
    if (mode === "fusion") {
      navigate("/fusion");
    }
  };

  return (
    <div className="quizzes-container">
      
      <h1>Game Modes</h1>
      

      <div className="quiz-modes-container">

        <span
          className="quiz-mode"
          id="fusion"
          onClick={() => handleModeClick("fusion")}
        >
          <div className="quiz-bg"></div>
          <div className="quiz-grad"></div>
          <div className="quiz-desc">
            <span className="mode-name">Fusion</span>
            <span className="mode-desc">
              Mix and feel the thrill of creating compounds.
            </span>
          </div>
        </span>


        <span
          className="quiz-mode"
          id="classic"
          onClick={() => handleModeClick("classic")}
        >
          <div className="quiz-bg"></div>
          <div className="quiz-grad"></div>
          <div className="quiz-desc">
            <span className="mode-name">Classic</span>
            <span className="mode-desc">
              Can you guess the placements of all the elements?
            </span>
          </div>
        </span>

        <span
          className="quiz-mode"
          id="time"
          onClick={() => handleModeClick("time")}
        >
          <div className="quiz-bg"></div>
          <div className="quiz-grad"></div>
          <div className="quiz-desc">
            <span className="mode-name">Time Trial</span>
            <span className="mode-desc">
              How fast can you clear all of the questions?
            </span>
          </div>
        </span>

        <span
          className="quiz-mode"
          id="endless"
          onClick={() => handleModeClick("modesurvival")}
        >
          <div className="quiz-bg"></div>
          <div className="quiz-grad"></div>
          <div className="quiz-desc">
            <span className="mode-name">Survival Mode</span>
            <span className="mode-desc">
              Survive endless questions as long as you can.
            </span>
          </div>
        </span>

        <span
          className="quiz-mode"
          id="pvp"
        >
          <div className="quiz-bg"></div>
          <div className="quiz-grad"></div>
          <div className="quiz-desc">
            <MatchmakingLobby onStartGame={(roomCode, userInfo) =>
                setRoomInfo({ roomCode, userInfo })
            }></MatchmakingLobby>
          </div>
        </span> 

        
      </div>

      {roomInfo && (
        <BattleRoom {...roomInfo}></BattleRoom>
      )}

      <br />
      <h1>Review </h1>
      <div className="quiz-modes-container">
        <span className="quiz-mode" id="nonmetals" onClick={() => handleModeClick("nonmetals")}>
          <div className="quiz-bg"></div>
          <div className="quiz-grad"></div>
          <div className="quiz-desc">
            <span className="mode-name">Non Metals</span>
            <span className="mode-desc">
              Explore the adaptability of Non-Metals
            </span>
          </div>
        </span>

        <span className="quiz-mode" id="metalloids" onClick={() => handleModeClick("metalloids")}>
          <div className="quiz-bg"></div>
          <div className="quiz-grad"></div>
          <div className="quiz-desc">
            <span className="mode-name">Metalloids</span>
            <span className="mode-desc">
              Metalloids: For all your semi-electrical needs.
            </span>
          </div>
        </span>

        <span className="quiz-mode" id="metals" onClick={() => handleModeClick("metals")}>
          <div className="quiz-bg"></div>
          <div className="quiz-grad"></div>
          <div className="quiz-desc">
            <span className="mode-name">Metals</span>
            <span className="mode-desc">Built to last, designed to impress.</span>
          </div>
        </span>

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