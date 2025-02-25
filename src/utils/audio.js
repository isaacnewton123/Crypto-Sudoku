// src/utils/audio.js
class GameAudio {
    constructor() {
      this.enabled = true;
      this.poolSize = 3; // Number of instances per sound
      this.audioPool = new Map();
      this.currentIndex = new Map();
      this.preloadAudio();
    }
  
    preloadAudio() {
      const audioFiles = {
        correct: '/sounds/correct.wav',
        error: '/sounds/error.wav',
        win: '/sounds/win.wav',
        gameover: '/sounds/gameover.wav'
      };
  
      // Create pool for each sound
      for (const [key, path] of Object.entries(audioFiles)) {
        const pool = [];
        for (let i = 0; i < this.poolSize; i++) {
          const audio = new Audio(path);
          audio.preload = 'auto';
          pool.push(audio);
        }
        this.audioPool.set(key, pool);
        this.currentIndex.set(key, 0);
      }
  
      // Warm up audio context on first user interaction
      const warmUpAudio = () => {
        for (const pool of this.audioPool.values()) {
          pool[0].play().catch(() => {}).then(() => {
            pool[0].pause();
            pool[0].currentTime = 0;
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
  
      const pool = this.audioPool.get(soundName);
      if (!pool) return;
  
      // Get next audio instance from pool
      let index = this.currentIndex.get(soundName);
      const audio = pool[index];
  
      // Reset and play
      audio.currentTime = 0;
      const playPromise = audio.play();
      if (playPromise) {
        playPromise.catch(e => console.warn('Audio playback failed:', e));
      }
  
      // Update index for next play
      index = (index + 1) % this.poolSize;
      this.currentIndex.set(soundName, index);
    }
  
    setEnabled(enabled) {
      this.enabled = enabled;
    }
  }
  
  export const gameAudio = new GameAudio();