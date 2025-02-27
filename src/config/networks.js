// src/config/networks.js - Updated with correct addresses and types
export const mintSepolia = {
  id: 1687,
  name: 'Mint Sepolia',
  network: 'mint-sepolia',
  nativeCurrency: {
    decimals: 18,
    name: 'ETH',
    symbol: 'ETH',
  },
  rpcUrls: {
    public: { http: ['https://sepolia-testnet-rpc.mintchain.io'] },
    default: { http: ['https://sepolia-testnet-rpc.mintchain.io'] },
  },
  blockExplorers: {
    default: { name: 'Explorer', url: 'https://sepolia-testnet-explorer.mintchain.io' },
  },
  contracts: {
    nft: {
      address: '0x480c9ebaba0860036c584ef70379dc82efb151bf',
      abi: [
        {
          "inputs": [{"internalType": "address", "name": "owner", "type": "address"}],
          "name": "balanceOf",
          "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
          "stateMutability": "view",
          "type": "function"
        }
      ]
    },
    leaderboard: {
      address: '0x6b3fddfccfc1f7ccf54f890766e24c5d65697898',
      abi: [
        {
          "inputs": [
            {"internalType": "uint32", "name": "_timeSeconds", "type": "uint32"},
            {"internalType": "uint8", "name": "_mistakes", "type": "uint8"},
            {"internalType": "bytes32", "name": "_puzzleHash", "type": "bytes32"},
            {"internalType": "bytes", "name": "_signature", "type": "bytes"}
          ],
          "name": "addScore",
          "outputs": [],
          "stateMutability": "nonpayable",
          "type": "function"
        },
        {
          "inputs": [],
          "name": "currentSeason",
          "outputs": [{"internalType": "uint16", "name": "", "type": "uint16"}],
          "stateMutability": "view",
          "type": "function"
        },
        {
          "inputs": [{"internalType": "uint16", "name": "_season", "type": "uint16"}, {"internalType": "uint16", "name": "_page", "type": "uint16"}],
          "name": "getSeasonScoresPaginated",
          "outputs": [
            {"internalType": "address[]", "name": "players", "type": "address[]"},
            {"internalType": "uint32[]", "name": "times", "type": "uint32[]"},
            {"internalType": "uint8[]", "name": "mistakes", "type": "uint8[]"},
            {"internalType": "uint32[]", "name": "points", "type": "uint32[]"},
            {"internalType": "uint32[]", "name": "timestamps", "type": "uint32[]"}
          ],
          "stateMutability": "view",
          "type": "function"
        },
        {
          "inputs": [{"internalType": "uint16", "name": "_season", "type": "uint16"}, {"internalType": "uint16", "name": "_limit", "type": "uint16"}],
          "name": "getSeasonTopScores",
          "outputs": [
            {"internalType": "address[]", "name": "players", "type": "address[]"},
            {"internalType": "uint32[]", "name": "times", "type": "uint32[]"},
            {"internalType": "uint8[]", "name": "mistakes", "type": "uint8[]"},
            {"internalType": "uint32[]", "name": "points", "type": "uint32[]"},
            {"internalType": "uint32[]", "name": "timestamps", "type": "uint32[]"}
          ],
          "stateMutability": "view",
          "type": "function"
        },
        {
"inputs": [{"internalType": "uint16", "name": "_season", "type": "uint16"}],
          "name": "getSeasonInfo",
          "outputs": [
            {"internalType": "uint32", "name": "startTime", "type": "uint32"},
            {"internalType": "uint32", "name": "endTime", "type": "uint32"},
            {"internalType": "bool", "name": "isActive", "type": "bool"},
            {"internalType": "uint16", "name": "totalScores", "type": "uint16"},
            {"internalType": "bool", "name": "hasEnded", "type": "bool"},
            {"internalType": "uint16", "name": "maxScoresPerSeason", "type": "uint16"}
          ],
          "stateMutability": "view",
          "type": "function"
        }
      ]
    }
  },
  testnet: true,
}

// Adding Monad Testnet configuration
export const monadTestnet = {
  id: 10143,
  name: 'Monad Testnet',
  network: 'monad-testnet',
  nativeCurrency: {
    decimals: 18,
    name: 'MON',
    symbol: 'MON',
  },
  rpcUrls: {
    public: { http: ['https://testnet-rpc.monad.xyz'] },
    default: { http: ['https://testnet-rpc.monad.xyz'] },
  },
  blockExplorers: {
    default: { name: 'Explorer', url: 'https://monad-testnet.socialscan.io' },
  },
  contracts: {
    nft: {
      // Alamat NFT contract untuk Monad Testnet
      address: '0xbcfd686f5e72cae048e7aedbac4de79f045234e2', 
      abi: [
        {
          "inputs": [{"internalType": "address", "name": "owner", "type": "address"}],
          "name": "balanceOf",
          "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
          "stateMutability": "view",
          "type": "function"
        }
      ]
    },
    leaderboard: {
      // Alamat leaderboard contract untuk Monad Testnet
      address: '0x2a2f9179b137a1fb718f3290cb5bda730c89dec6',
      abi: [
        {
          "inputs": [
            {"internalType": "uint32", "name": "_timeSeconds", "type": "uint32"},
            {"internalType": "uint8", "name": "_mistakes", "type": "uint8"},
            {"internalType": "bytes32", "name": "_puzzleHash", "type": "bytes32"},
            {"internalType": "bytes", "name": "_signature", "type": "bytes"}
          ],
          "name": "addScore",
          "outputs": [],
          "stateMutability": "nonpayable",
          "type": "function"
        },
        {
          "inputs": [],
          "name": "currentSeason",
          "outputs": [{"internalType": "uint16", "name": "", "type": "uint16"}],
          "stateMutability": "view",
          "type": "function"
        },
        {
          "inputs": [{"internalType": "uint16", "name": "_season", "type": "uint16"}, {"internalType": "uint16", "name": "_page", "type": "uint16"}],
          "name": "getSeasonScoresPaginated",
          "outputs": [
            {"internalType": "address[]", "name": "players", "type": "address[]"},
            {"internalType": "uint32[]", "name": "times", "type": "uint32[]"},
            {"internalType": "uint8[]", "name": "mistakes", "type": "uint8[]"},
            {"internalType": "uint32[]", "name": "points", "type": "uint32[]"},
            {"internalType": "uint32[]", "name": "timestamps", "type": "uint32[]"}
          ],
          "stateMutability": "view",
          "type": "function"
        },
        {
          "inputs": [{"internalType": "uint16", "name": "_season", "type": "uint16"}, {"internalType": "uint16", "name": "_limit", "type": "uint16"}],
          "name": "getSeasonTopScores",
          "outputs": [
            {"internalType": "address[]", "name": "players", "type": "address[]"},
            {"internalType": "uint32[]", "name": "times", "type": "uint32[]"},
            {"internalType": "uint8[]", "name": "mistakes", "type": "uint8[]"},
            {"internalType": "uint32[]", "name": "points", "type": "uint32[]"},
            {"internalType": "uint32[]", "name": "timestamps", "type": "uint32[]"}
          ],
          "stateMutability": "view",
          "type": "function"
        },
        {
          "inputs": [{"internalType": "uint16", "name": "_season", "type": "uint16"}],
          "name": "getSeasonInfo",
          "outputs": [
            {"internalType": "uint32", "name": "startTime", "type": "uint32"},
            {"internalType": "uint32", "name": "endTime", "type": "uint32"},
            {"internalType": "bool", "name": "isActive", "type": "bool"},
            {"internalType": "uint16", "name": "totalScores", "type": "uint16"},
            {"internalType": "bool", "name": "hasEnded", "type": "bool"},
            {"internalType": "uint16", "name": "maxScoresPerSeason", "type": "uint16"}
          ],
          "stateMutability": "view",
          "type": "function"
        }
      ]
    }
  },
  testnet: true,
}