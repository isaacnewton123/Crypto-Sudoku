# Crypto Sudoku Game Sounds

![Crypto Sudoku Logo](https://raw.githubusercontent.com/isaacnewton123/sudoku-NFT/refs/heads/main/Removal-779.png)

## Audio assets for the Crypto Sudoku gaming experience

[![Format: WAV](https://img.shields.io/badge/Format-WAV-blue.svg)](https://en.wikipedia.org/wiki/WAV)
[![Optimized](https://img.shields.io/badge/Size-Optimized-brightgreen.svg)](https://web.dev/fast/)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)

## 🌟 Overview

This directory contains all the sound effects used in the Crypto Sudoku game. These audio files enhance the user experience by providing auditory feedback for various game actions and events.

## 🔊 Sound Files

| Filename | Purpose | Duration | Size | Playback Trigger |
|----------|---------|----------|------|-----------------|
| `correct.wav` | Played when a player makes a correct move | 0.3s | ~5KB | Cell filled with correct number |
| `error.wav` | Played when a player makes a mistake | 0.4s | ~7KB | Cell filled with incorrect number |
| `countdown.wav` | Played during the game start countdown | 3.0s | ~15KB | Game initialization |
| `win.wav` | Played when a player successfully completes a puzzle | 2.5s | ~25KB | Puzzle completion |
| `gameover.wav` | Played when a player reaches the maximum mistakes limit | 1.8s | ~20KB | Exceeding mistake limit |

## 🎵 Audio Design Philosophy

The sound design for Crypto Sudoku follows these core principles:

- **👂 Non-Intrusive**: Sounds are subtle and don't disrupt concentration
- **🔄 Informative**: Each sound clearly conveys a specific game state
- **💫 Satisfying**: Provides pleasing feedback for correct actions
- **⚡ Responsive**: Immediate playback with minimal latency
- **📱 Mobile-Friendly**: Optimized for both headphones and device speakers

## 💻 Implementation

These sound files are implemented in the game through the `gameAudio.js` utility:

```javascript
// src/utils/audio.js
class GameAudio {
  constructor() {
    this.enabled = true;
    this.audioInstances = new Map();
    this.lastPlayedTime = new Map();
    this.cooldownPeriod = 50; // Minimum ms between plays of the same sound
    this.preloadAudio();
  }

  preloadAudio() {
    const audioFiles = {
      correct: '/sounds/correct.wav',
      error: '/sounds/error.wav',
      win: '/sounds/win.wav',
      gameover: '/sounds/gameover.wav',
      countdown: '/sounds/countdown.wav'
    };
    
    // Create a single instance for each sound
    for (const [key, path] of Object.entries(audioFiles)) {
      const audio = new Audio(path);
      audio.preload = 'auto';
      this.audioInstances.set(key, audio);
      this.lastPlayedTime.set(key, 0);
    }
  }

  play(soundName) {
    if (!this.enabled) return;
    
    const audio = this.audioInstances.get(soundName);
    if (!audio) return;
    
    const now = Date.now();
    const lastPlayed = this.lastPlayedTime.get(soundName) || 0;
    
    // Prevent too-frequent playing of the same sound
    if (now - lastPlayed < this.cooldownPeriod) return;
    
    // Update last played time
    this.lastPlayedTime.set(soundName, now);

    // Play the sound
    audio.pause();
    audio.currentTime = 0;
    audio.play().catch(e => console.warn(`Audio playback failed: ${e}`));
  }

  setEnabled(enabled) {
    this.enabled = enabled;
  }
}

export const gameAudio = new GameAudio();
```

## 🎮 User Controls

The game provides a simple UI toggle for users to control sound:

```jsx
// Sound toggle button from Game.jsx
<button 
  className="header-button icon-button"
  onClick={() => setIsSoundEnabled(!isSoundEnabled)}
  title={isSoundEnabled ? "Disable Sound" : "Enable Sound"}
>
  {isSoundEnabled ? <VolumeIcon /> : <MuteIcon />}
</button>
```

The sound preference is saved to localStorage to persist across sessions:

```javascript
useEffect(() => {
  gameAudio.setEnabled(isSoundEnabled);
  localStorage.setItem('sudoku-sound-enabled', JSON.stringify(isSoundEnabled));
}, [isSoundEnabled]);
```

## 📱 Technical Considerations

### Browser Compatibility

| Browser | Support | Notes |
|---------|---------|-------|
| Chrome | ✅ Full | Excellent audio performance |
| Firefox | ✅ Full | Good audio performance |
| Safari | ✅ Full | May require user interaction before playback |
| Edge | ✅ Full | Excellent audio performance |
| Mobile Chrome | ✅ Full | Requires user interaction before first playback |
| Mobile Safari | ✅ Full | Requires user interaction before first playback |

### Mobile Optimization

On mobile devices, sound playback is optimized by:

1. **Initialization on Interaction**: Sounds are initialized on first user interaction to comply with mobile browser autoplay policies
2. **Instance Reuse**: Audio instances are reused to conserve memory
3. **Debouncing**: Prevents rapid-fire sound triggering that could cause audio distortion
4. **Volume Normalization**: All sounds maintain consistent volume levels

### Accessibility Considerations

- Sound effects complement visual feedback but are not required for gameplay
- All game events with audio cues also have visual indicators
- Sound preferences are saved in localStorage for persistent user experience

## 🔧 Technical Specifications

- **Format**: WAV (Waveform Audio File Format)
- **Channels**: Mono
- **Sample Rate**: 44.1 kHz
- **Bit Depth**: 16-bit
- **Encoding**: PCM
- **Compression**: None (for maximum compatibility)

## 📝 Adding New Sounds

When adding new sound effects to this collection:

1. Follow the existing naming convention
2. Keep files under 30KB and under 3 seconds when possible
3. Use WAV format for maximum compatibility
4. Normalize volume to match existing sounds
5. Add the new sound to the `audioFiles` object in `gameAudio.js`
6. Update this README with the new sound information

## 🔒 Copyright Information

All sound effects are either:
- Created specifically for Crypto Sudoku
- Licensed from royalty-free sources
- Available under permissive licenses compatible with our MIT license

## 📄 License

All audio assets in this directory are licensed under the MIT License - see the [LICENSE](../../LICENSE.md) file for details.

---

<p align="center">
  <b>Crypto Sudoku: Play, Solve, Earn</b><br>
  <a href="https://cryptosudoku.xyz">Website</a> •
  <a href="https://twitter.com/CryptoSudokuG">Twitter</a> •
  <a href="https://discord.gg/8htQ6wn9Md">Discord</a> •
  <a href="https://t.me/cryptosudokugame">Telegram</a>
</p>
