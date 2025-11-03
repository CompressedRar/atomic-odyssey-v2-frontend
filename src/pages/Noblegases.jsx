import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Rnon_metals.css";
import BackgroundVideo from "../components/BackgroundVideo";
import Swal from "sweetalert2";

const quizData = [
    { images: ["/images/helium/helium1.jpg", "/images/helium/helium2.jpg"], answer: "HELIUM", symbol: "He" },
    { images: ["/images/neon/neon1.jpg", "/images/neon/neon2.jpg"], answer: "NEON", symbol: "Ne" },
    { images: ["/images/argon/argon1.jpg", "/images/argon/argon2.jpg"], answer: "ARGON", symbol: "Ar" },
    { images: ["/images/krypton/krypton1.jpg", "/images/krypton/krypton2.jpg"], answer: "KRYPTON", symbol: "Kr" },
    { images: ["/images/xenon/xenon1.jpg", "/images/xenon/xenon2.jpg"], answer: "XENON", symbol: "Xe" },
    { images: ["/images/radon/radon1.jpg", "/images/radon/radon2.jpg"], answer: "RADON", symbol: "Rn" },
    { images: ["/images/oganesson/oganesson1.jpg", "/images/oganesson/oganesson2.jpg"], answer: "OGANESSON", symbol: "Og" },
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

const Noblegases = () => {
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

export default Noblegases;