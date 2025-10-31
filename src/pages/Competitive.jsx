import { div } from "three/tsl";
import BattleRoom from "./BattleRoom";
import Lobby from "./CompetitiveLobby";
import { useState } from "react";
import MatchmakingLobby from "./MatchMakingLobby";
import "../styles/Competitive.css";
import "../styles/animations.css";

export default function Competitive(){
    const [roomInfo, setRoomInfo] = useState(null);
    return (
        <div className="pvp-mode">
        {!roomInfo ? (
            // 👇 We pass a function into the Lobby
            <MatchmakingLobby
            onStartGame={(roomCode, userInfo) =>
                setRoomInfo({ roomCode, userInfo })
            }
            />
        ) : (
            // 👇 Once onStartGame() runs, we switch to BattleRoom
            <BattleRoom {...roomInfo} />
        )}
        </div>
    )
}