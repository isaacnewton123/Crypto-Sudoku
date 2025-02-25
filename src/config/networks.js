// src/config/networks.js
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
      address: '0x043aca1f7284705d3e05318a72f9f5fd32cb1940',
      abi: [
        {
          "inputs": [
            {"internalType": "uint256", "name": "_time", "type": "uint256"},
            {"internalType": "bytes32", "name": "_puzzleHash", "type": "bytes32"},
            {"internalType": "bytes", "name": "_signature", "type": "bytes"}
          ],
          "name": "addScore",
          "outputs": [],
          "stateMutability": "nonpayable",
          "type": "function"
        },
        {
          "inputs": [{"internalType": "uint256", "name": "_season", "type": "uint256"}, {"internalType": "uint256", "name": "_limit", "type": "uint256"}],
          "name": "getSeasonTopScores",
          "outputs": [
            {"internalType": "address[]", "name": "players", "type": "address[]"},
            {"internalType": "uint256[]", "name": "times", "type": "uint256[]"},
            {"internalType": "uint256[]", "name": "timestamps", "type": "uint256[]"}
          ],
          "stateMutability": "view",
          "type": "function"
        },
        {
          "inputs": [{"internalType": "uint256", "name": "_season", "type": "uint256"}],
          "name": "getSeasonInfo",
          "outputs": [
            {"internalType": "uint256", "name": "startTime", "type": "uint256"},
            {"internalType": "uint256", "name": "endTime", "type": "uint256"},
            {"internalType": "bool", "name": "isActive", "type": "bool"},
            {"internalType": "uint256", "name": "totalScores", "type": "uint256"},
            {"internalType": "bool", "name": "hasEnded", "type": "bool"}
          ],
          "stateMutability": "view",
          "type": "function"
        }
      ]
    }
  },
  testnet: true,
}
