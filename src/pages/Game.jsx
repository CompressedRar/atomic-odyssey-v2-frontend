import { useState } from "react";
import {Swiper, SwiperSlide} from "swiper/react"
import "swiper/css";
import "swiper/css/pagination";
import {Pagination} from "swiper/modules"

import Table from "./Table";
import PlayerInformation from "../components/PlayerInformation";
import BackgroundVideo from "../components/BackgroundVideo";
import "../styles/animations.css"

import "../styles/index.css"

function Game() {

    //lalagay mo dito sa icon name yung galing sa google icons

    function bulletMaker(icon_name, bullet_name){
        return `<span class="material-symbols-outlined" style="display:flex; flex-direction: column;">
                        ${String(icon_name).toLowerCase()}
                    </span> <span class="bullet-name" style = "font-size: 0.6rem;">${bullet_name}</span>`
    }
    const pages = [bulletMaker("table", "Table"), bulletMaker("quiz", "Quizzes"), bulletMaker("swords", "VS Mode"), bulletMaker("scoreboard", "Leaderboards")]
    
    
    return (
        <div className="game-wrapper">
            <BackgroundVideo></BackgroundVideo>
            <PlayerInformation></PlayerInformation>

            <Swiper modules = {[Pagination]} 
                    pagination = {{clickable: true, renderBullet: (index, className) => {
                        return `<span class = "${className}">                             
                            ${pages[index]}
                        </span>`
                    }}} 
                    spaceBetween={500} 
                    slidesPerView={1} >
                <SwiperSlide> <Table/> </SwiperSlide>
                <SwiperSlide> <h1>TEST 1</h1> </SwiperSlide>
                <SwiperSlide> <h1>TEST 2</h1> </SwiperSlide>
                <SwiperSlide> <h1>TEST 3</h1> </SwiperSlide>
            </Swiper>
        </div>
    )
}

export default Game