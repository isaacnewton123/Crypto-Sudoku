# Crypto Sudoku

![Crypto Sudoku Logo](https://raw.githubusercontent.com/isaacnewton123/sudoku-NFT/refs/heads/main/Removal-779.png)

## Where Crypto Meets Classic Puzzle Solving

Crypto Sudoku is a revolutionary blockchain-powered gaming experience that combines the timeless challenge of Sudoku with cryptocurrency rewards and NFT technology. Play, solve, compete, and earn in a secure and transparent ecosystem built on multiple blockchain networks.

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Mint Sepolia](https://img.shields.io/badge/Mint%20Sepolia-Deployed-brightgreen)](https://sepolia-testnet-explorer.mintchain.io/address/0x5E5b7277FFD01CC442184a1c2d375F421f3a1562)
[![Monad Testnet](https://img.shields.io/badge/Monad%20Testnet-Deployed-brightgreen)](https://monad-testnet.socialscan.io/address/0x74ffe581f893a630db0094757eb8f9c47108606b)

## 🌟 Highlights

- **Skill-Based GameFi**: A true test of logic and strategy with provable fairness
- **Multi-Chain Support**: Deployed on Mint Sepolia and Monad Testnet
- **NFT-Gated Access**: Exclusive gameplay for NFT holders
- **Cryptographic Verification**: Tamper-proof score submission system
- **Seasonal Competitions**: Regular resets with new leaderboards and rewards
- **Cross-Platform UI**: Responsive design for both desktop and mobile

## 🎮 Game Experience

Crypto Sudoku delivers the classic Sudoku puzzle experience enhanced with blockchain technology:

- **Familiar Gameplay**: Fill the 9×9 grid following traditional Sudoku rules
- **Real-Time Scoring**: Points calculated based on time and accuracy
- **Secure Verification**: All submitted scores are cryptographically signed
- **Global Competition**: Compete against players worldwide on the blockchain leaderboard
- **Seasonal Rewards**: Top performers earn rewards each season

## 🧩 Game Mechanics

### Scoring System
- **Base Formula**: `Points = (7200 - Time) - (Mistakes × 100)`
- **Strategy Element**: Balance speed vs. accuracy for maximum points
- **Time Tracking**: Every second counts against your final score
- **Mistake Limit**: Maximum 10 mistakes allowed per game
- **Seasonal Rotation**: Fresh competition every 30 days

### Blockchain Integration
- **NFT Access**: Ownership verification through ERC-721 tokens
- **Score Validation**: Server-side cryptographic signature prevents cheating
- **Leaderboard Storage**: Top 100 scores stored permanently on-chain
- **Cross-Chain Identity**: Consistent player experience across networks

## 🔧 Technical Architecture

Crypto Sudoku consists of three integrated components working in harmony:

### Frontend (React/Vite)
```
src/
├── components/       # UI components including Board, NumberPad etc.
├── context/          # Theme and state management
├── styles/           # CSS modules for styling
├── utils/            # Game logic, blockchain interface
├── config/           # Network configurations
└── App.jsx           # Main application entry
```

### Backend (Node.js)
```
backend_transaction/
├── server.js         # Express server for signature generation
├── routes/           # API endpoint definitions
└── utils/            # Cryptographic utilities
```

### Smart Contracts (Solidity)
```
contract/
├── SudokuNFT.sol              # NFT access implementation
└── Sudoku_Leaderboard.sol     # Score storage and verification
```

## ⚙️ Technical Details

### Frontend Stack
- **React + Vite**: Modern, fast UI development
- **Wagmi & RainbowKit**: Seamless wallet connections
- **CSS Modules**: Scoped styling with theme support
- **Web3 Hooks**: Custom hooks for blockchain interactions

### Backend Stack
- **Node.js/Express**: Efficient API server
- **ethers.js**: Ethereum interactions and signing
- **CORS Protection**: Secure API access
- **Environment Management**: Configurable deployment options

### Smart Contract Features
- **Gas Optimization**: Efficient storage patterns for minimal gas costs
- **Data Types**: Carefully chosen for optimal storage (uint32, uint8, etc.)
- **Security Measures**: Reentrancy protection and access controls
- **Event Emission**: Complete event logging for off-chain tracking

## 🔐 Security Features

Crypto Sudoku implements multiple layers of security:

1. **Score Signature**: Server-side cryptographic verification
2. **Puzzle Hashing**: Each game session has a unique hash
3. **Time-Stamped Signatures**: Prevents replay attacks
4. **Smart Contract Guards**: Prevent manipulation and reentrancy
5. **NFT Ownership Checks**: Access control through blockchain verification

## 📡 Network Deployments

### Mint Sepolia Testnet
- **Chain ID**: 1687
- **NFT Contract**: [`0x5E5b7277FFD01CC442184a1c2d375F421f3a1562`](https://sepolia-testnet-explorer.mintchain.io/address/0x5E5b7277FFD01CC442184a1c2d375F421f3a1562)
- **Leaderboard Contract**: [`0x6b3fddfccfc1f7ccf54f890766e24c5d65697898`](https://sepolia-testnet-explorer.mintchain.io/address/0x6b3fddfccfc1f7ccf54f890766e24c5d65697898)

### Monad Testnet
- **Chain ID**: 10143
- **NFT Contract**: [`0x74ffe581f893a630db0094757eb8f9c47108606b`](https://monad-testnet.socialscan.io/address/0x74ffe581f893a630db0094757eb8f9c47108606b)
- **Leaderboard Contract**: [`0x2a2f9179b137a1fb718f3290cb5bda730c89dec6`](https://monad-testnet.socialscan.io/address/0x2a2f9179b137a1fb718f3290cb5bda730c89dec6)

## 📱 User Experience

Crypto Sudoku offers a premium gaming experience:

- **Responsive Design**: Play on any device with adaptive UI
- **Light/Dark Mode**: Customizable visual theme
- **Sound Effects**: Audio feedback for game actions
- **Countdown Animation**: Engaging game start sequence
- **Continuous Feedback**: Real-time score calculation and mistake tracking

## 💻 Development Setup

### Prerequisites
- Node.js 16+
- Yarn or NPM
- MetaMask or compatible wallet

### Frontend Setup
```bash
# Clone the repository
git clone https://github.com/isaacnewton123/crypto-sudoku.git

# Navigate to project directory
cd crypto-sudoku

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

### Backend Setup
```bash
# Navigate to backend directory
cd backend_transaction

# Install dependencies
npm install

# Create environment file
cp .env.example .env
# Edit .env to add VERIFIER_PRIVATE_KEY

# Start development server
npm run dev

# Start production server
npm start
```

### Smart Contract Deployment
```bash
# Navigate to contract directory
cd contract

# Install dependencies
npm install

# Compile contracts
npx hardhat compile

# Deploy contracts
npx hardhat run scripts/deploy.js --network mintsepolia
```

## 🗺️ Roadmap

Our vision for Crypto Sudoku includes:

### Phase 1: Foundation & Market Validation
- ✅ **Successful Testnet Launch**: Functional gameplay deployed on Mint Sepolia and Monad Testnet with cryptographic verification system
- 🔄 **Strategic Proposal Submission**: Engaging with key blockchain platforms and accelerators to secure technical support
- 🔄 **Team Expansion**: Recruiting specialized talent in blockchain gaming, tokenomics, and growth marketing
- 🔄 **Early Adopter Momentum**: Building an engaged community of players with demonstrable retention metrics
- 📅 **Strategic Fundraising Round**: Securing investment from partners who bring both capital and industry expertise
- 📅 **Investor Integration**: Creating dedicated channels for financial backers to provide strategic guidance
- 📅 **Data-Driven Refinement**: Implementing analytics systems to capture and act on user feedback and gameplay patterns

### Phase 2: Community Growth & Partnerships
- 📅 Strategic partnerships with crypto platforms and gaming communities
- 📅 Expanding player base and community building initiatives
- 📅 Mobile-optimized gameplay experience
- 📅 Infrastructure preparation for future token implementation
- 📅 Mainnet deployment research and planning

### Phase 3: Mainnet & Token Planning
- 📅 **Mainnet Launch**: Planned deployment to production blockchain environments
- 📅 **$SUDO Token Launch**: Strategic implementation of token economy
- 📅 **Cross-Chain Expansion**: Planning for additional blockchain integrations
- 📅 **Exchange Listings**: Preliminary discussions with exchange platforms
- 📅 **Mobile App Development**: Native applications for Android and iOS platforms
- 📅 **Enhanced Gameplay Features**: Roadmap for additional game modes and features

## 👥 Team

Our experienced team combines blockchain expertise with game development skills:

- **Hanif Maulana** - Initiator & Prompting Engineer
- **Claude AI** - UI/UX Designer
- **Claude AI** - Server Development
- **Claude AI** - Blockchain Specialist

## 🤝 Contributing

We welcome contributions! Please feel free to submit a pull request or open an issue.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE.md) file for details.

## 📞 Contact

- **Website**: [cryptosudoku.xyz](https://cryptosudoku.xyz)
- **Twitter**: [@CryptoSudokuG](https://x.com/CryptoSudokuG)
- **Discord**: [Join our server](https://discord.gg/8htQ6wn9Md)
- **Telegram**: [@cryptosudokugame](https://t.me/cryptosudokugame)
- **Email**: info@cryptosudoku.xyz

---

**Play, Solve, Earn**
