// server.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { ethers } = require('ethers');

const app = express();

// Setup CORS
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3000'], 
  methods: ['POST', 'GET', 'OPTIONS'],
  allowedHeaders: ['Content-Type']
}));

app.use(express.json());

// Konfigurasi jaringan yang didukung
const SUPPORTED_NETWORKS = {
  // Mint Sepolia
  1687: {
    name: 'Mint Sepolia',
    contractAddresses: {
      nft: '0x480c9ebaba0860036c584ef70379dc82efb151bf',
      leaderboard: '0x6b3fddfccfc1f7ccf54f890766e24c5d65697898'
    }
  },
  // Monad Testnet
  10143: {
    name: 'Monad Testnet',
    contractAddresses: {
      nft: '0xbcfd686f5e72cae048e7aedbac4de79f045234e2',
      leaderboard: '0x2a2f9179b137a1fb718f3290cb5bda730c89dec6'
    }
  }
};

// Konstanta untuk smart contract
const MAX_TIME_SECONDS = 7200; // 2 jam dalam detik
const MAX_MISTAKES = 9;

// Initialize wallet
const VERIFIER_PRIVATE_KEY = process.env.VERIFIER_PRIVATE_KEY;
if (!VERIFIER_PRIVATE_KEY) {
  throw new Error('VERIFIER_PRIVATE_KEY not set in environment variables');
}

// Wallet untuk Mint Sepolia
const mintSepoliaWallet = new ethers.Wallet(VERIFIER_PRIVATE_KEY);

// Wallet untuk Monad Testnet (menggunakan private key yang sama)
const monadTestnetWallet = new ethers.Wallet(VERIFIER_PRIVATE_KEY);

console.log('Verifier address:', mintSepoliaWallet.address);

function isValidScore(timeSeconds, mistakes, difficulty) {
  const timeNum = Number(timeSeconds);
  const mistakesNum = Number(mistakes);
  
  // Validasi input sesuai dengan batasan kontrak baru
  return (
    timeNum > 0 && 
    timeNum <= MAX_TIME_SECONDS && 
    mistakesNum >= 0 && 
    mistakesNum <= MAX_MISTAKES
  ); 
}

// Score signing endpoint - UPDATED FOR SECONDS
// Bagian untuk endpoint /sign-score di server.js
app.post('/sign-score', async (req, res) => {
  try {
    // Accept either timeSeconds or timeMs for backward compatibility
    const { 
      playerAddress, 
      timeSeconds, 
      timeMs, 
      mistakes, 
      puzzleHash, 
      difficulty, 
      chainId 
    } = req.body;

    // Convert to seconds if timeSeconds is not provided and ensure integer
    const timeInSeconds = Math.floor(timeSeconds || (timeMs ? Math.round(timeMs / 1000) : undefined));
    const mistakesCount = Math.floor(mistakes); // Ensure integer

    console.log('Received request:', {
      playerAddress,
      timeInSeconds,
      mistakesCount,
      puzzleHash,
      difficulty,
      chainId
    });

    // Validasi input
    if (!playerAddress || timeInSeconds === undefined || mistakesCount === undefined || !puzzleHash || !difficulty) {
      return res.status(400).json({ 
        error: 'Missing required fields',
        received: { playerAddress, timeInSeconds, mistakesCount, puzzleHash, difficulty, chainId }
      });
    }

    // Validate network
    const networkId = chainId || 1687; // Default ke Mint Sepolia jika tidak ada
    if (!SUPPORTED_NETWORKS[networkId]) {
      return res.status(400).json({
        error: 'Unsupported network',
        received: { chainId },
        supportedNetworks: Object.keys(SUPPORTED_NETWORKS)
      });
    }

    // Validate address format
    if (!ethers.isAddress(playerAddress)) {
      return res.status(400).json({ 
        error: 'Invalid player address',
        received: playerAddress
      });
    }

    // Validate score
    if (!isValidScore(timeInSeconds, mistakesCount, difficulty)) {
      return res.status(400).json({ 
        error: 'Invalid score: time must be 1-7200 seconds, mistakes must be 0-9',
        received: { timeInSeconds, mistakesCount, difficulty },
        limits: { maxTimeSeconds: MAX_TIME_SECONDS, maxMistakes: MAX_MISTAKES }
      });
    }

    try {
      // Pilih wallet berdasarkan jaringan
      const wallet = networkId === 10143 ? monadTestnetWallet : mintSepoliaWallet;

      // Create message hash untuk smart contract - penting gunakan tipe data yang SAMA
      const messageHash = ethers.keccak256(
        ethers.solidityPacked(
          ['uint32', 'uint8', 'bytes32', 'address'], // Gunakan tipe data yang tepat (uint32, uint8)
          [timeInSeconds, mistakesCount, puzzleHash, playerAddress]
        )
      );
      console.log('Message hash:', messageHash);

      // Add Ethereum Signed Message prefix (same as in smart contract)
      const ethSignedMessageHash = ethers.keccak256(
        ethers.solidityPacked(
          ['string', 'bytes32'],
          ['\x19Ethereum Signed Message:\n32', messageHash]
        )
      );
      console.log('Ethereum signed message hash:', ethSignedMessageHash);

      // Sign message
      const signature = await wallet.signMessage(ethers.getBytes(messageHash));
      console.log('Generated signature:', signature);

      // Return data
      res.json({ 
        signature,
        verifierAddress: wallet.address,
        messageHash,
        ethSignedMessageHash,
        network: SUPPORTED_NETWORKS[networkId].name,
        message: 'Score signed successfully',
        // Include additional data for debugging
        timeSeconds: timeInSeconds,
        mistakesCount: mistakesCount,
        originalTimeMs: timeMs
      });

    } catch (signingError) {
      console.error('Signing error:', signingError);
      throw signingError;
    }

  } catch (error) {
    console.error('Server error:', error);
    res.status(500).json({ 
      error: 'Failed to sign score',
      details: error.message
    });
  }
});

// Network support info endpoint
app.get('/networks', (req, res) => {
  res.json({
    supportedNetworks: SUPPORTED_NETWORKS,
    message: 'List of supported networks'
  });
});

// Calculate points for a score - UPDATED FOR NEW CONTRACT
app.post('/calculate-points', (req, res) => {
  try {
    // Accept either timeSeconds or timeMs
    const { timeSeconds, timeMs, mistakes } = req.body;
    
    if ((timeSeconds === undefined && timeMs === undefined) || mistakes === undefined) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    
    // Konversi ke detik jika perlu
    const timeInSeconds = timeSeconds || (timeMs ? Math.round(timeMs / 1000) : 0);
    
    // Validasi input
    if (timeInSeconds <= 0 || timeInSeconds > MAX_TIME_SECONDS || mistakes < 0 || mistakes > MAX_MISTAKES) {
      return res.status(400).json({ 
        error: 'Invalid input: time must be 1-7200 seconds, mistakes must be 0-9',
        received: { timeInSeconds, mistakes },
        limits: { maxTimeSeconds: MAX_TIME_SECONDS, maxMistakes: MAX_MISTAKES }
      });
    }
    
    // Perhitungan poin sesuai dengan kontrak baru:
    // timePoints = MAX_TIME - timeSeconds
    // mistakePenalty = mistakes * MISTAKE_PENALTY
    // points = timePoints - mistakePenalty (jika hasilnya > 0, jika tidak 0)
    
    const timePoints = MAX_TIME_SECONDS - timeInSeconds;
    const mistakePenalty = mistakes * 100; // MISTAKE_PENALTY = 100 di kontrak baru
    
    let points = 0;
    if (mistakePenalty < timePoints) {
      points = timePoints - mistakePenalty;
    }
    
    res.json({
      points,
      timeSeconds: timeInSeconds,
      timePoints,
      mistakes,
      mistakePenalty,
      maxTime: MAX_TIME_SECONDS,
      maxMistakes: MAX_MISTAKES,
      // Provide detailed explanation
      calculation: `${MAX_TIME_SECONDS} - ${timeInSeconds} - (${mistakes} * 100) = ${points}`
    });
    
  } catch (error) {
    console.error('Error calculating points:', error);
    res.status(500).json({ error: 'Failed to calculate points' });
  }
});

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok',
    verifierAddress: mintSepoliaWallet.address,
    supportedNetworks: Object.keys(SUPPORTED_NETWORKS).map(id => ({
      id: parseInt(id),
      name: SUPPORTED_NETWORKS[id].name
    })),
    contractSettings: {
      maxTimeSeconds: MAX_TIME_SECONDS,
      maxMistakes: MAX_MISTAKES,
      mistakePenalty: 100 // MISTAKE_PENALTY di smart contract baru
    }
  });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log('Verifier address:', mintSepoliaWallet.address);
  console.log('Supported networks:', Object.keys(SUPPORTED_NETWORKS).map(id => SUPPORTED_NETWORKS[id].name).join(', '));
});
