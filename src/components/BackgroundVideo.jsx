import { useState } from "react";


function BackgroundVideo(){
    
    const [currentURL, setURL] = useState("videos/bg-vid-1.webm")
    const [opacity, setOpacity] = useState(0.3)
    const delay = 200
    const videoURLs = [ "videos/bg-vid-1.webm", 
                        "videos/bg-vid-7.webm",
                        "videos/bg-vid-9.webm",
                        "videos/bg-vid-10.webm" ]

    async function handleVideoChange() {
        setOpacity(0)
        var randomIndex = (Math.random() * 3).toFixed(0)
        var a = await setTimeout(()=>{
            
            setURL(videoURLs[randomIndex])

            setOpacity(0.3)
        }, 1000)
        
    }
    return (
        
        <div className="background-video" style={{opacity: opacity}}> 
            <video src={currentURL} onEnded={()=>{handleVideoChange()}} autoPlay >

            </video>
        </div>
    )
}

export default BackgroundVideo