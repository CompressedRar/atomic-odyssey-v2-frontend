import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Rnon_metals.css";
import BackgroundVideo from "../components/BackgroundVideo";
import Swal from "sweetalert2";

const quizData = [
  {images: ["/images/boron/boron1.jpg", "/images/boron/boron2.jpg"], answer: "BORON", symbol: "B",},
  {images: ["/images/silicon/silicon1.jpg", "/images/silicon/silicon2.jpg"], answer: "SILICON", symbol: "Si",},
  {images: ["/images/arsenic/arsenic1.jpg", "/images/arsenic/arsenic2.jpg"], answer: "ARSENIC", symbol: "As",},
  {images: ["/images/germanium/germanium1.jpg", "/images/germanium/germanium2.jpg"], answer: "GERMANIUM", symbol: "Ge",},
  {images: ["/images/antimony/antimony1.jpg", "/images/antimony/antimony2.jpg"], answer: "ANTIMONY", symbol: "Sb",},
  {images: ["/images/tellurium/tellurium1.jpg", "/images/tellurium/tellurium2.jpg"], answer: "TELLURIUM", symbol: "Te",},
  {images: ["/images/polonium/polonium1.jpg", "/images/polonium/polonium2.jpg"], answer: "POLONIUM", symbol: "Po",},
  {images: ["/images/astatine/astatine1.jpg", "/images/astatine/astatine2.jpg"], answer: "ASTATINE",symbol: "At",},
];


function shuffleArray(array) {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

const TOTAL_QUESTIONS = 20;

function generateQuestions() {
  const types = ["multiple", "identification", "symbol"];
  const questions = [];

  quizData.forEach((el) => {
    const type = types[Math.floor(Math.random() * types.length)];
    questions.push({ ...el, quizType: type });
  });

  while (questions.length < TOTAL_QUESTIONS) {
    const el = quizData[Math.floor(Math.random() * quizData.length)];
    const usedTypes = questions
      .filter((q) => q.answer === el.answer)
      .map((q) => q.quizType);
    const remainingTypes = types.filter((t) => !usedTypes.includes(t));
    if (remainingTypes.length === 0) continue;
    const type = remainingTypes[Math.floor(Math.random() * remainingTypes.length)];
    questions.push({ ...el, quizType: type });
  }

  let shuffled = [];
  const temp = [...questions];

  while (temp.length > 0) {
    for (let i = 0; i < temp.length; i++) {
      if (shuffled.length === 0 || shuffled[shuffled.length - 1].answer !== temp[i].answer) {
        shuffled.push(temp[i]);
        temp.splice(i, 1);
        break;
      }
    }
  }

  return shuffled;
}

const Metalloids = () => {
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

export default Metalloids;