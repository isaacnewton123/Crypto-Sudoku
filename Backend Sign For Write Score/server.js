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

// Initialize wallet
const VERIFIER_PRIVATE_KEY = process.env.VERIFIER_PRIVATE_KEY;
if (!VERIFIER_PRIVATE_KEY) {
  throw new Error('VERIFIER_PRIVATE_KEY not set in environment variables');
}

const wallet = new ethers.Wallet(VERIFIER_PRIVATE_KEY);
console.log('Verifier address:', wallet.address);

function isValidScore(time, difficulty) {
  const timeNum = Number(time);
  return timeNum >= 1; // Minimal 1 detik untuk testing
}

// Score signing endpoint
app.post('/sign-score', async (req, res) => {
  try {
    const { playerAddress, time, puzzleHash, difficulty } = req.body;

    console.log('Received request:', {
      playerAddress,
      time,
      puzzleHash,
      difficulty
    });

    // Validasi input
    if (!playerAddress || time === undefined || !puzzleHash || !difficulty) {
      return res.status(400).json({ 
        error: 'Missing required fields',
        received: { playerAddress, time, puzzleHash, difficulty }
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
    if (!isValidScore(time, difficulty)) {
      return res.status(400).json({ 
        error: 'Invalid score for difficulty level',
        received: { time, difficulty }
      });
    }

    try {
      // Create message hash exactly like in smart contract
      const messageHash = ethers.keccak256(
        ethers.solidityPacked(
          ['uint256', 'bytes32', 'address'],
          [time, puzzleHash, playerAddress]
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
        message: 'Score signed successfully'
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

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok',
    verifierAddress: wallet.address
  });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log('Verifier address:', wallet.address);
});