import { useNavigate } from "react-router-dom";
import "../styles/Difficulty.css";
import BackgroundVideo from "../components/BackgroundVideo";

const Difficulty = () => {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <div className="difficulty-container">
      <BackgroundVideo />

      <button className="back" onClick={handleBack}>
        ←
      </button>

      <h1 className="title">Select Difficulty Level</h1>

      <div className="button-group">
        <button
          className="difficulty-btn easy"
          onClick={() => navigate("/timetrial")}
        >
          Easy
        </button>
        <button
          className="difficulty-btn medium"
          onClick={() => navigate("/medium")}
        >
          Medium
        </button>
        <button
          className="difficulty-btn hard"
          onClick={() => navigate("/hard")}
        >
          Hard
        </button>
      </div>
    </div>
  );
};

export default Difficulty;