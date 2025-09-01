import { useEffect } from "react";
import "../styles/Quizzes.css"
import "../styles/animations.css"

function Quizzes(){
    
    return(
        <div className="quizzes-container">
            <h1>Game Modes</h1>
            <div className="quiz-modes-container">
                <span className="quiz-mode" id="classic">
                    <div className="quiz-bg" ></div>
                    <div className="quiz-grad"></div>
                    <div className="quiz-desc">
                        <span className="mode-name">Classic</span>
                        <span className="mode-desc">Test your knowledge with all of the elements.</span>
                    </div>
                </span>

                <span className="quiz-mode" id="time">
                    <div className="quiz-bg" ></div>
                    <div className="quiz-grad"></div>
                    <div className="quiz-desc">
                        <span className="mode-name">Time Trial</span>
                        <span className="mode-desc">How fast can you clear all of the questions?</span>
                    </div>
                </span>

                <span className="quiz-mode" id="endless">
                    <div className="quiz-bg" ></div>
                    <div className="quiz-grad"></div>
                    <div className="quiz-desc">
                        <span className="mode-name">Endless</span>
                        <span className="mode-desc">Survive endless questions as long as you can.</span>
                    </div>
                </span>

                <span className="quiz-mode" id="pvp">
                    <div className="quiz-bg" ></div>
                    <div className="quiz-grad"></div>
                    <div className="quiz-desc">
                        <span className="mode-name">Competitive</span>
                        <span className="mode-desc">Compete and clash with other players.</span>
                    </div>
                </span>
            </div>
            <br />
            <h1>Categorized</h1>
            <div className="quiz-modes-container">
                <span className="quiz-mode" id="nonmetals">
                    <div className="quiz-bg" ></div>
                    <div className="quiz-grad"></div>
                    <div className="quiz-desc">
                        <span className="mode-name">Non Metals</span>
                        <span className="mode-desc">Explore the adaptability of Non-Metals</span>
                    </div>
                </span>

                <span className="quiz-mode" id="metalloids">
                    <div className="quiz-bg" ></div>
                    <div className="quiz-grad"></div>
                    <div className="quiz-desc">
                        <span className="mode-name">Metalloids</span>
                        <span className="mode-desc">Metalloids: For all your semi-electrical needs.</span>
                    </div>
                </span>

                <span className="quiz-mode" id="metals">
                    <div className="quiz-bg" ></div>
                    <div className="quiz-grad"></div>
                    <div className="quiz-desc">
                        <span className="mode-name">Metals</span>
                        <span className="mode-desc">Built to last, designed to impress.</span>
                    </div>
                </span>

                <span className="quiz-mode" id="noblegas">
                    <div className="quiz-bg" ></div>
                    <div className="quiz-grad"></div>
                    <div className="quiz-desc">
                        <span className="mode-name">Noble Gases</span>
                        <span className="mode-desc">The element of non-commitment.</span>
                    </div>
                </span>
            </div>
        </div>
    )
}

export default Quizzes