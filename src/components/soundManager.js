// soundManager.js
const soundManager = {
    sounds: {
        correct: new Audio("videos/success.mp3"),        // ✅ plays when the answer is correct
        wrong: new Audio("videos/wronganswer.mp3"),      // ❌ plays when the answer is wrong
        gameOver: new Audio("videos/gameover.mp3"),      // 💀 plays when game over
        congrats: new Audio("videos/congratulation.mp3"),// 🎉 plays when player wins or finishes
    },

    play(name) {
        const sound = this.sounds[name];
        if (sound) {
            sound.currentTime = 0; // restart sound
            sound.volume = this.volume;
            sound.play().catch(err => console.warn("Sound play error:", err));
        }
    },

    stop(name) {
        const sound = this.sounds[name];
        if (sound) sound.pause();
    },

    volume: 0.7, // default volume (0 to 1)
    muted: false,

    setVolume(level) {
        this.volume = Math.min(Math.max(level, 0), 1);
    },

    mute() {
        this.muted = true;
        Object.values(this.sounds).forEach(s => (s.muted = true));
    },

    unmute() {
        this.muted = false;
        Object.values(this.sounds).forEach(s => (s.muted = false));
    },
};

export default soundManager;