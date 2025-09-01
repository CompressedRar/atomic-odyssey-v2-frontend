import { useEffect } from "react";
import "../styles/PlayerInfo.css"

function PlayerInformation(){
    return (
        <div className="player-info-container">
            <div className="profile-image-container">
                <img src="https://caricom.org/wp-content/uploads/Floyd-Morris-Remake-1024x879-1.jpg" alt="" />
            </div>
            <div className="player-information">
                <span className="player-ign">
                    <span>Jiovanni</span>
                    <span className="additional-player-info">
                        <span className="player-mmr">
                            <span className="material-symbols-outlined">trophy</span>
                            <span>1000</span>
                        </span>
                        <span className="player-star">
                            <span className="material-symbols-outlined">star_half</span>
                            <span>12</span>
                        </span>
                    </span>
                </span>
                
            </div>

            <div className="player-tools">
                <span className="material-symbols-outlined">group</span>
                <span className="material-symbols-outlined">settings</span>
            </div>
        </div>
    )
}

export default PlayerInformation