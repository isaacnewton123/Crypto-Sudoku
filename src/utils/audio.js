// src/utils/audio.js
class GameAudio {
  constructor() {
    this.enabled = true;
    this.audioInstances = new Map(); // Single instance per sound type
    this.lastPlayedTime = new Map(); // Track when each sound was last played
    this.cooldownPeriod = 50; // Minimum ms between plays of the same sound
    this.preloadAudio();
  }

  preloadAudio() {
    const audioFiles = {
      correct: '/sounds/correct.wav',
      error: '/sounds/error.wav',
      win: '/sounds/win.wav',
      gameover: '/sounds/gameover.wav',
      countdown: '/sounds/countdown.wav'  // Satu file untuk seluruh countdown
    };

    // Create a single instance for each sound
    for (const [key, path] of Object.entries(audioFiles)) {
      try {
        const audio = new Audio(path);
        audio.preload = 'auto';
        this.audioInstances.set(key, audio);
        this.lastPlayedTime.set(key, 0);
      } catch (error) {
        console.error(`Failed to create audio instance for ${key}:`, error);
      }
    }

    // Warm up audio context on first user interaction - needed for mobile browsers
    const warmUpAudio = () => {
      const audio = this.audioInstances.get('correct');
      if (audio) {
        // Just create and immediately stop to warm up the audio context
        audio.volume = 0.01; // Nearly silent
        audio.play().catch(() => {}).then(() => {
          audio.pause();
          audio.currentTime = 0;
          audio.volume = 1; // Restore volume
        });
      }
      document.removeEventListener('click', warmUpAudio);
      document.removeEventListener('keydown', warmUpAudio);
    };

    document.addEventListener('click', warmUpAudio);
    document.addEventListener('keydown', warmUpAudio);
  }

  play(soundName) {
    if (!this.enabled) return;

    const audio = this.audioInstances.get(soundName);
    if (!audio) {
      console.warn(`Sound not found: ${soundName}`);
      return;
    }
    
    const now = Date.now();
    const lastPlayed = this.lastPlayedTime.get(soundName) || 0;
    
    // Prevent too-frequent playing of the same sound (debounce)
    if (now - lastPlayed < this.cooldownPeriod) {
      console.log(`Skipping sound ${soundName} - too soon after last play`);
      return;
    }
    
    // Update last played time
    this.lastPlayedTime.set(soundName, now);

    // Stop any current playback of this sound
    try {
      audio.pause();
      audio.currentTime = 0;
      
      // Play the sound
      const playPromise = audio.play();
      if (playPromise) {
        playPromise.catch(e => {
          console.warn(`Audio playback failed for ${soundName}:`, e);
        });
      }
    } catch (error) {
      console.error(`Error playing sound ${soundName}:`, error);
    }
  }

  setEnabled(enabled) {
    this.enabled = enabled;
  }
}

export const gameAudio = new GameAudio();