# Crypto Sudoku Smart Contracts

![Crypto Sudoku Logo](https://raw.githubusercontent.com/isaacnewton123/sudoku-NFT/refs/heads/main/Removal-779.png)

## Blockchain infrastructure for the Crypto Sudoku game

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Mint Sepolia](https://img.shields.io/badge/Mint%20Sepolia-Deployed-brightgreen)](https://sepolia-testnet-explorer.mintchain.io/address/0x5E5b7277FFD01CC442184a1c2d375F421f3a1562)
[![Monad Testnet](https://img.shields.io/badge/Monad%20Testnet-Deployed-brightgreen)](https://monad-testnet.socialscan.io/address/0x74ffe581f893a630db0094757eb8f9c47108606b)

## 🌟 Overview

This directory contains the Solidity smart contracts that power the Crypto Sudoku game. The contracts handle NFT minting, ownership verification, and the global leaderboard system with seasonal competitions.

## 📑 Contract Architecture

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

**Key Features:**
- ✅ Fixed mint price (0.01 ETH)
- ✅ Maximum supply cap (10,000 NFTs)
- ✅ One mint per wallet restriction (except for owner)
- ✅ On-chain metadata and image
- ✅ Secure owner withdrawal function with reentrancy protection
- ✅ Enhanced error handling with custom error types
- ✅ Automatic token ID incrementing
- ✅ Token supply tracking
- ✅ Minting status control

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

**Key Features:**
- ✅ Seasonal competition system (30-day seasons)
- ✅ Cryptographic signature verification for score submissions
- ✅ Gas-optimized data structures for efficient storage
- ✅ Top 100 scores per season with automatic sorting
- ✅ Pagination support for frontend display
- ✅ Configurable scoring system based on time and mistakes

## ⚙️ Game Constants

| Constant | Value | Purpose |
|----------|-------|---------|
| Season Duration | 30 days | Length of each competition period |
| Grace Period | 1 day | Buffer after season end |
| Maximum Scores Per Season | 100 | Top scores stored on-chain |
| Maximum Time | 7200 seconds | Time limit (2 hours) |
| Maximum Mistakes | 9 | Mistake allowance per game |
| Mistake Penalty | 100 points | Points deducted per mistake |
| Score Calculation | `points = (MAX_TIME - timeSeconds) - (mistakes * MISTAKE_PENALTY)` | Formula for point calculation |

## 🔐 Security Considerations

- 🛡️ **Optimized Data Types**: Carefully chosen for minimal gas costs while maintaining security
- 🛡️ **ReentrancyGuard**: Protects against reentrancy attacks in critical functions
- 🛡️ **Check-Effects-Interactions**: Secure pattern used throughout for state transitions
- 🛡️ **Signature Verification**: Prevents unauthorized score submissions
- 🛡️ **Storage Efficiency**: Only top 100 scores stored to prevent spam and save gas
- 🛡️ **Access Controls**: Verifier address controlled by the contract owner
- 🛡️ **Emergency Functions**: Seasons can be force-ended by the owner if needed

## 📡 Deployment Information

### Networks

| Network | Chain ID | NFT Contract | Leaderboard Contract |
|---------|----------|--------------|----------------------|
| **Mint Sepolia Testnet** | 1687 | [`0x5E5b7277FFD01CC442184a1c2d375F421f3a1562`](https://sepolia-testnet-explorer.mintchain.io/address/0x5E5b7277FFD01CC442184a1c2d375F421f3a1562) | [`0x6b3fddfccfc1f7ccf54f890766e24c5d65697898`](https://sepolia-testnet-explorer.mintchain.io/address/0x6b3fddfccfc1f7ccf54f890766e24c5d65697898) |
| **Monad Testnet** | 10143 | [`0x74ffe581f893a630db0094757eb8f9c47108606b`](https://monad-testnet.socialscan.io/address/0x74ffe581f893a630db0094757eb8f9c47108606b) | [`0x2a2f9179b137a1fb718f3290cb5bda730c89dec6`](https://monad-testnet.socialscan.io/address/0x2a2f9179b137a1fb718f3290cb5bda730c89dec6) |

## 💻 Development Guide

### Required Tools
- Node.js v16+ and NPM
- Hardhat
- Ethers.js

### Setup

```bash
# Install dependencies
npm install

# Compile contracts
npx hardhat compile

# Run tests
npx hardhat test

# Deploy to testnet (example for Mint Sepolia)
npx hardhat run scripts/deploy.js --network mintsepolia
```

### Environment Configuration

Create a `.env` file with the following variables:
```
PRIVATE_KEY=your_wallet_private_key
MINT_SEPOLIA_RPC_URL=https://sepolia-testnet-rpc.mintchain.io
MONAD_TESTNET_RPC_URL=https://testnet-rpc.monad.xyz
ETHERSCAN_API_KEY=your_etherscan_api_key
```

## 📝 Contract Interfaces

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

## 🤝 Contributing

1. Fork the repository
2. Create a new branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Run tests to ensure everything works
5. Commit your changes (`git commit -m 'Add amazing feature'`)
6. Push to the branch (`git push origin feature/amazing-feature`)
7. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](../LICENSE) file for details.

---

<p align="center">
  <b>Crypto Sudoku: Play, Solve, Earn</b><br>
  <a href="https://cryptosudoku.xyz">Website</a> •
  <a href="https://twitter.com/CryptoSudokuG">Twitter</a> •
  <a href="https://discord.gg/8htQ6wn9Md">Discord</a> •
  <a href="https://t.me/cryptosudokugame">Telegram</a>
</p>
