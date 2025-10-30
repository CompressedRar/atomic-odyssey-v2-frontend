import { useRef, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import { Pagination } from "swiper/modules";

import Table from "./Table";
import Quizzes from "./Quizzes";
import Leaderboard from "./Leaderboard";
import PlayerInformation from "../components/PlayerInformation";
import BackgroundVideo from "../components/BackgroundVideo";
import "../styles/animations.css";
import "../styles/index.css";

function Game() {
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

    function bulletMaker(icon_name, bullet_name) {
        return `<span class="material-symbols-outlined" style="display:flex; flex-direction: column;">
              ${String(icon_name).toLowerCase()}
            </span> 
            <span class="bullet-name" style="font-size: 0.6rem;">
              ${bullet_name}
            </span>`;
    }

    const pages = [
        bulletMaker("table", "Table"),
        bulletMaker("swords", "Play"),
        bulletMaker("scoreboard", "Leaderboards"),
    ];

    return (
        <div className="game-wrapper">
            <BackgroundVideo />
            <PlayerInformation />
            
            <audio
                ref={audioRef}
                src="videos/sound.mp4"
                loop
                autoPlay
                style={{ display: "none" }}
            />

            <Swiper
                modules={[Pagination]}
                pagination={{
                    clickable: true,
                    renderBullet: (index, className) => {
                        return `<span class="${className}">
                      ${pages[index]}
                    </span>`;
                    },
                }}
                spaceBetween={500}
                slidesPerView={1}
            >
                <SwiperSlide>
                    <Table />
                </SwiperSlide>
                <SwiperSlide>
                    <Quizzes />
                </SwiperSlide>
                <SwiperSlide>
                    <Leaderboard />
                </SwiperSlide>
            </Swiper>
        </div>
    );
}

export default Game;