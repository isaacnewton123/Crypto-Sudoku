# Crypto Sudoku

A blockchain-powered Sudoku game with NFT integration built using React, Vite, and RainbowKit.

![Crypto Sudoku NFT Game](https://raw.githubusercontent.com/isaacnewton123/sudoku-NFT/refs/heads/main/Removal-779.png)

## Overview

Crypto Sudoku is a web3-powered Sudoku game where players connect their crypto wallets to play and compete on a blockchain-based leaderboard. The game features:

- Classic Sudoku gameplay with multiple difficulty levels
- NFT-gated access (requires owning specific NFTs to play)
- Seasonal leaderboards stored on-chain
- Dark/light theme support
- Sound effects and animation
- Mobile-responsive design

## Technology Stack

- **Frontend**: React.js with Vite
- **Blockchain Integration**: 
  - RainbowKit for wallet connection
  - wagmi for React hooks for Ethereum
  - viem for Ethereum interactions
- **Network**: Mint Sepolia Testnet (Chain ID: 1687)
- **Styling**: Custom CSS with theme support

## Smart Contracts

The application interacts with two main contracts:

1. **NFT Contract** (`0x480c9ebaba0860036c584ef70379dc82efb151bf`)
   - Provides access control to the game
   - Players must own at least one NFT to play

2. **Leaderboard Contract** (`0x043aca1f7284705d3e05318a72f9f5fd32cb1940`)
   - Tracks player scores and timestamps
   - Organizes scores into seasons
   - Prevents cheating via server-signed scores

## Features

### Game Mechanics

- **Multiple Difficulty Levels**: Easy, Medium, Hard
- **Score Tracking**: Time-based scoring system
- **Mistake Tracking**: Limited to 10 mistakes per game
- **Game States**: New Game, In Progress, Win, Game Over, Surrender

### Web3 Integration

- **Wallet Connection**: Connect with any supported wallet via RainbowKit
- **Network Detection**: Automatic detection and prompting for correct network
- **On-chain Leaderboard**: Submit scores to a transparent, decentralized leaderboard
- **Score Verification**: Backend signature verification to prevent fake scores

### User Experience

- **Theme Toggle**: Light and Dark mode support with system preference detection
- **Sound Effects**: Audio feedback for game actions with mute option
- **Responsive Design**: Optimized for all device sizes
- **Game Header**: Collapsible header for more screen space on mobile

## Game UI Components

- **Board**: 9x9 Sudoku grid with highlighting and animations
- **Number Pad**: Input controls for placing numbers
- **Stats Display**: Time tracker and mistake counter
- **Modals**: Win, Game Over, Surrender, Help, and Leaderboard
- **Home Screen**: Welcome screen with wallet connection

## Installation and Setup

### Prerequisites

- Node.js (v16+)
- npm or yarn
- MetaMask or other compatible wallet

### Local Development

1. Clone the repository
   ```
   git clone https://github.com/isaacnewton123/Crpto-Sudoku
   cd sudoku-nft-rainbow
   ```

2. Install dependencies
   ```
   npm install
   ```

3. Start the development server
   ```
   npm run dev
   ```

4. Open your browser at `http://localhost:5173`

### Environment Configuration

Create a `.env` file in the project root with:

```
VITE_BACKEND_URL=<your-backend-url>
```

### Building for Production

```
npm run build
```

This will generate optimized assets in the `dist` folder.

## Game Flow

1. **Home Screen**: Connect wallet and verify NFT ownership
2. **Game Screen**: Play Sudoku with selected difficulty
3. **Win/Lose**: View game results and submit scores to the leaderboard
4. **Leaderboard**: Compare your scores with other players

## Security Considerations

- Score submissions are signed by a trusted backend server
- Signatures include puzzle hash, player address, and completion time
- Smart contract verifies signatures before accepting scores

## Future Enhancements

- Enhanced NFT rewards for top players
- Puzzle of the day feature
- User profiles and statistics
- More complex puzzle variations
- Social sharing of achievements

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Contact

For questions or support, please reach out to:
- Website: [cryptosudoku.xyz](https://cryptosudoku.xyz)
- Twitter: [@CryptoSudokuNFT](https://twitter.com/Crypto_Sudoku)
- Discord: [Crypto Sudoku Community](https://discord.gg/8htQ6wn9Md)
