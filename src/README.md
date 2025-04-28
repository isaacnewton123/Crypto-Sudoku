# Crypto Sudoku Frontend

![Crypto Sudoku Logo](https://raw.githubusercontent.com/isaacnewton123/sudoku-NFT/refs/heads/main/Removal-779.png)

## Interactive blockchain-powered Sudoku gaming experience

[![React](https://img.shields.io/badge/React-v18-blue.svg)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-v5-blueviolet.svg)](https://vitejs.dev/)
[![Wagmi](https://img.shields.io/badge/Wagmi-v2-green.svg)](https://wagmi.sh/)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)

## 🌟 Overview

This directory contains the React-based frontend for Crypto Sudoku, providing the user interface, game mechanics, and blockchain integrations. Players can connect their wallets, play Sudoku puzzles, and submit their scores to the blockchain leaderboard.

## ✨ Key Features

- **🔌 Wallet Integration**: Seamless connection via RainbowKit and Wagmi
- **⛓️ Multi-Network Support**: Compatible with Mint Sepolia and Monad Testnet
- **🔒 NFT-Gated Access**: Ownership verification for gameplay access
- **🎮 Game Engine**: Complete Sudoku puzzle generation and validation
- **🔐 Score Submission**: Cryptographically signed blockchain submissions
- **🏆 Leaderboard System**: View and compete on global seasonal leaderboards
- **🌓 Theme Support**: Dark/light mode with user preference persistence
- **📱 Responsive Design**: Optimized for both desktop and mobile devices
- **🔊 Sound Effects**: Audio feedback for game actions

## 📂 Directory Structure

```
src/
├── components/           # React components
│   ├── modals/           # Modal components (Win, GameOver, etc.)
│   └── ...               # Core UI components
├── context/              # React context providers
│   └── ThemeContext.jsx  # Dark/light mode implementation
├── styles/               # CSS stylesheets
│   ├── animations.css    # Animation definitions
│   ├── board.css         # Game board styling
│   └── ...               # Other style modules
├── utils/                # Utility functions
│   ├── audio.js          # Sound management
│   ├── signatureService.js # Blockchain signature handling
│   └── sudoku.js         # Puzzle generation and validation
├── config/               # Configuration files
│   └── networks.js       # Blockchain network definitions
└── App.jsx               # Main application component
```

## 🎮 Core Components

### Game.jsx
The central control component that manages:
- Game state and logic
- Blockchain interactions
- Timer and scoring
- Player interactions
- Modal coordination

```jsx
// Game.jsx (simplified)
const Game = () => {
  // State management
  const [gameBoard, setGameBoard] = useState([]);
  const [timer, setTimer] = useState(0);
  const [mistakes, setMistakes] = useState(0);
  
  // Game initialization
  const startGame = async () => {
    // Request player signature
    // Generate puzzle
    // Initialize game state
  };
  
  // Game completion
  const submitScore = async () => {
    // Calculate points
    // Get signature from backend
    // Submit to blockchain
  };
  
  return (
    <div className="game-layout">
      <Board board={gameBoard} />
      <NumberPad onNumberClick={handleInput} />
      {/* Other UI components */}
    </div>
  );
};
```

### Board.jsx
Renders the Sudoku grid and handles cell selection:

```jsx
const Board = ({ board, selectedCell, setSelectedCell }) => {
  return (
    <div className="board">
      {board.map((row, rowIndex) => 
        row.map((cell, colIndex) => (
          <div 
            className={`cell ${selectedCell === [rowIndex, colIndex] ? 'selected' : ''}`}
            onClick={() => setSelectedCell([rowIndex, colIndex])}
          >
            {cell !== 0 ? cell : ''}
          </div>
        ))
      )}
    </div>
  );
};
```

### WinModal.jsx
Handles score submission to the blockchain:

```jsx
const WinModal = ({ show, timer, mistakes }) => {
  const { writeContract } = useWriteContract();
  
  const submitScore = async () => {
    // Get signature from backend
    const signature = await fetchSignature(timer, mistakes);
    
    // Submit to blockchain
    await writeContract({
      address: LEADERBOARD_ADDRESS,
      abi: LEADERBOARD_ABI,
      functionName: 'addScore',
      args: [timer, mistakes, puzzleHash, signature]
    });
  };
  
  return (
    <div className="modal">
      <h2>Congratulations!</h2>
      <p>Time: {formatTime(timer)}</p>
      <p>Mistakes: {mistakes}</p>
      <button onClick={submitScore}>Submit Score</button>
    </div>
  );
};
```

## 🔄 Game Flow

| Stage | Description | Technical Details |
|-------|-------------|-------------------|
| **1. Wallet Connection** | Player connects via RainbowKit | Uses Wagmi hooks for wallet state |
| **2. NFT Verification** | System checks for NFT ownership | Calls `balanceOf` on NFT contract |
| **3. Game Initialization** | Player signs message to start game | Uses `signMessage` from Wagmi |
| **4. Countdown Animation** | Visual cue for game start | CSS animations and state management |
| **5. Gameplay** | Player solves puzzle | Real-time validation and state updates |
| **6. Completion** | Game tracks win condition | Checks complete board against solution |
| **7. Score Verification** | Backend signs valid scores | API call to verification server |
| **8. Blockchain Submission** | Verified score sent to leaderboard | Calls `addScore` on leaderboard contract |

## ⛓️ Blockchain Integration

### Network Configuration
Networks are defined in `config/networks.js`:

```javascript
export const mintSepolia = {
  id: 1687,
  name: 'Mint Sepolia',
  network: 'mint-sepolia',
  nativeCurrency: { decimals: 18, name: 'ETH', symbol: 'ETH' },
  rpcUrls: {
    public: { http: ['https://sepolia-testnet-rpc.mintchain.io'] },
    default: { http: ['https://sepolia-testnet-rpc.mintchain.io'] },
  },
  // Contract addresses and ABIs
};

export const monadTestnet = {
  id: 10143,
  name: 'Monad Testnet',
  // Similar configuration
};
```

### Smart Contract Interaction
Using Wagmi hooks for blockchain communication:

```javascript
// Reading NFT ownership
const { data: nftBalance } = useReadContract({
  address: nftContractAddress,
  abi: NFT_ABI,
  functionName: 'balanceOf',
  args: [address],
});

// Writing to leaderboard
const { writeContractAsync } = useWriteContract();
const submitScore = async () => {
  await writeContractAsync({
    address: leaderboardAddress,
    abi: LEADERBOARD_ABI,
    functionName: 'addScore',
    args: [timeSeconds, mistakes, puzzleHash, signature],
  });
};
```

## 💻 Development Guide

### Prerequisites
- Node.js v16+
- npm or yarn
- MetaMask or compatible wallet

### Setup

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### Environment Variables

Create a `.env` file in the root directory:

```
VITE_BACKEND_URL=https://api.cryptosudoku.xyz
VITE_MINT_SEPOLIA_RPC_URL=https://sepolia-testnet-rpc.mintchain.io
VITE_MONAD_TESTNET_RPC_URL=https://testnet-rpc.monad.xyz
```

## 🧪 Testing

```bash
# Run unit tests
npm test

# Run end-to-end tests
npm run test:e2e
```

## 🚀 Optimization Techniques

- **Code Splitting**: Lazy loading of components for faster initial load
- **Memoization**: React.memo and useMemo for expensive calculations
- **Image Optimization**: Compressed assets for faster loading
- **Mobile-First Design**: Responsive from the ground up
- **State Management**: Efficient React context usage
- **Animation Performance**: CSS transitions and requestAnimationFrame

## 🤝 Contributing

We welcome contributions to improve the frontend experience. Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Run tests to ensure everything works
5. Commit your changes (`git commit -m 'Add amazing feature'`)
6. Push to the branch (`git push origin feature/amazing-feature`)
7. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](../LICENSE.md) file for details.

---

<p align="center">
  <b>Crypto Sudoku: Play, Solve, Earn</b><br>
  <a href="https://cryptosudoku.xyz">Website</a> •
  <a href="https://twitter.com/CryptoSudokuG">Twitter</a> •
  <a href="https://discord.gg/8htQ6wn9Md">Discord</a> •
  <a href="https://t.me/cryptosudokugame">Telegram</a>
</p>
