import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Rnon_metals.css";
import BackgroundVideo from "../components/BackgroundVideo";
import Swal from "sweetalert2";

const quizData = [
  { images: ["/images/hydrogen/hydrogen1.jpg", "/images/hydrogen/hydrogen2.jpg"], answer: "HYDROGEN", symbol: "H" },
  { images: ["/images/carbon/carbon1.jpg", "/images/carbon/carbon2.jpg"], answer: "CARBON", symbol: "C" },
  { images: ["/images/nitrogen/nitrogen1.jpg", "/images/nitrogen/nitrogen2.jpg"], answer: "NITROGEN", symbol: "N" },
  { images: ["/images/oxygen/oxygen1.jpg", "/images/oxygen/oxygen2.jpg"], answer: "OXYGEN", symbol: "O" },
  { images: ["/images/fluorine/fluorine1.jpg", "/images/fluorine/fluorine2.jpg"], answer: "FLUORINE", symbol: "F" },
  { images: ["/images/phosphorus/phosphorus1.jpg", "/images/phosphorus/phosphorus2.jpg"], answer: "PHOSPHORUS", symbol: "P" },
  { images: ["/images/sulfur/sulfur1.jpg", "/images/sulfur/sulfur2.jpg"], answer: "SULFUR", symbol: "S" },
  { images: ["/images/chlorine/chlorine1.jpg", "/images/chlorine/chlorine2.jpg"], answer: "CHLORINE", symbol: "Cl" },
  { images: ["/images/selenium/selenium1.jpg", "/images/selenium/selenium2.jpg"], answer: "SELENIUM", symbol: "Se" },
  { images: ["/images/bromine/bromine1.jpg", "/images/bromine/bromine2.jpg"], answer: "BROMINE", symbol: "Br" },
  { images: ["/images/iodine/iodine1.jpg", "/images/iodine/iodine2.jpg"], answer: "IODINE", symbol: "I" },
  { images: ["/images/astatine/astatine1.jpg", "/images/astatine/astatine2.jpg"], answer: "ASTATINE", symbol: "At" }
];

function shuffleArray(array) {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

const TOTAL_QUESTIONS = 10;

function generateQuestions() {
  const types = ["multiple", "identification", "symbol"];

  // step 1: shuffle base data
  const shuffled = shuffleArray(quizData);

  // step 2: assign random quiz type to each of the 18
  const baseQuestions = shuffled.map((q) => ({
    ...q,
    quizType: types[Math.floor(Math.random() * types.length)],
  }));

  // step 3: pick 2 random elements to duplicate with DIFFERENT quiz type
  const duplicates = shuffleArray(baseQuestions).slice(0, 2).map((q) => {
    const otherTypes = types.filter((t) => t !== q.quizType);
    return {
      ...q,
      quizType: otherTypes[Math.floor(Math.random() * otherTypes.length)],
    };
  });

  // step 4: combine all 20 and shuffle
  let allQuestions = shuffleArray([...baseQuestions, ...duplicates]);

  // step 5: avoid same element back-to-back
  for (let i = 1; i < allQuestions.length; i++) {
    if (allQuestions[i].answer === allQuestions[i - 1].answer) {
      const swapIndex = (i + 2) % allQuestions.length;
      [allQuestions[i], allQuestions[swapIndex]] = [allQuestions[swapIndex], allQuestions[i]];
    }
  }

  return allQuestions;
}

const Nonmetals = () => {
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [options, setOptions] = useState([]);
  const [inputAnswer, setInputAnswer] = useState("");
  const [feedback, setFeedback] = useState("");
  const [questionIndex, setQuestionIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [showQuitModal, setShowQuitModal] = useState(false);

  useEffect(() => {
    const qList = generateQuestions();
    setQuestions(qList);
  }, []);

  useEffect(() => {
    if (questions.length > 0) {
      prepareQuestion(questions[questionIndex]);
    }
  }, [questions, questionIndex]);

  function prepareQuestion(q) {
    setCurrentQuestion(q);
    setFeedback("");
    setInputAnswer("");

    const wrongChoices = shuffleArray(
      quizData.filter((item) => item.answer !== q.answer)
    )
      .slice(0, 3)
      .map((item) => item.answer);

    const choices = shuffleArray([q.answer, ...wrongChoices]);
    setOptions(choices);
  }

  function nextQuestion() {
    if (questionIndex < TOTAL_QUESTIONS - 1) {
      const nextIndex = questionIndex + 1;
      setQuestionIndex(nextIndex);
      setProgress(((nextIndex + 1) / TOTAL_QUESTIONS) * 100);
    } else {
      setFeedback("🎉 Quiz Finished!");
    }
  }

  function checkAnswer(answer) {
    if (answer.toUpperCase().trim() === currentQuestion.answer) {
      setFeedback("✅ Correct!");
    } else {
      setFeedback(`❌ Wrong! Answer is ${currentQuestion.answer}`);
    }

    setTimeout(() => {
      nextQuestion();
    }, 1200);
  }

  useEffect(() => {
  if (feedback) {
    const timer = setTimeout(() => setFeedback(""), 2500);
    return () => clearTimeout(timer);
  }
}, [feedback]);


  if (!currentQuestion) return <div>Loading...</div>;

  return (
    <div className="quiz-wrapper">
      <BackgroundVideo />

      <div className="quiz-container">
        {/* Header */}
        <div className="quiz-header">
          <div className="progress-container">
            <div className="progress-bar" style={{ width: `${progress}%` }}></div>
          </div>
          <span className="question-count">
            {questionIndex + 1}/{TOTAL_QUESTIONS}
          </span>
          <button className="quiz-close" onClick={() => setShowQuitModal(true)}>
            ✕
          </button>
        </div>

        {/* Title */}
        <h2 className="quiz-title">Guess the Non-Metal Element</h2>

        {/* Question Content */}
        <div className="quiz-content">
          {currentQuestion.quizType === "symbol" && (
            <div className="sym-choices">
              <div className="symbol-box">
                <h1>{currentQuestion.symbol}</h1>
              </div>
              <div className="quiz-options">
                {options.map((opt, idx) => (
                  <button
                    key={idx}
                    className={`option-btn ${inputAnswer === opt ? "selected" : ""}`}
                    onClick={() => checkAnswer(opt)}
                  >
                    {opt}
                  </button>
                ))}
                
              </div>
            </div>
          )}

          {currentQuestion.quizType === "multiple" && (
            <div className="img-multi">
              <div className="quiz-images">
                {currentQuestion.images.map((src, idx) => (
                  <img key={idx} src={src} alt="element clue" />
                ))}
              </div>
              <div className="quiz-options">
                {options.map((opt, idx) => (
                  <button
                    key={idx}
                    className="option-btn"
                    onClick={() => checkAnswer(opt)}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>
          )}

          {currentQuestion.quizType === "identification" && (
            <div className="img-identify">
              <div className="quiz-images">
                {currentQuestion.images.map((src, idx) => (
                  <img key={idx} src={src} alt="element clue" />
                ))}
              </div>
              <div className="quiz-input">
                <input
                  type="text"
                  value={inputAnswer}
                  onChange={(e) => setInputAnswer(e.target.value)}
                  placeholder="Type your answer"
                />
                <button
                  className="submit-btn"
                  disabled={!inputAnswer}
                  onClick={() => checkAnswer(inputAnswer)}
                >
                  Submit
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Feedback */}
        {feedback && (
          <div
            className={`toast ${
              feedback.includes("✅") ? "toast-success" : "toast-error"
            }`}
          >
            <p>{feedback}</p>
          </div>
        )}

      </div>

      {/* Quit Modal */}
      {showQuitModal && (
        <div className="modal-overlay">
          <div className="modal">
            <p>Are you sure you want to quit this session?</p>
            <button className="keep-btn" onClick={() => setShowQuitModal(false)}>
              KEEP PRACTICING
            </button>
            <button className="quit-btns" onClick={() => window.history.back()}>
              QUIT
            </button>
          </div>
        </div>
      )}
    </div>

  );
};

export default Nonmetals;