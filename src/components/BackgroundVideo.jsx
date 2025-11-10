import { useState, useEffect, useRef } from "react";

function BackgroundVideo() {
  const videoURLs = [
    "videos/3.1.mp4",
    "videos/3.2.mp4",
    "videos/3.mp4",
    "videos/3.3.mp4",
  ];

  const VIDEO_DURATION = 60; // seconds

  const [currentURL, setCurrentURL] = useState(videoURLs[0]);
  const [opacity, setOpacity] = useState(0.3);

  const videoRef = useRef(null);
  const preloaderRef = useRef(null);

  // Pick a random next video that’s different from the current
  const getRandomNextURL = () => {
    let next;
    do {
      next = videoURLs[Math.floor(Math.random() * videoURLs.length)];
    } while (next === currentURL);
    return next;
  };

  // Change video function with preloading and crossfade
  const changeVideo = async () => {
    const nextURL = getRandomNextURL();

    // Preload next video
    const preloader = preloaderRef.current;
    if (preloader) {
      preloader.src = nextURL;
      await new Promise((resolve) => {
        preloader.oncanplaythrough = resolve;
      });
    }

    // Fade out current video
    setOpacity(0);
    setTimeout(() => {
      // Swap video
      setCurrentURL(nextURL);
      setOpacity(0.3);

      // Play the new video
      videoRef.current.play().catch(() => { });
    }, 500); // match fade duration
  };

  // Continuous looping every VIDEO_DURATION seconds
  useEffect(() => {
    const interval = setInterval(() => {
      changeVideo();
    }, VIDEO_DURATION * 1000);

    return () => clearInterval(interval);
  }, [currentURL]);

  // Ensure video keeps playing (some browsers pause)
  useEffect(() => {
    const interval = setInterval(() => {
      if (videoRef.current && videoRef.current.paused) {
        videoRef.current.play().catch(() => { });
      }
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // Start first video immediately
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play().catch(() => { });
    }
  }, []);

  return (
    <>
      <div
        className="background-video"
        style={{
          opacity,
          transition: "opacity 0.5s ease",
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
          playsInline
          style={{
            width: "100%",
            height: "100%",
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