# Sudoku NFT & Leaderboard System

A blockchain-based Sudoku game system consisting of NFT minting and a competitive leaderboard.

## Overview

This project creates a complete blockchain-based Sudoku game ecosystem with two main components:

1. **SudokuNFT**: An ERC721 NFT contract for minting collectible Sudoku puzzle tokens
2. **Sudoku_Leaderboard**: A leaderboard contract that tracks and ranks player scores across competitive seasons

The system includes signature verification to ensure score legitimacy and requires players to own an NFT to participate in leaderboard competitions.

## Contracts

### SudokuNFT

The SudokuNFT contract allows users to mint NFTs representing Sudoku puzzles.

#### Features

- ERC721-compliant NFT implementation
- Fixed mint price: 0.001 ETH
- On-chain metadata with Base64 encoding
- Owner withdrawal functionality

#### Functions

- `mint()`: Mint a new Sudoku NFT (requires payment)
- `tokenURI(uint256 tokenId)`: Get the token metadata URI
- `withdraw()`: Allow owner to withdraw contract funds
- `_encode(bytes memory data)`: Base64 encoding for on-chain metadata

### Sudoku_Leaderboard

The Sudoku_Leaderboard contract manages competitive Sudoku solving with seasonal leaderboards.

#### Features

- Seasonal competition system with automatic rollover
- Secure score verification using cryptographic signatures
- NFT ownership requirement for participation
- Top 10 scores tracked per season

#### Functions

- `addScore(uint256 _time, bytes32 _puzzleHash, bytes memory _signature)`: Submit a verified score
- `checkAndUpdateSeason()`: Check and update season status
- `getSeasonTopScores(uint256 _season, uint256 _limit)`: Retrieve top scores for a season
- `getSeasonInfo(uint256 _season)`: Get information about a specific season
- `setVerifierAddress(address _newVerifier)`: Update the verifier address
- `setAutomationContract(address _newContract)`: Set the automation contract address
- `automatedSeasonCheck()`: Trigger season check via automation
- `togglePause()`: Pause/unpause the contract
- `forceEndCurrentSeason()`: Manually end the current season
- `transferOwnership(address newOwner)`: Transfer contract ownership

## How It Works

### NFT Minting Process

1. Users call the `mint()` function on the SudokuNFT contract, sending 0.001 ETH
2. A new NFT is minted with incremental tokenId
3. The NFT contains metadata with name, description and image

### Score Submission Process

1. Player completes a Sudoku puzzle in the frontend
2. Score details (completion time, puzzle hash) are sent to the backend verification service
3. Backend service verifies the score and signs the data with a private key
4. Player submits the score along with signature to the Sudoku_Leaderboard contract
5. Contract verifies:
   - Player owns a Sudoku NFT
   - Signature is valid and unused
   - Season is active
6. If valid, the score is inserted into the leaderboard in the correct position based on time

### Season Management

- Seasons last for 30 days with a 1-day grace period
- At the end of a season, a new season automatically begins
- Each season tracks the top 10 fastest completion times
- Scores can be submitted only during active seasons

## Technical Details

### Signature Verification

The leaderboard uses Ethereum's signature verification to ensure scores are legitimate:

1. Backend service creates a message hash: `keccak256(time, puzzleHash, playerAddress)`
2. Backend signs this hash with the verifier's private key
3. Contract recovers the signer from the signature and verifies it matches the trusted verifier

### Security Features

- Signature replay protection: each signature can only be used once
- NFT ownership requirement prevents unauthorized submissions
- Admin controls for pausing and managing the system
- Separation of verification authority from contract ownership

## Deployment

### Prerequisites

- Solidity ^0.8.0 (^0.8.20 for SudokuNFT)
- OpenZeppelin Contracts library
- An Ethereum wallet with funds for deployment

### Deployment Steps

1. Deploy the SudokuNFT contract first
2. Deploy the Sudoku_Leaderboard contract with the verifier address as a constructor argument
3. Set up the backend verification service with the corresponding private key

## Integration

### Backend Integration

The system requires a backend service that:
1. Receives and validates player score submissions
2. Creates and signs messages in the format expected by the contract
3. Returns signatures to the frontend for submission to the blockchain

### Frontend Integration

The frontend application should:
1. Connect to user's wallet for NFT minting and score submission
2. Submit completed puzzles to the backend for verification
3. Submit verified scores with signatures to the blockchain
4. Display leaderboard data from the contract

## Administration

The contract owner can:
- Withdraw funds from the NFT contract
- Update the verifier address for score validation
- Set an automation contract for automatic season management
- Pause/unpause the leaderboard in case of emergencies
- Force end the current season if needed
- Transfer ownership to a new address
