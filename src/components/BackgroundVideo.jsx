import { useState, useEffect, useRef } from "react";

function BackgroundVideo() {
  const [currentURL, setCurrentURL] = useState("videos/3.mp4");
  const [opacity, setOpacity] = useState(0.3);
  const videoRef = useRef(null);
  const preloaderRef = useRef(null);

  const videoURLs = [
    "videos/3.1.mp4",
    "videos/3.2.mp4",
    "videos/3.mp4",
    "videos/3.3.mp4",
  ];

  // Duration before switching videos (in seconds)
  const VIDEO_DURATION = 20; // ⏱ adjust to match your video lengths

  const handleVideoChange = async () => {
    setOpacity(0);

    // Pick a new random video that’s different
    let randomIndex;
    do {
      randomIndex = Math.floor(Math.random() * videoURLs.length);
    } while (videoURLs[randomIndex] === currentURL);

    const nextURL = videoURLs[randomIndex];

    // Preload new video silently
    const preloader = preloaderRef.current;
    if (preloader) {
      preloader.src = nextURL;
      await new Promise((resolve) => {
        preloader.oncanplaythrough = resolve;
      });
    }

    // Swap and fade back in
    setCurrentURL(nextURL);
  };

  // ✅ Continuous video playback + safety restart
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const ensurePlaying = () => {
      if (video.paused) {
        video.play().catch(() => { });
      }
    };

    // Play and periodically ensure it stays running
    video.play().catch(() => { });
    const checkInterval = setInterval(ensurePlaying, 5000); // every 5s
    return () => clearInterval(checkInterval);
  }, [currentURL]);

  // ✅ Change video every N seconds (instead of relying on onEnded)
  useEffect(() => {
    const interval = setInterval(() => {
      handleVideoChange();
    }, VIDEO_DURATION * 1000);
    return () => clearInterval(interval);
  }, [currentURL]);

  // ✅ Prevent duplicate background-video instances
  useEffect(() => {
    const existing = document.querySelector(".background-video");
    if (existing && existing !== videoRef.current?.parentNode) {
      console.warn("Duplicate background video detected — removing extra.");
      existing.remove();
    }
  }, []);

  return (
    <>
      <div
        className="background-video"
        style={{
          opacity,
          transition: "opacity 1s ease",
          position: "fixed",
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          zIndex: -1,
          overflow: "hidden",
        }}
      >
        <video
          ref={videoRef}
          src={currentURL}
          autoPlay
          muted
          loop // ✅ keep looping each clip until next change
          playsInline
          style={{
            scale:1,
            objectFit: "cover",
          }}
        />
      </div>

      {/* Hidden preloader */}
      <video ref={preloaderRef} muted style={{ display: "none" }} />
    </>
  );
}

export default BackgroundVideo;