# Crypto Sudoku Backend

Verification server for the Crypto Sudoku blockchain game.

## Overview

This Node.js server handles the signature generation and score verification for the Crypto Sudoku game. It serves as the trusted middleware between the frontend game and the blockchain, ensuring that only valid scores are submitted to the leaderboard contract.

## Features

- **Score Signing**: Cryptographically signs valid game scores using the verifier private key
- **Multi-Network Support**: Compatible with Mint Sepolia and Monad Testnet
- **Score Validation**: Verifies time and mistake counts are within valid ranges
- **Points Calculation**: Implements the same scoring algorithm as the smart contract
- **Security Measures**: Input validation and address verification

## Tech Stack

- **Node.js**: Runtime environment
- **Express.js**: Web server framework
- **ethers.js**: Ethereum interaction library
- **dotenv**: Environment variable management
- **CORS**: Cross-origin resource sharing support

## API Endpoints

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

## Setup Instructions

1. Clone the repository:
```bash
git clone https://github.com/isaacnewton123/crypto-sudoku/backend_transaction.git
cd backend_transaction
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory:
```
VERIFIER_PRIVATE_KEY=your_private_key_here
PORT=3001
```

4. Start the development server:
```bash
npm run dev
```

5. For production:
```bash
npm start
```

## Environment Variables

- `VERIFIER_PRIVATE_KEY`: Private key of the wallet that signs scores
- `PORT`: Server port (defaults to 3001)

## Security Considerations

- Keep the `VERIFIER_PRIVATE_KEY` secure and never commit it to version control
- The server should be deployed in a secure environment with HTTPS
- Only allow requests from trusted origins using CORS configuration

## Game Constants

- Maximum time: 7200 seconds (2 hours)
- Maximum allowed mistakes: 9
- Mistake penalty: 100 points per mistake
- Score calculation: `points = (MAX_TIME - timeSeconds) - (mistakes * MISTAKE_PENALTY)`

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
