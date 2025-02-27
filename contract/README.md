# Crypto Sudoku Smart Contracts

Blockchain infrastructure for the Crypto Sudoku game, featuring NFT ownership verification and leaderboard management.

## Overview

This repository contains the Solidity smart contracts that power the Crypto Sudoku game. The contracts handle NFT minting, ownership verification, and the global leaderboard system with seasonal competitions.

## Contracts

### SudokuNFT.sol

An ERC721 implementation that serves as the access pass for the Crypto Sudoku game.

```solidity
contract SudokuNFT is ERC721, Ownable {
    using Strings for uint256;
    
    uint256 public constant MINT_PRICE = 0.001 ether;
    uint256 public currentTokenId;
    string public constant NFT_NAME = "Sudoku Puzzle";
    string public constant NFT_DESCRIPTION = "A unique Sudoku puzzle NFT collection";
    string public constant NFT_IMAGE = "https://raw.githubusercontent.com/isaacnewton123/sudoku-NFT/refs/heads/main/image%20(1).png";
    
    // ...
}
```

**Features:**
- Fixed mint price (0.001 ETH)
- On-chain metadata and image
- Owner withdrawal function
- Automatic token ID incrementing

### Sudoku_Leaderboard_Optimized.sol

A gas-optimized contract for managing game scores and seasonal leaderboards.

```solidity
contract Sudoku_Leaderboard_Optimized {
    struct Score {
        address player;
        uint32 time;       // Time in seconds (uint32 is enough for 136 years)
        uint8 mistakes;    // Number of mistakes (uint8 is enough for 0-255)
        uint32 points;     // Calculated points (uint32 is enough for realistic points)
        uint32 timestamp;  // Submission time (uint32 is enough until year 2106)
    }

    struct SeasonInfo {
        uint32 startTime;
        uint32 endTime;
        bool isActive;
        uint16 scoreCount; // uint16 is enough for 65535 scores
        mapping(uint16 => Score) scores;
    }
    
    // ...
}
```

**Features:**
- Seasonal competition system (30-day seasons)
- Cryptographic signature verification for score submissions
- Gas-optimized data structures for efficient storage
- Top 100 scores per season with automatic sorting
- Pagination support for frontend display
- Configurable scoring system based on time and mistakes

## Game Constants

- **Season Duration**: 30 days
- **Grace Period**: 1 day (after season end)
- **Maximum Scores Per Season**: 100
- **Maximum Time**: 7200 seconds (2 hours)
- **Maximum Mistakes**: 9
- **Mistake Penalty**: 100 points per mistake
- **Score Calculation**: `points = (MAX_TIME - timeSeconds) - (mistakes * MISTAKE_PENALTY)`

## Score Verification System

The contracts use a secure verification system:

1. The backend server signs the player's score with a trusted private key
2. The signature includes: time, mistakes, puzzle hash, and player address
3. The smart contract verifies the signature before accepting the score
4. This prevents cheating and ensures only legitimate scores enter the leaderboard

## Deployment Information

**Networks:**

1. **Mint Sepolia Testnet (ChainID: 1687)**
   - NFT Contract: `0x480c9ebaba0860036c584ef70379dc82efb151bf`
   - Leaderboard Contract: `0x6b3fddfccfc1f7ccf54f890766e24c5d65697898`

2. **Monad Testnet (ChainID: 10143)**
   - NFT Contract: `0xbcfd686f5e72cae048e7aedbac4de79f045234e2`
   - Leaderboard Contract: `0x2a2f9179b137a1fb718f3290cb5bda730c89dec6`

## Development Setup

1. Install dependencies:
```bash
npm install
```

2. Compile contracts:
```bash
npx hardhat compile
```

3. Run tests:
```bash
npx hardhat test
```

4. Deploy to testnet:
```bash
npx hardhat run scripts/deploy.js --network mintsepolia
```

## Security Considerations

- The contracts use optimized data types to reduce gas costs while maintaining security
- Signature verification prevents unauthorized score submissions
- Only scores in the top 100 are stored to prevent spam and save gas
- The verifier address is controlled by the contract owner
- Seasons can be force-ended by the owner in case of emergency

## Contract Interfaces

### NFT Contract

```solidity
function mint() external payable;
function tokenURI(uint256 tokenId) public view returns (string memory);
function withdraw() external onlyOwner;
```

### Leaderboard Contract

```solidity
function addScore(
    uint32 _timeSeconds, 
    uint8 _mistakes,
    bytes32 _puzzleHash,
    bytes memory _signature
) external;

function getSeasonTopScores(uint16 _season, uint16 _limit) external view returns (
    address[] memory players,
    uint32[] memory times,
    uint8[] memory mistakes,
    uint32[] memory points,
    uint32[] memory timestamps
);

function getSeasonScoresPaginated(uint16 _season, uint16 _page) external view returns (
    address[] memory players,
    uint32[] memory times, 
    uint8[] memory mistakes,
    uint32[] memory points,
    uint32[] memory timestamps
);

function getSeasonInfo(uint16 _season) external view returns (
    uint32 startTime,
    uint32 endTime,
    bool isActive,
    uint16 totalScores,
    bool hasEnded,
    uint16 maxScoresPerSeason
);
```

## License

MIT License

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