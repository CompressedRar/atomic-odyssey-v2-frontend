import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Rnon_metals.css";
import BackgroundVideo from "../components/BackgroundVideo";
import Swal from "sweetalert2";

const metalsData = [
    // Alkali metals
    { images: ["/images/lithium/lithium1.jpg", "/images/lithium/lithium2.jpg"], answer: "LITHIUM", symbol: "Li", category: "Alkali metals" },
    { images: ["/images/sodium/sodium1.jpg", "/images/sodium/sodium2.jpg"], answer: "SODIUM", symbol: "Na", category: "Alkali metals" },
    { images: ["/images/potassium/potassium1.jpg", "/images/potassium/potassium2.jpg"], answer: "POTASSIUM", symbol: "K", category: "Alkali metals" },
    { images: ["/images/rubidium/rubidium1.jpg", "/images/rubidium/rubidium2.jpg"], answer: "RUBIDIUM", symbol: "Rb", category: "Alkali metals" },
    { images: ["/images/cesium/cesium1.jpg", "/images/cesium/cesium2.jpg"], answer: "CESIUM", symbol: "Cs", category: "Alkali metals" },
    { images: ["/images/francium/francium1.jpg", "/images/francium/francium2.jpg"], answer: "FRANCIUM", symbol: "Fr", category: "Alkali metals" },

    // Alkaline earth metals
    { images: ["/images/beryllium/beryllium1.jpg", "/images/beryllium/beryllium2.jpg"], answer: "BERYLLIUM", symbol: "Be", category: "Alkaline earth metals" },
    { images: ["/images/magnesium/magnesium1.jpg", "/images/magnesium/magnesium2.jpg"], answer: "MAGNESIUM", symbol: "Mg", category: "Alkaline earth metals" },
    { images: ["/images/calcium/calcium1.jpg", "/images/calcium/calcium2.jpg"], answer: "CALCIUM", symbol: "Ca", category: "Alkaline earth metals" },
    { images: ["/images/strontium/strontium1.jpg", "/images/strontium/strontium2.jpg"], answer: "STRONTIUM", symbol: "Sr", category: "Alkaline earth metals" },
    { images: ["/images/barium/barium1.jpg", "/images/barium/barium2.jpg"], answer: "BARIUM", symbol: "Ba", category: "Alkaline earth metals" },
    { images: ["/images/radium/radium1.jpg", "/images/radium/radium2.jpg"], answer: "RADIUM", symbol: "Ra", category: "Alkaline earth metals" },

    // Transition metals
    { images: ["/images/scandium/scandium1.jpg", "/images/scandium/scandium2.jpg"], answer: "SCANDIUM", symbol: "Sc", category: "Transition metals" },
    { images: ["/images/titanium/titanium1.jpg", "/images/titanium/titanium2.jpg"], answer: "TITANIUM", symbol: "Ti", category: "Transition metals" },
    { images: ["/images/vanadium/vanadium1.jpg", "/images/vanadium/vanadium2.jpg"], answer: "VANADIUM", symbol: "V", category: "Transition metals" },
    { images: ["/images/chromium/chromium1.jpg", "/images/chromium/chromium2.jpg"], answer: "CHROMIUM", symbol: "Cr", category: "Transition metals" },
    { images: ["/images/manganese/manganese1.jpg", "/images/manganese/manganese2.jpg"], answer: "MANGANESE", symbol: "Mn", category: "Transition metals" },
    { images: ["/images/iron/iron1.jpg", "/images/iron/iron2.jpg"], answer: "IRON", symbol: "Fe", category: "Transition metals" },
    { images: ["/images/cobalt/cobalt1.jpg", "/images/cobalt/cobalt2.jpg"], answer: "COBALT", symbol: "Co", category: "Transition metals" },
    { images: ["/images/nickel/nickel1.jpg", "/images/nickel/nickel2.jpg"], answer: "NICKEL", symbol: "Ni", category: "Transition metals" },
    { images: ["/images/copper/copper1.jpg", "/images/copper/copper2.jpg"], answer: "COPPER", symbol: "Cu", category: "Transition metals" },
    { images: ["/images/zinc/zinc1.jpg", "/images/zinc/zinc2.jpg"], answer: "ZINC", symbol: "Zn", category: "Transition metals" },
    { images: ["/images/yttrium/yttrium1.jpg", "/images/yttrium/yttrium2.jpg"], answer: "YTTRIUM", symbol: "Y", category: "Transition metals" },
    { images: ["/images/zirconium/zirconium1.jpg", "/images/zirconium/zirconium2.jpg"], answer: "ZIRCONIUM", symbol: "Zr", category: "Transition metals" },
    { images: ["/images/niobium/niobium1.jpg", "/images/niobium/niobium2.jpg"], answer: "NIOBIUM", symbol: "Nb", category: "Transition metals" },
    { images: ["/images/molybdenum/molybdenum1.jpg", "/images/molybdenum/molybdenum2.jpg"], answer: "MOLYBDENUM", symbol: "Mo", category: "Transition metals" },

    // Post-transition metals
    { images: ["/images/aluminium/aluminium1.jpg", "/images/aluminium/aluminium2.jpg"], answer: "ALUMINIUM", symbol: "Al", category: "Post-transition metals" },
    { images: ["/images/gallium/gallium1.jpg", "/images/gallium/gallium2.jpg"], answer: "GALLIUM", symbol: "Ga", category: "Post-transition metals" },
    { images: ["/images/indium/indium1.jpg", "/images/indium/indium2.jpg"], answer: "INDIUM", symbol: "In", category: "Post-transition metals" },
    { images: ["/images/tin/tin1.jpg", "/images/tin/tin2.jpg"], answer: "TIN", symbol: "Sn", category: "Post-transition metals" },
    { images: ["/images/lead/lead1.jpg", "/images/lead/lead2.jpg"], answer: "LEAD", symbol: "Pb", category: "Post-transition metals" },
    { images: ["/images/bismuth/bismuth1.jpg", "/images/bismuth/bismuth2.jpg"], answer: "BISMUTH", symbol: "Bi", category: "Post-transition metals" },

    // Lanthanides
    { images: ["/images/lanthanum/lanthanum1.jpg", "/images/lanthanum/lanthanum2.jpg"], answer: "LANTHANUM", symbol: "La", category: "Lanthanides" },
    { images: ["/images/cerium/cerium1.jpg", "/images/cerium/cerium2.jpg"], answer: "CERIUM", symbol: "Ce", category: "Lanthanides" },
    { images: ["/images/praseodymium/praseodymium1.jpg", "/images/praseodymium/praseodymium2.jpg"], answer: "PRASEODYMIUM", symbol: "Pr", category: "Lanthanides" },
    { images: ["/images/neodymium/neodymium1.jpg", "/images/neodymium/neodymium2.jpg"], answer: "NEODYMIUM", symbol: "Nd", category: "Lanthanides" },
    { images: ["/images/promethium/promethium1.jpg", "/images/promethium/promethium2.jpg"], answer: "PROMETHIUM", symbol: "Pm", category: "Lanthanides" },
    { images: ["/images/samarium/samarium1.jpg", "/images/samarium/samarium2.jpg"], answer: "SAMARIUM", symbol: "Sm", category: "Lanthanides" },

    // Actinides
    { images: ["/images/actinium/actinium1.jpg", "/images/actinium/actinium2.jpg"], answer: "ACTINIUM", symbol: "Ac", category: "Actinides" },
    { images: ["/images/thorium/thorium1.jpg", "/images/thorium/thorium2.jpg"], answer: "THORIUM", symbol: "Th", category: "Actinides" },
    { images: ["/images/protactinium/protactinium1.jpg", "/images/protactinium/protactinium2.jpg"], answer: "PROTACTINIUM", symbol: "Pa", category: "Actinides" },
    { images: ["/images/uranium/uranium1.jpg", "/images/uranium/uranium2.jpg"], answer: "URANIUM", symbol: "U", category: "Actinides" },
    { images: ["/images/neptunium/neptunium1.jpg", "/images/neptunium/neptunium2.jpg"], answer: "NEPTUNIUM", symbol: "Np", category: "Actinides" },
    { images: ["/images/plutonium/plutonium1.jpg", "/images/plutonium/plutonium2.jpg"], answer: "PLUTONIUM", symbol: "Pu", category: "Actinides" }
];

const categories = ["Alkali metals", "Alkaline earth metals", "Transition metals", "Post-transition metals", "Lanthanides", "Actinides"];

function shuffleArray(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

const TOTAL_QUESTIONS = 10;

function generateQuestions(data) {
    const types = ["multiple", "identification", "symbol"];
    const questions = [];

    data.forEach((el) => {
        const type = types[Math.floor(Math.random() * types.length)];
        questions.push({ ...el, quizType: type });
    });

    while (questions.length < TOTAL_QUESTIONS) {
        const el = data[Math.floor(Math.random() * data.length)];
        const usedTypes = questions.filter(q => q.answer === el.answer).map(q => q.quizType);
        const remainingTypes = types.filter(t => !usedTypes.includes(t));
        if (remainingTypes.length === 0) continue;
        const type = remainingTypes[Math.floor(Math.random() * remainingTypes.length)];
        questions.push({ ...el, quizType: type });
    }

    return shuffleArray(questions);
}

const Metals = () => {
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [questions, setQuestions] = useState([]);
    const [currentQuestion, setCurrentQuestion] = useState(null);
    const [options, setOptions] = useState([]);
    const [inputAnswer, setInputAnswer] = useState("");
    const [feedback, setFeedback] = useState("");
    const [questionIndex, setQuestionIndex] = useState(0);
    const [progress, setProgress] = useState(0);
    const [showQuitModal, setShowQuitModal] = useState(false);

    useEffect(() => {
        if (selectedCategory) {
            const filtered = metalsData.filter(m => m.category === selectedCategory);
            setQuestions(generateQuestions(filtered));
        }
    }, [selectedCategory]);

    useEffect(() => {
        if (questions.length > 0) prepareQuestion(questions[questionIndex]);
    }, [questions, questionIndex]);

    function prepareQuestion(q) {
        setCurrentQuestion(q);
        setFeedback("");
        setInputAnswer("");

        const wrongChoices = shuffleArray(
            metalsData.filter((item) => item.answer !== q.answer)
        ).slice(0, 3).map((item) => item.answer);

        setOptions(shuffleArray([q.answer, ...wrongChoices]));
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
        setTimeout(() => nextQuestion(), 1200);
    }

    // --- CATEGORY SELECTION SCREEN ---
    if (!selectedCategory) {
        return (
            <div className="category-wrapper">
                <BackgroundVideo />

                {/* Back Button */}
                <button className="back-btn" onClick={() => window.history.back()}>
                    &lt;
                </button>

                <h2 className="category-title">Select a Metal Category</h2>

                <div className="category-buttons">
                    {categories.map((cat, idx) => (
                        <button
                            key={idx}
                            className="category-btn"
                            onClick={() => setSelectedCategory(cat)}
                        >
                            {cat}
                        </button>
                    ))}
                </div>
            </div>
        );
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

export default Metals;