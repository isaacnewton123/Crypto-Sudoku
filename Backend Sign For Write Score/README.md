# Sudoku Backend Service

A verification service for a blockchain-connected Sudoku game that signs player scores with a verifier wallet.

## Overview

This backend service provides score verification for a Sudoku game. When a player completes a puzzle, the frontend sends the completion details to this service, which validates the completion and signs the score data. This signature can then be used to verify the legitimacy of the score on a blockchain.

## Features

- Score signing endpoint for verifying and signing player puzzle completions
- Health check endpoint for monitoring service status
- Ethereum signature generation compatible with smart contract verification
- Input validation for player submissions
- CORS configuration for frontend integration

## Prerequisites

- Node.js (v14 or higher recommended)
- npm or yarn
- An Ethereum private key for the verifier wallet

## Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd sudoku-backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory with the following content:
   ```
   VERIFIER_PRIVATE_KEY=your_ethereum_private_key_here
   PORT=3001
   ```

## Running the Server

### Development Mode

```bash
npm run dev
```

This will start the server with nodemon, which automatically restarts when code changes are detected.

### Production Mode

```bash
npm start
```

## API Endpoints

### 1. Sign Score

**Endpoint:** `POST /sign-score`

**Request Body:**
```json
{
  "playerAddress": "0x...",       // Ethereum address of the player
  "time": "120",                  // Time taken to complete the puzzle (in seconds)
  "puzzleHash": "0x...",          // Hash of the puzzle
  "difficulty": "easy"            // Difficulty level of the puzzle
}
```

**Response:**
```json
{
  "signature": "0x...",           // Ethereum signature
  "verifierAddress": "0x...",     // Verifier wallet address
  "messageHash": "0x...",         // Original message hash
  "ethSignedMessageHash": "0x...", // Ethereum signed message hash
  "message": "Score signed successfully"
}
```

### 2. Health Check

**Endpoint:** `GET /health`

**Response:**
```json
{
  "status": "ok",
  "verifierAddress": "0x..."      // Verifier wallet address
}
```

## How It Works

1. The player completes a Sudoku puzzle in the frontend application
2. The frontend sends the completion details to the `/sign-score` endpoint
3. The server validates the input data:
   - Checks that all required fields are present
   - Validates the player's Ethereum address format
   - Verifies that the score is valid for the given difficulty
4. The server creates a message hash using the same algorithm as the smart contract
5. The verifier wallet signs this hash
6. The signature is returned to the frontend, which can then submit it to the blockchain

## Signature Verification

The signature is created using the following process:

1. Create a message hash:
   ```javascript
   const messageHash = ethers.keccak256(
     ethers.solidityPacked(
       ['uint256', 'bytes32', 'address'],
       [time, puzzleHash, playerAddress]
     )
   );
   ```

2. Add the Ethereum signed message prefix:
   ```javascript
   const ethSignedMessageHash = ethers.keccak256(
     ethers.solidityPacked(
       ['string', 'bytes32'],
       ['\x19Ethereum Signed Message:\n32', messageHash]
     )
   );
   ```

3. Sign the message using the verifier's private key:
   ```javascript
   const signature = await wallet.signMessage(ethers.getBytes(messageHash));
   ```

## CORS Configuration

The server is configured to accept requests from the following origins:
- `http://localhost:5173`
- `http://localhost:3000`

If you need to change these settings, modify the CORS configuration in `server.js`.

## Security Considerations

- Keep your `.env` file secure and never commit it to version control
- The `VERIFIER_PRIVATE_KEY` should be kept confidential
- In production, consider implementing rate limiting to prevent abuse

## Dependencies

- express: Web server framework
- ethers: Ethereum library for creating and signing transactions
- cors: Cross-Origin Resource Sharing middleware
- dotenv: Environment variable management

## License

MIT License
