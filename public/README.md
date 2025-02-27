# Crypto Sudoku Public Assets

This directory contains the static assets for the Crypto Sudoku application, including images, sounds, and favicons.

## Directory Structure

```
public/
├── api/                 # API mock data (if applicable)
├── assets/              # Image assets
│   └── photo/           # Photos and graphics
├── favicon/             # Favicon files for various platforms
│   ├── apple-touch-icon.png
│   ├── favicon.ico
│   ├── favicon.svg
│   ├── favicon-96x96.png
│   └── site.webmanifest
└── sounds/              # Game sound effects
    ├── correct.wav      # Sound for correct moves
    ├── countdown.wav    # Sound for game countdown
    ├── error.wav        # Sound for incorrect moves
    ├── gameover.wav     # Sound for game over
    └── win.wav          # Sound for game completion
```

## Assets

### Game Logo

The game logo is available in multiple sizes:
- `logo-40x40.png`: Small logo for navbar and icons
- `Logo-400x400.png`: Large logo for main screens

### Screenshots

The game screenshots showcase different aspects of gameplay:
- `screenshot1.png`: Main game interface
- `screenshot2.png`: Leaderboard view
- `screenshot3.png`: Gameplay in action

### Team Photos

Photos of the development team:
- `hanif.jpg`: Hanif Maulana - Initiator & Blockchain Specialist
- `RidhoTama.jpg`: Ridho Tamma - UI/UX Designer
- `irham-taufik.jpg`: Irham Taufik - Server Development
- `luigi.webp`: NUBI - Marketing Strategist & Community Management
- `SOB.png`: SOB Pratama - Marketing Strategist

## Sound Effects

The game includes the following sound effects to enhance the user experience:

- **correct.wav**: Played when a player makes a correct move
- **error.wav**: Played when a player makes an incorrect move
- **countdown.wav**: Played during the countdown before starting a new game
- **win.wav**: Played when a player successfully completes a puzzle
- **gameover.wav**: Played when a player loses (exceeds maximum mistakes)

## Favicons

The favicon files ensure the game is properly represented across different platforms:

- `favicon.ico`: Standard favicon for browsers
- `favicon.svg`: Vector version for modern browsers
- `favicon-96x96.png`: 96x96 pixel favicon
- `apple-touch-icon.png`: Icon for iOS devices
- `site.webmanifest`: Web app manifest for progressive web app functionality

## Usage

These assets are loaded by the application as needed. The paths to these assets are referenced in the source code as follows:

```javascript
// Example sound usage in audio.js
const audioFiles = {
  correct: '/sounds/correct.wav',
  error: '/sounds/error.wav',
  win: '/sounds/win.wav',
  gameover: '/sounds/gameover.wav',
  countdown: '/sounds/countdown.wav'
};

// Example logo usage in HTML
<img src="assets/photo/logo-40x40.png" alt="Crypto Sudoku Logo">
```

## Adding New Assets

When adding new assets to this directory:

1. Place images in the appropriate subdirectory under `assets/`
2. Place sound files in the `sounds/` directory
3. Update the application code to reference the new assets
4. Compress images appropriately to optimize loading times
5. Use web-friendly formats (PNG for transparency, JPEG for photos)
6. Ensure sound files are in widely supported formats (WAV/MP3)

## Team

- **Hanif Maulana** - Initiator & Blockchain Specialist
- **Ridho Tamma** - UI/UX Designer
- **Irham Taufik** - Server Development
- **NUBI** - Marketing Strategist & Community Management
- **SOB Pratama** - Marketing Strategist

## Contact

- Email: info@cryptosudoku.xyz
- Twitter: [@CryptoSudokuG](https://x.com/CryptoSudokuG)
- Discord: [Join our server](https://discord.gg/8htQ6wn9Md)
- Telegram: [@cryptosudokugame](https://t.me/cryptosudokugame)

---

**Play, Solve, Earn**
