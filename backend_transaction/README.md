# Crypto Sudoku Backend Server

![Crypto Sudoku Logo](https://raw.githubusercontent.com/isaacnewton123/sudoku-NFT/refs/heads/main/Removal-779.png)

## Verification server for the Crypto Sudoku blockchain game

[![Node.js](https://img.shields.io/badge/Node.js-v16+-green.svg)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-v4.21-blue.svg)](https://expressjs.com/)
[![Ethers.js](https://img.shields.io/badge/Ethers.js-v6-purple.svg)](https://docs.ethers.org/v6/)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)

## 🌟 Overview

This Node.js server handles the signature generation and score verification for the Crypto Sudoku game. It serves as the trusted middleware between the frontend game and the blockchain, ensuring that only valid scores are submitted to the leaderboard contract.

## ✨ Key Features

- **🔏 Cryptographic Verification**: Signs valid game scores using the verifier private key
- **✅ Score Validation**: Verifies time and mistake counts against contract constraints
- **🧮 Points Calculation**: Implements the same scoring algorithm as the smart contract
- **⛓️ Multi-Network Support**: Compatible with Mint Sepolia and Monad Testnet
- **🔒 Security Measures**: Comprehensive input validation and signature uniqueness
- **💓 Health Monitoring**: Status endpoints for service monitoring
- **🌐 Cross-Origin Support**: Configured CORS for secure frontend communication

## 🛠️ Technical Stack

| Component | Technology | Purpose |
|-----------|------------|---------|
| Runtime | Node.js | JavaScript execution environment |
| Web Framework | Express.js | HTTP server and routing |
| Blockchain Integration | ethers.js v6 | Ethereum interaction and cryptography |
| Configuration | dotenv | Environment variable management |
| Security | CORS | Cross-origin resource sharing protection |
| Error Handling | Custom middleware | Structured error responses |

## 🔌 API Endpoints

### POST `/sign-score`

Signs a valid game score for submission to the blockchain.

**Request Body:**
```json
{
  "playerAddress": "0x...",
  "timeSeconds": 120,
  "mistakes": 2,
  "puzzleHash": "0x...",
  "difficulty": "medium",
  "chainId": 1687
}
```

**Response:**
```json
{
  "signature": "0x...",
  "verifierAddress": "0x...",
  "messageHash": "0x...",
  "ethSignedMessageHash": "0x...",
  "network": "Mint Sepolia",
  "message": "Score signed successfully"
}
```

### POST `/calculate-points`

Calculates points based on time and mistakes.

**Request Body:**
```json
{
  "timeSeconds": 120,
  "mistakes": 2
}
```

**Response:**
```json
{
  "points": 6880,
  "timeSeconds": 120,
  "timePoints": 7080,
  "mistakes": 2,
  "mistakePenalty": 200,
  "maxTime": 7200,
  "maxMistakes": 9,
  "calculation": "7200 - 120 - (2 * 100) = 6880"
}
```

### GET `/networks`

Returns information about supported networks.

**Response:**
```json
{
  "supportedNetworks": {
    "1687": {
      "name": "Mint Sepolia",
      "contractAddresses": {
        "nft": "0x480c9ebaba0860036c584ef70379dc82efb151bf",
        "leaderboard": "0x6b3fddfccfc1f7ccf54f890766e24c5d65697898"
      }
    },
    "10143": {
      "name": "Monad Testnet",
      "contractAddresses": {
        "nft": "0xbcfd686f5e72cae048e7aedbac4de79f045234e2",
        "leaderboard": "0x2a2f9179b137a1fb718f3290cb5bda730c89dec6"
      }
    }
  },
  "message": "List of supported networks"
}
```

### GET `/health`

Health check endpoint with server status.

**Response:**
```json
{
  "status": "ok",
  "verifierAddress": "0x...",
  "supportedNetworks": [
    {
      "id": 1687,
      "name": "Mint Sepolia"
    },
    {
      "id": 10143,
      "name": "Monad Testnet"
    }
  ],
  "contractSettings": {
    "maxTimeSeconds": 7200,
    "maxMistakes": 9,
    "mistakePenalty": 100
  }
}
```

## 🏗️ Architecture

```
backend_transaction/
├── server.js              # Main server file with API endpoints
├── utils/                 # Utility functions
│   ├── crypto.js          # Cryptographic utilities
│   ├── validation.js      # Input validation
│   └── scoring.js         # Score calculation logic
├── config/                # Configuration files
│   ├── networks.js        # Network definitions
│   └── constants.js       # Game constants
├── middleware/            # Express middleware
│   ├── auth.js            # Authentication middleware
│   └── validation.js      # Request validation
└── services/              # Service layer
    └── signer.js          # Signature generation service
```

## 🔐 Security Considerations

| Aspect | Implementation | Purpose |
|--------|----------------|---------|
| **Private Key Security** | Environment variables | Secure storage of sensitive keys |
| **Input Validation** | Request validation middleware | Prevent malicious inputs |
| **Rate Limiting** | Express rate-limit | Prevent abuse and DoS attacks |
| **CORS Protection** | Configured allow-list | Restrict access to known origins |
| **Signature Uniqueness** | Puzzle hash verification | Prevent replay attacks |
| **Error Handling** | Sanitized responses | Prevent information leakage |

## 💻 Development Setup

### Prerequisites
- Node.js 16+ and npm
- Access to the contract addresses for supported networks
- Wallet with verifier private key

### Installation

```bash
# Clone the repository
git clone https://github.com/isaacnewton123/crypto-sudoku.git
cd crypto-sudoku/backend_transaction

# Install dependencies
npm install
```

### Configuration

Create a `.env` file in the root directory:

```
PORT=3001
VERIFIER_PRIVATE_KEY=your_private_key_here  # The private key from the address used during deployment
NODE_ENV=development  # Set to 'production' for production environment
```

### Running the Server

```bash
# Development mode with hot reloading
npm run dev

# Production mode
npm start
```

## 🚀 Deployment Guide

### Production Environment Variables
For production deployment, ensure the following environment variables are set:

```
PORT=3001
VERIFIER_PRIVATE_KEY=your_private_key_here
NODE_ENV=production
ALLOWED_ORIGINS=https://app.cryptosudoku.xyz,https://www.cryptosudoku.xyz
```

### Server Requirements
- Node.js 16+
- 1GB RAM minimum
- 10GB disk space
- HTTPS configuration

### Deployment Steps

1. Clone the repository on your server
2. Install dependencies with `npm install --production`
3. Set up environment variables
4. Configure a process manager (PM2 recommended)
5. Set up reverse proxy (Nginx recommended)
6. Configure SSL certificates
7. Start the server with `npm start` or via PM2

### PM2 Configuration Example

```javascript
// ecosystem.config.js
module.exports = {
  apps: [{
    name: "crypto-sudoku-backend",
    script: "./server.js",
    instances: "max",
    exec_mode: "cluster",
    env: {
      NODE_ENV: "production",
      PORT: 3001
    }
  }]
}
```

Start with: `pm2 start ecosystem.config.js`

## 🧪 Testing

```bash
# Run tests
npm test

# Run tests with coverage
npm run test:coverage
```

## 🔍 Monitoring & Logging

- **Health Checks**: Regular pings to `/health` endpoint
- **Error Tracking**: Centralized error logging
- **Performance Metrics**: Request duration and throughput tracking
- **Audit Logs**: Record of all signature requests with anonymized data
- **Alert System**: Notifications for critical system events

## 🤝 Contributing

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
