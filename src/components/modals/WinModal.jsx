import { useState } from 'react';
import { useAccount, useWriteContract, useReadContract } from 'wagmi';
import { toast } from 'react-toastify';
import { keccak256, toBytes, stringToHex } from 'viem';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001';
const LEADERBOARD_ADDRESS = "0x043aca1f7284705d3e05318a72f9f5fd32cb1940";
const NFT_CONTRACT = "0x480c9ebaba0860036c584ef70379dc82efb151bf";

const LEADERBOARD_ABI = [
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
  }
];

const NFT_ABI = [
  {
    "inputs": [{"internalType": "address", "name": "owner", "type": "address"}],
    "name": "balanceOf",
    "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  }
];

const CancelPopup = ({ onSubmitAgain }) => (
  <div className="modal-overlay">
    <div className="modal-content">
      <h2 className="modal-title">⚠️ Transaction Failed</h2>
      <p>Would you like to try submitting your score again?</p>
      <div className="modal-footer">
        <button onClick={onSubmitAgain} className="btn btn-primary">
          Try Again
        </button>
      </div>
    </div>
  </div>
);

const WinModal = ({ show, onClose, timer, difficulty }) => {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showCancelPopup, setShowCancelPopup] = useState(false);
  const { address } = useAccount();
  
  // Check NFT ownership
  const { data: nftBalance } = useReadContract({
    address: NFT_CONTRACT,
    abi: NFT_ABI,
    functionName: 'balanceOf',
    args: [address],
    enabled: show && Boolean(address),
  });

  const { writeContract, isPending } = useWriteContract({
    mutation: {
      onSuccess: () => {
        setIsSubmitted(true);
        toast.success('Score submitted successfully!');
      },
      onError: (error) => {
        console.error('Contract error:', error);
        toast.error('Failed to submit score to blockchain');
        setShowCancelPopup(true);
      }
    }
  });

  if (!show) return null;

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSubmitScore = async () => {
    if (!nftBalance || nftBalance === 0n) {
      toast.error('You need to own the NFT to submit scores');
      return;
    }

    setShowCancelPopup(false);
    
    try {
      // Generate puzzle hash
      const puzzleData = {
        difficulty,
        time: timer,
        player: address
      };
      
      console.log('Puzzle data:', puzzleData);
      
      const puzzleHash = keccak256(
        toBytes(stringToHex(JSON.stringify(puzzleData)))
      );

      console.log('Sending to backend:', {
        playerAddress: address,
        time: timer,
        puzzleHash: puzzleHash,
        difficulty: difficulty
      });

      // Get signature from backend
      const response = await fetch(`${BACKEND_URL}/sign-score`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          playerAddress: address,
          time: Number(timer),
          puzzleHash: puzzleHash,
          difficulty: difficulty
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to get signature');
      }

      const { signature, verifierAddress } = await response.json();
      
      console.log('Submitting to blockchain:', {
        timer: BigInt(timer),
        puzzleHash,
        signature,
        verifierAddress // untuk debug
      });

      // Submit to blockchain with debug info
      try {
        console.log('Contract parameters:', {
          address: LEADERBOARD_ADDRESS,
          functionName: 'addScore',
          args: [
            BigInt(timer), // time
            puzzleHash,    // puzzleHash
            signature     // signature
          ]
        });

        await writeContract({
          address: LEADERBOARD_ADDRESS,
          abi: LEADERBOARD_ABI,
          functionName: 'addScore',
          args: [BigInt(timer), puzzleHash, signature],
        });
      } catch (contractError) {
        console.error('Contract call error details:', {
          error: contractError,
          params: {
            time: timer,
            puzzleHash: puzzleHash,
            signature: signature
          }
        });
        throw contractError;
      }

    } catch (error) {
      console.error('Full error:', error);
      toast.error(error.message || 'Failed to submit score');
      setShowCancelPopup(true);
    }
  };

  const handleDone = () => {
    onClose();
    window.location.href = '/';
  };

  // Show cancel popup
  if (showCancelPopup) {
    return <CancelPopup onSubmitAgain={handleSubmitScore} />;
  }

  // Processing view
  if (isPending) {
    return (
      <div className="modal-overlay">
        <div className="modal-content">
          <h2 className="modal-title">⏳ Processing Transaction</h2>
          <div className="modal-body">
            <p>Please confirm the transaction in your wallet...</p>
            <p>Time: <strong>{formatTime(timer)}</strong></p>
          </div>
        </div>
      </div>
    );
  }

  // Success view
  if (isSubmitted) {
    return (
      <div className="modal-overlay">
        <div className="modal-content">
          <h2 className="modal-title">✅ Score Submitted!</h2>
          <div className="modal-body">
            <p>Your score has been submitted to the leaderboard!</p>
            <p>Time: <strong>{formatTime(timer)}</strong></p>
          </div>
          <div className="modal-footer">
            <button onClick={handleDone} className="btn btn-primary">
              Done
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Initial congratulations view
  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2 className="modal-title">🎉 Congratulations!</h2>
        <div className="modal-body">
          <p>You've completed the puzzle!</p>
          <p>Time: <strong>{formatTime(timer)}</strong></p>
          {difficulty && (
            <p>Difficulty: <strong>{difficulty}</strong></p>
          )}
        </div>
        <div className="modal-footer">
          {nftBalance && nftBalance > 0n ? (
            <button onClick={handleSubmitScore} className="btn btn-primary">
              Submit Score
            </button>
          ) : (
            <div className="error-message">
              You need to own the NFT to submit scores
            </div>
          )}
          <button onClick={onClose} className="btn btn-secondary">
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default WinModal;