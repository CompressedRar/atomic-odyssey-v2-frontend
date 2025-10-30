import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Classic.css";
import BackgroundVideo from "../components/BackgroundVideo"
import Swal from "sweetalert2";
import { auth } from "../configs/FirebaseConfig";
import { getDatabase, ref, get, set } from "firebase/database";
import Confetti from "react-confetti";
import { div } from "framer-motion/client";

const elementsData = [
    { number: 1, symbol: "H", name: "Hydrogen", row: 1, col: 1, group: "nonmetal" },
    { number: 2, symbol: "He", name: "Helium", row: 1, col: 18, group: "noble" },

    { number: 3, symbol: "Li", name: "Lithium", row: 2, col: 1, group: "alkali" },
    { number: 4, symbol: "Be", name: "Beryllium", row: 2, col: 2, group: "alkaline" },
    { number: 5, symbol: "B", name: "Boron", row: 2, col: 13, group: "metalloid" },
    { number: 6, symbol: "C", name: "Carbon", row: 2, col: 14, group: "nonmetal" },
    { number: 7, symbol: "N", name: "Nitrogen", row: 2, col: 15, group: "nonmetal" },
    { number: 8, symbol: "O", name: "Oxygen", row: 2, col: 16, group: "nonmetal" },
    { number: 9, symbol: "F", name: "Fluorine", row: 2, col: 17, group: "nonmetal" },
    { number: 10, symbol: "Ne", name: "Neon", row: 2, col: 18, group: "noble" },

    { number: 11, symbol: "Na", name: "Sodium", row: 3, col: 1, group: "alkali" },
    { number: 12, symbol: "Mg", name: "Magnesium", row: 3, col: 2, group: "alkaline" },
    { number: 13, symbol: "Ai", name: "Aluminium", row: 3, col: 13, group: "post-transition" },
    { number: 14, symbol: "Si", name: "Silicon", row: 3, col: 14, group: "metalloid" },
    { number: 15, symbol: "P", name: "Phosphorus", row: 3, col: 15, group: "nonmetal" },
    { number: 16, symbol: "S", name: "Sulfur", row: 3, col: 16, group: "nonmetal" },
    { number: 17, symbol: "Cl", name: "Chlorine", row: 3, col: 17, group: "nonmetal" },
    { number: 18, symbol: "Ar", name: "Argon", row: 3, col: 18, group: "noble" },

    { number: 19, symbol: "K", name: "Potassium", row: 4, col: 1, group: "alkali" },
    { number: 20, symbol: "Ca", name: "Calcium", row: 4, col: 2, group: "alkaline" },
    { number: 21, symbol: "Sc", name: "Scandium", row: 4, col: 3, group: "transition" },
    { number: 22, symbol: "Ti", name: "Titanium", row: 4, col: 4, group: "transition" },
    { number: 23, symbol: "V", name: "Vanadium", row: 4, col: 5, group: "transition" },
    { number: 24, symbol: "Cr", name: "Chromium", row: 4, col: 6, group: "transition" },
    { number: 25, symbol: "Mn", name: "Manganese", row: 4, col: 7, group: "transition" },
    { number: 26, symbol: "Fe", name: "Iron", row: 4, col: 8, group: "transition" },
    { number: 27, symbol: "Co", name: "Cobalt", row: 4, col: 9, group: "transition" },
    { number: 28, symbol: "Ni", name: "Nickel", row: 4, col: 10, group: "transition" },
    { number: 29, symbol: "Cu", name: "Copper", row: 4, col: 11, group: "transition" },
    { number: 30, symbol: "Zn", name: "Zinc", row: 4, col: 12, group: "transition" },
    { number: 31, symbol: "Ga", name: "Gallium", row: 4, col: 13, group: "post-transition" },
    { number: 32, symbol: "Ge", name: "Germanium", row: 4, col: 14, group: "metalloid" },
    { number: 33, symbol: "As", name: "Arsenic", row: 4, col: 15, group: "metalloid" },
    { number: 34, symbol: "Se", name: "Selenium", row: 4, col: 16, group: "nonmetal" },
    { number: 35, symbol: "Br", name: "Bromine", row: 4, col: 17, group: "nonmetal" },
    { number: 36, symbol: "Kr", name: "Krypton", row: 4, col: 18, group: "noble" },

    { number: 37, symbol: "Rb", name: "Rubidium", row: 5, col: 1, group: "alkali" },
    { number: 38, symbol: "Sr", name: "Strontium", row: 5, col: 2, group: "alkaline" },
    { number: 39, symbol: "Y", name: "Yttrium", row: 5, col: 3, group: "transition" },
    { number: 40, symbol: "Zr", name: "Zirconium", row: 5, col: 4, group: "transition" },
    { number: 41, symbol: "Nb", name: "Niobium", row: 5, col: 5, group: "transition" },
    { number: 42, symbol: "Mo", name: "Molybdenum", row: 5, col: 6, group: "transition" },
    { number: 43, symbol: "Tc", name: "Technetium", row: 5, col: 7, group: "transition" },
    { number: 44, symbol: "Ru", name: "Ruthenium", row: 5, col: 8, group: "transition" },
    { number: 45, symbol: "Rh", name: "Rhodium", row: 5, col: 9, group: "transition" },
    { number: 46, symbol: "Pd", name: "Palladium", row: 5, col: 10, group: "transition" },
    { number: 47, symbol: "Ag", name: "Silver", row: 5, col: 11, group: "transition" },
    { number: 48, symbol: "Cd", name: "Cadmium", row: 5, col: 12, group: "transition" },
    { number: 49, symbol: "In", name: "Indium", row: 5, col: 13, group: "post-transition" },
    { number: 50, symbol: "Sn", name: "Tin", row: 5, col: 14, group: "post-transition" },
    { number: 51, symbol: "Sb", name: "Antimony", row: 5, col: 15, group: "metalloid" },
    { number: 52, symbol: "Te", name: "Tellurium", row: 5, col: 16, group: "metalloid" },
    { number: 53, symbol: "I", name: "Iodine", row: 5, col: 17, group: "nonmetal" },
    { number: 54, symbol: "Xe", name: "Xenon", row: 5, col: 18, group: "noble" },

    { number: 55, symbol: "Cs", name: "Caesium", row: 6, col: 1, group: "alkali" },
    { number: 56, symbol: "Ba", name: "Barium", row: 6, col: 2, group: "alkaline" },
    { number: 57, symbol: "La", name: "Lanthanum", row: 9, col: 3, group: "lanthanide" },
    { number: 58, symbol: "Ce", name: "Cerium", row: 9, col: 4, group: "lanthanide" },
    { number: 59, symbol: "Pr", name: "Praseodymium", row: 9, col: 5, group: "lanthanide" },
    { number: 60, symbol: "Nd", name: "Neodymium", row: 9, col: 6, group: "lanthanide" },
    { number: 61, symbol: "Pm", name: "Promethium", row: 9, col: 7, group: "lanthanide" },
    { number: 62, symbol: "Sm", name: "Samarium", row: 9, col: 8, group: "lanthanide" },
    { number: 63, symbol: "Eu", name: "Europium", row: 9, col: 9, group: "lanthanide" },
    { number: 64, symbol: "Gd", name: "Gadolinium", row: 9, col: 10, group: "lanthanide" },
    { number: 65, symbol: "Tb", name: "Terbium", row: 9, col: 11, group: "lanthanide" },
    { number: 66, symbol: "Dy", name: "Dysprosium", row: 9, col: 12, group: "lanthanide" },
    { number: 67, symbol: "Ho", name: "Holmium", row: 9, col: 13, group: "lanthanide" },
    { number: 68, symbol: "Er", name: "Erbium", row: 9, col: 14, group: "lanthanide" },
    { number: 69, symbol: "Tm", name: "Thulium", row: 9, col: 15, group: "lanthanide" },
    { number: 70, symbol: "Yb", name: "Ytterbium", row: 9, col: 16, group: "lanthanide" },
    { number: 71, symbol: "Lu", name: "Lutetium", row: 9, col: 17, group: "lanthanide" },
    { number: 72, symbol: "Hf", name: "Hafnium", row: 6, col: 4, group: "transition" },
    { number: 73, symbol: "Ta", name: "Tantalum", row: 6, col: 5, group: "transition" },
    { number: 74, symbol: "W", name: "Tungsten", row: 6, col: 6, group: "transition" },
    { number: 75, symbol: "Re", name: "Rhenium", row: 6, col: 7, group: "transition" },
    { number: 76, symbol: "Os", name: "Osmium", row: 6, col: 8, group: "transition" },
    { number: 77, symbol: "Ir", name: "Iridium", row: 6, col: 9, group: "transition" },
    { number: 78, symbol: "Pt", name: "Platinum", row: 6, col: 10, group: "transition" },
    { number: 79, symbol: "Au", name: "Gold", row: 6, col: 11, group: "transition" },
    { number: 80, symbol: "Hg", name: "Mercury", row: 6, col: 12, group: "transition" },
    { number: 81, symbol: "Tl", name: "Thallium", row: 6, col: 13, group: "post-transition" },
    { number: 82, symbol: "Pb", name: "Lead", row: 6, col: 14, group: "post-transition" },
    { number: 83, symbol: "Bi", name: "Bismuth", row: 6, col: 15, group: "post-transition" },
    { number: 84, symbol: "Po", name: "Polonium", row: 6, col: 16, group: "post-transition" },
    { number: 85, symbol: "At", name: "Astatine", row: 6, col: 17, group: "metalloid" },
    { number: 86, symbol: "Rn", name: "Radon", row: 6, col: 18, group: "noble" },

    { number: 87, symbol: "Fr", name: "Francium", row: 7, col: 1, group: "alkali" },
    { number: 88, symbol: "Ra", name: "Radium", row: 7, col: 2, group: "alkaline" },
    { number: 89, symbol: "Ac", name: "Actinium", row: 10, col: 3, group: "actinide" },
    { number: 90, symbol: "Th", name: "Thorium", row: 10, col: 4, group: "actinide" },
    { number: 91, symbol: "Pa", name: "Protactinium", row: 10, col: 5, group: "actinide" },
    { number: 92, symbol: "U", name: "Uranium", row: 10, col: 6, group: "actinide" },
    { number: 93, symbol: "Np", name: "Neptunium", row: 10, col: 7, group: "actinide" },
    { number: 94, symbol: "Pu", name: "Plutonium", row: 10, col: 8, group: "actinide" },
    { number: 95, symbol: "Am", name: "Americium", row: 10, col: 9, group: "actinide" },
    { number: 96, symbol: "Cm", name: "Curium", row: 10, col: 10, group: "actinide" },
    { number: 97, symbol: "Bk", name: "Berkelium", row: 10, col: 11, group: "actinide" },
    { number: 98, symbol: "Cf", name: "Californium", row: 10, col: 12, group: "actinide" },
    { number: 99, symbol: "Es", name: "Einsteinium", row: 10, col: 13, group: "actinide" },
    { number: 100, symbol: "Fm", name: "Fermium", row: 10, col: 14, group: "actinide" },
    { number: 101, symbol: "Md", name: "Mendelevium", row: 10, col: 15, group: "actinide" },
    { number: 102, symbol: "No", name: "Nobelium", row: 10, col: 16, group: "actinide" },
    { number: 103, symbol: "Lr", name: "Lawrencium", row: 10, col: 17, group: "actinide" },
    { number: 104, symbol: "Rf", name: "Rutherfordium", row: 7, col: 4, group: "transition" },
    { number: 105, symbol: "Db", name: "Dubnium", row: 7, col: 5, group: "transition" },
    { number: 106, symbol: "Sg", name: "Seaborgium", row: 7, col: 6, group: "transition" },
    { number: 107, symbol: "Bh", name: "Bohrium", row: 7, col: 7, group: "transition" },
    { number: 108, symbol: "Hs", name: "Hassium", row: 7, col: 8, group: "transition" },
    { number: 109, symbol: "Mt", name: "Meitnerium", row: 7, col: 9, group: "transition" },
    { number: 110, symbol: "Ds", name: "Darmstadtium", row: 7, col: 10, group: "transition" },
    { number: 111, symbol: "Rg", name: "Roentgenium", row: 7, col: 11, group: "transition" },
    { number: 112, symbol: "Cn", name: "Copernicium", row: 7, col: 12, group: "transition" },
    { number: 113, symbol: "Nh", name: "Nihonium", row: 7, col: 13, group: "post-transition" },
    { number: 114, symbol: "Fl", name: "Flerovium", row: 7, col: 14, group: "post-transition" },
    { number: 115, symbol: "Mc", name: "Moscovium", row: 7, col: 15, group: "post-transition" },
    { number: 116, symbol: "Lv", name: "Livermorium", row: 7, col: 16, group: "post-transition" },
    { number: 117, symbol: "Ts", name: "Tennessine", row: 7, col: 17, group: "metalloid" },
    { number: 118, symbol: "Og", name: "Oganesson", row: 7, col: 18, group: "noble" },
];

export default function Classic() {
    const navigate = useNavigate();

    const TOTAL_GAME_TIME = 30;

    const [currentElement, setCurrentElement] = useState(null);
    const [timeLeft, setTimeLeft] = useState(TOTAL_GAME_TIME);
    const [score, setScore] = useState(0);
    const [feedback, setFeedback] = useState({ type: "", symbol: "" });
    const [answered, setAnswered] = useState([]);
    const [showConfetti, setShowConfetti] = useState(false);
    const [showCongrats, setShowCongrats] = useState(false);
    const [showEndModal, setShowEndModal] = useState(false);
    const [showQuitConfirm, setShowQuitConfirm] = useState(false);
    const [isGameOver, setIsGameOver] = useState(false);
    const [activeModal, setActiveModal] = useState(null);
    const [leaderboardData, setLeaderboardData] = useState([]);

    const [showWelcome, setShowWelcome] = useState(true);
    const [tableBuilt, setTableBuilt] = useState(false);
    const [questionQueue, setQuestionQueue] = useState([]);
    const [wrongFeedbacks, setWrongFeedbacks] = useState([]);

    const [currentlyGrabbing, setGrabbing] = useState(false)

    // ✅ NEW: Track if time is up
    const [isTimeUp, setIsTimeUp] = useState(false);

    // Initialize queue once
    useEffect(() => {
        setQuestionQueue([...elementsData]);
    }, []);

    const saveScoreToLeaderboard = async (answeredQuestions) => {
        try {
            const user = auth.currentUser;
            if (!user) return;

            const db = getDatabase();
            const userRef = ref(db, `users/${user.uid}`);
            const snapshot = await get(userRef);

            let username = "Anonymous";
            let profilePic = "https://via.placeholder.com/50";
            if (snapshot.exists()) {
                if (snapshot.val().username) username = snapshot.val().username;
                if (snapshot.val().profilePic) profilePic = snapshot.val().profilePic;
            }

            const totalTimeTaken = TOTAL_GAME_TIME - timeLeft;
            const leaderboardRef = ref(db, `leaderboards/Classic/${user.uid}`);
            const leaderboardSnap = await get(leaderboardRef);
            const oldData = leaderboardSnap.exists() ? leaderboardSnap.val() : {};
            const updatedGamesPlayed = (oldData.gamesPlayed || 0) + 1;

            await set(leaderboardRef, {
                uid: user.uid,
                name: username,
                email: user.email,
                profilePic,
                score,
                gamesPlayed: updatedGamesPlayed,
                totalTimeTaken,
                timestamp: Date.now(),
            });

            console.log("✅ Score saved to leaderboard!");
        } catch (err) {
            console.error("❌ Error saving score:", err);
        }
    };

    useEffect(() => {
        if (isGameOver) {
            const answeredQuestions = answered.filter((a) => a).length;
            saveScoreToLeaderboard(answeredQuestions);
            setActiveModal("gameover");
        }
    }, [isGameOver]);

    const fetchLeaderboard = async () => {
        try {
            const db = getDatabase();
            const snapshot = await get(ref(db, "leaderboards/timeTrialEasy"));
            if (snapshot.exists()) {
                const data = Object.values(snapshot.val());
                const sorted = data.sort((a, b) => b.score - a.score);
                setLeaderboardData(sorted);
            }
        } catch (err) {
            console.error("❌ Error fetching leaderboard:", err);
        }
    };

    // ✅ Timer logic (modified)
    useEffect(() => {
        if (!currentElement || isGameOver) return;

        const interval = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 1) {
                    setIsTimeUp(true); // ⏰ mark that time is up
                    return 0; // stop at 0
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(interval);
    }, [currentElement, isGameOver]);

    useEffect(() => {
        if (answered.length === elementsData.length && elementsData.length > 0) {
            setShowConfetti(true);
            setShowCongrats(true);
            setTimeout(() => setShowConfetti(false), 8000);
        }
    }, [answered]);

    const setNextElement = (queue) => {
        if (queue.length === 0) {
            setCurrentElement(null);
            return;
        }
        const randomIndex = Math.floor(Math.random() * queue.length);
        const next = queue[randomIndex];
        setCurrentElement(next);

        const updatedQueue = queue.filter((_, i) => i !== randomIndex);
        setQuestionQueue(updatedQueue);

        setTimeLeft(TOTAL_GAME_TIME);
        setIsTimeUp(false); // ✅ reset time-up state for next element
    };

    // ✅ Updated handleAnswer with no score when time is up
    const handleAnswer = (cellSymbol, draggedSymbol) => {
        if (!currentElement) return;

        if (cellSymbol === currentElement.symbol && draggedSymbol === currentElement.symbol) {
            setFeedback({ type: "correct", symbol: cellSymbol });

            if (!isTimeUp) {
                // ⏱ Add score only if time isn’t up
                setScore((prev) => prev + timeLeft);
            } else {
                console.log("⏰ Time’s up — no score awarded.");
            }

            const newAnswered = [...answered, cellSymbol];
            setAnswered(newAnswered);

            setTimeout(() => {
                setFeedback({ type: "", symbol: "" });
                setNextElement(questionQueue);
            }, 800);
        } else {
            setFeedback({ type: "wrong", symbol: cellSymbol });
            setScore((prev) => Math.max(prev - 5, 0));

            const id = Date.now();
            setWrongFeedbacks((prev) => [...prev, { symbol: cellSymbol, id }]);
            setTimeout(() => {
                setWrongFeedbacks((prev) => prev.filter((fb) => fb.id !== id));
            }, 1000);

            setTimeout(() => setFeedback({ type: "", symbol: "" }), 600);
        }
    };

    const handleExit = () => navigate(-1);
    const handleQuit = () => setShowQuitConfirm(true);

    const handleStartNewGame = () => {
        setAnswered([]);
        setScore(0);
        setCurrentElement(null);
        setShowConfetti(false);
        setShowCongrats(false);
        setShowEndModal(false);
        setIsGameOver(false);
        setShowWelcome(false);
        setTableBuilt(true);
        const newQueue = [...elementsData];
        setQuestionQueue(newQueue);
        setNextElement(newQueue);
    };

    const handleStartGame = () => {
        setShowWelcome(false);
        setTimeout(() => setTableBuilt(true), 1000);
        setTimeout(() => setNextElement([...elementsData]), 2000);
    };

    return (
        <div className="periodic-game">
            <video
                autoPlay
                loop
                muted
                playsInline
                preload="auto"
                className="background-video"
            >
                <source src="/videos/4.mp4" type="video/mp4" />
            </video>

            {showConfetti && (
                <Confetti width={window.innerWidth} height={window.innerHeight} />
            )}

            <div
                className="top-buttons"
                style={{ position: "fixed", top: "10px", left: "10px", zIndex: 999 }}
            >
                <button
                    className="exit-btn"
                    onClick={handleQuit}
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

            {showWelcome && (
                <div className="welcome-screen" onClick={handleStartGame}>
                    <h1>Welcome to Periodic Quest</h1>
                    <small><strong>Symbols</strong> of a chemical element are given and you must quickly find its correct position on the periodic table.</small>
                    <h3>Click anywhere to start</h3>
                </div>
            )}

            {showCongrats && !showEndModal && (
                <div className="floating-congrats" onClick={() => setShowEndModal(true)}>
                    <h2> Congratulations! </h2>
                    <br />
                    You answered all {elementsData.length} elements!
                    <p className="click-hint">(Click anywhere to continue)</p>
                </div>
            )}

            {/* --- Game Over Modal --- */}
            {isGameOver && activeModal === "gameover" && (
                <div className="game-over-modal" style={{ zIndex: 20 }}>
                    <div className="modal-content">
                        <h1>Game Over!</h1>
                        <p>Final Score: {score}</p>
                        <div className="modal-buttons">
                            <button
                                className="btn try-again"
                                onClick={() => handleStartNewGame()}
                            >
                                Try Again
                            </button>
                            <button className="btn menu" onClick={() => navigate(-1)}>
                                Exit
                            </button>
                            <button
                                className="btn leaderboard"
                                onClick={() => {
                                    fetchLeaderboard();
                                    setActiveModal("leaderboard");
                                }}
                            >
                                View Leaderboard
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* --- Leaderboard Modal --- */}
            {isGameOver && activeModal === "leaderboard" && (
                <div className="leaderboard-modal" style={{ zIndex: 20 }}>
                    <div className="modal-content leaderboard-content">
                        <h2>Leaderboard</h2>
                        <div className="leaderboard-top3">
                            {[1, 0, 2].map((idx, position) => {
                                if (!leaderboardData[idx]) return null;
                                const player = leaderboardData[idx];
                                const podiumClass =
                                    position === 0
                                        ? "gold"
                                        : position === 1
                                            ? "silver"
                                            : "bronze";
                                return (
                                    <div key={idx} className={`podium ${podiumClass}`}>
                                        {position === 0 && <div className="crown">👑</div>}
                                        <div className="avatar">
                                            <img src={player.profilePic} alt={player.name} />
                                        </div>
                                        <p className="name">{player.name}</p>
                                        <p className="score">Score: {player.score}</p>
                                        <p className="username">{player.email}</p>
                                    </div>
                                );
                            })}
                        </div>

                        <div className="leaderboard-list">
                            {leaderboardData.slice(3).map((player, idx) => (
                                <div key={idx} className="leaderboard-row">
                                    <div className="avatar">
                                        <img src={player.profilePic} alt={player.name} />
                                    </div>
                                    <div className="info">
                                        <p className="username">{player.email}</p>
                                    </div>
                                    <p className="score">{player.score}</p>
                                </div>
                            ))}
                        </div>

                        <button
                            className="btn close"
                            onClick={() => setActiveModal("gameover")}
                        >
                            Back
                        </button>
                    </div>
                </div>
            )}
            <div className="score-container">
                <span>Score</span>
                <span>{score}</span>
            </div>

            {currentElement && !showEndModal && !showWelcome && tableBuilt && (
                <div className="current-card-container">
                    <div
                        className="element-card"
                        draggable
                        onDragStart={(e) =>
                            e.dataTransfer.setData("symbol", currentElement.symbol)
                        }
                    >
                        {currentElement.symbol}
                    </div>
                </div>
            )}

            {!showEndModal && !showWelcome && tableBuilt && false && (
                <>
                    <p>
                        Time Left:{" "}
                        <span style={{ color: isTimeUp ? "#ff4d4d" : "#fff" }}>
                            {timeLeft}s
                        </span>
                    </p>
                    
                </>
            )}


            

            <div className={`periodic-grid ${tableBuilt ? "built" : ""}`}>
                {elementsData.map((el, idx) => (
                    <div
                        key={el.symbol}
                        className={`cell ${el.group} 
                            ${feedback.symbol === el.symbol ? feedback.type : ""} 
                            ${answered.includes(el.symbol) ? "revealed" : ""}`}
                        style={{
                            gridRow: el.row,
                            gridColumn: el.col,
                            animationDelay: !tableBuilt ? `${idx * 0.01}s` : "0s",
                        }}
                        onDragOver={(e) => e.preventDefault()}
                        onDrop={(e) => {
                            const draggedSymbol = e.dataTransfer.getData("symbol");
                            if (!draggedSymbol || answered.includes(el.symbol)) return;
                            handleAnswer(el.symbol, draggedSymbol);
                        }}
                    >
                        <span className="number">
                            {answered.includes(el.symbol) ? el.number : ""}
                        </span>
                        <span className="symbol">
                            {answered.includes(el.symbol) ? el.symbol : ""}
                        </span>

                        {wrongFeedbacks
                            .filter((fb) => fb.symbol === el.symbol)
                            .map((fb) => (
                                <span key={fb.id} className="wrong-feedback">
                                    -5
                                </span>
                            ))}
                    </div>
                ))}
            </div>

            {showQuitConfirm && (
                <div className="quit-confirm-overlay">
                    <div className="quit-confirm-modal">
                        <h2>Quit Game?</h2>
                        <p>Are you sure you want to end the game?</p>
                        <div className="quit-confirm-buttons">
                            <button
                                className="yes-btn"
                                onClick={() => {
                                    setIsGameOver(true);
                                    setActiveModal("gameover");
                                    setShowEndModal(false);
                                    setShowCongrats(false);
                                    setShowConfetti(false);
                                    setCurrentElement(null);
                                    setShowQuitConfirm(false);
                                }}
                            >
                                Yes
                            </button>
                            <button
                                className="no-btn"
                                onClick={() => setShowQuitConfirm(false)}
                            >
                                No
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}