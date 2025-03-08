# Crypto Sudoku Smart Contracts

Blockchain infrastructure for the Crypto Sudoku game, featuring NFT ownership verification and leaderboard management.

## Overview

This repository contains the Solidity smart contracts that power the Crypto Sudoku game. The contracts handle NFT minting, ownership verification, and the global leaderboard system with seasonal competitions.

## Contracts

### SudokuNFT.sol

An enhanced ERC721Enumerable implementation that serves as the access pass for the Crypto Sudoku game, with improved security features.

```solidity
contract SudokuNFT is ERC721Enumerable, Ownable, ReentrancyGuard {
    using Strings for uint256;
    
    uint256 public constant MINT_PRICE = 0.01 ether;
    uint256 public constant MAX_SUPPLY = 10000;
    uint256 public currentTokenId;
    bool public mintingActive = true;
    mapping(address => bool) public hasMinted;
    
    // ...
}
```

**Features:**
- Fixed mint price (0.01 ETH)
- Maximum supply cap (10,000 NFTs)
- One mint per wallet restriction (except for owner)
- On-chain metadata and image
- Secure owner withdrawal function with reentrancy protection
- Enhanced error handling with custom error types
- Automatic token ID incrementing
- Token supply tracking
- Minting status control

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

## NFT Contract Updates

The new SudokuNFT contract includes several improvements:

- **Enhanced Security**: Added ReentrancyGuard to prevent reentrancy attacks
- **Improved Token Management**: Implemented ERC721Enumerable for better token tracking
- **Supply Cap**: Added a MAX_SUPPLY of 10,000 NFTs
- **Anti-Spam Feature**: One mint per wallet restriction (except for owner)
- **Custom Error Types**: Replaced require statements with custom errors for better gas efficiency
- **Minting Control**: Added ability to enable/disable minting
- **Better Metadata Handling**: Memory variables instead of constants for NFT properties
- **Comprehensive Events**: Added events for all important state changes

## Score Verification System

The contracts use a secure verification system:

1. The backend server signs the player's score with a trusted private key
2. The signature includes: time, mistakes, puzzle hash, and player address
3. The smart contract verifies the signature before accepting the score
4. This prevents cheating and ensures only legitimate scores enter the leaderboard

## Deployment Information

**Networks:**

1. **Mint Sepolia Testnet (ChainID: 1687)**
   - NFT Contract: `0x5E5b7277FFD01CC442184a1c2d375F421f3a1562`
   - Leaderboard Contract: `0x6b3fddfccfc1f7ccf54f890766e24c5d65697898`

2. **Monad Testnet (ChainID: 10143)**
   - NFT Contract: `0x74ffe581f893a630db0094757eb8f9c47108606b`
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
- ReentrancyGuard protects against reentrancy attacks in critical functions
- Check-Effects-Interactions pattern used throughout for secure state transitions
- Signature verification prevents unauthorized score submissions
- Only scores in the top 100 are stored to prevent spam and save gas
- The verifier address is controlled by the contract owner
- Seasons can be force-ended by the owner in case of emergency

## Contract Interfaces

### NFT Contract

```solidity
function mint() external payable nonReentrant mintingAllowed;
function setMintingActive(bool _status) external onlyOwner;
function tokenURI(uint256 tokenId) public view virtual override returns (string memory);
function getMaxSupply() external pure returns (uint256);
function isMintingActive() external view returns (bool);
function hasWalletMinted(address wallet) external view returns (bool);
function remainingTokens() external view returns (uint256);
function withdraw() external onlyOwner nonReentrant;
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