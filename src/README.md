# Crypto Sudoku Frontend

The frontend web application for Crypto Sudoku, a blockchain-powered gaming experience that combines traditional Sudoku puzzles with crypto rewards.

## Overview

This React-based frontend provides the user interface and game mechanics for Crypto Sudoku. Players can connect their crypto wallets, play Sudoku puzzles, and submit their scores to the blockchain leaderboard.

## Features

- **Blockchain Integration**: Connect with wallet providers through RainbowKit and Wagmi
- **Game Mechanics**: Classic Sudoku gameplay with multiple difficulty levels
- **NFT Verification**: NFT-gated access to gameplay
- **Score Submission**: Submit verified scores to blockchain leaderboards
- **Multi-network Support**: Compatible with Mint Sepolia and Monad Testnet
- **Dark/Light Mode**: Theme toggling with user preference storage
- **Sound Effects**: Immersive audio feedback with toggle capability
- **Responsive Design**: Optimized for desktop and mobile devices

## Project Structure

```
src/
├── components/           # React components
│   ├── modals/           # Modal components (Win, GameOver, etc.)
│   └── ...               # Other UI components
├── context/              # React context providers
│   └── ThemeContext.jsx  # Dark/light mode theming
├── styles/               # CSS stylesheets
│   ├── animations.css    # Animation definitions
│   ├── board.css         # Game board styling
│   └── ...               # Other stylesheets
├── utils/                # Utility functions
│   ├── audio.js          # Sound management
│   ├── signatureService.js # Blockchain signature handling
│   └── sudoku.js         # Sudoku puzzle generation and validation
├── config/               # Configuration files
│   └── networks.js       # Blockchain network definitions
└── App.jsx               # Main application component
```

## Tech Stack

- **React**: UI component library
- **Vite**: Build tool and development server
- **RainbowKit**: Wallet connection interface
- **Wagmi**: React hooks for Ethereum
- **ethers.js**: Ethereum interaction library (via Wagmi)
- **React Context API**: State management

## Game Flow

1. **Wallet Connection**: Player connects their crypto wallet
2. **NFT Verification**: System checks for required NFT ownership
3. **Game Initialization**: Player signs a message to begin a new game
4. **Game Play**: Player solves the Sudoku puzzle with time and mistake tracking
5. **Score Verification**: Upon completion, score is cryptographically signed
6. **Blockchain Submission**: Verified score is submitted to the leaderboard contract

## Development Setup

1. Clone the repository:
```bash
git clone https://github.com/isaacnewton123/crypto-sudoku.git
cd crypto-sudoku
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Build for production:
```bash
npm run build
```

5. Preview production build:
```bash
npm run preview
```

## Component Highlights

### Game.jsx
The main controller component handling game state, blockchain interactions, and UI coordination.

### Board.jsx
Displays the Sudoku game board and handles cell selection and status display.

### NumberPad.jsx
Provides the number input interface for the game.

### LeaderboardModal.jsx
Displays the blockchain-based leaderboard with pagination.

### WinModal.jsx
Appears on successful game completion with score submission capabilities.

## Smart Contract Interaction

The frontend interacts with two main smart contracts:

1. **NFT Contract**: Verifies player ownership of the required NFT
2. **Leaderboard Contract**: Manages player scores and seasonal competitions

These interactions are primarily handled in the `Game.jsx` component using Wagmi hooks.

## Configuration

Network-specific configurations are stored in `config/networks.js`, including:

- Chain IDs
- Network names
- RPC URLs
- NFT contract addresses
- Leaderboard contract addresses

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