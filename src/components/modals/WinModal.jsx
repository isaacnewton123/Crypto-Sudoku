// src/components/modals/WinModal.jsx
import { useState } from 'react';
import { useAccount, useWriteContract, useReadContract, useChainId } from 'wagmi';
import { toast } from 'react-toastify';
import { keccak256, toBytes, stringToHex } from 'viem';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'https://api.cryptosudoku.xyz';
const NFT_ABI = [
  {
    "inputs": [{"internalType": "address", "name": "owner", "type": "address"}],
    "name": "balanceOf",
    "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  }
];

const LEADERBOARD_ABI = [
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

const WinModal = ({ 
  show, 
  onClose, 
  timer, 
  mistakes,
  difficulty, 
  leaderboardAddress, 
  nftContractAddress,
  onPlayAgain,
  isSignatureVerifying 
}) => {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showCancelPopup, setShowCancelPopup] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { address } = useAccount();
  const chainId = useChainId();
  
  // Check NFT ownership
  const { data: nftBalance } = useReadContract({
    address: nftContractAddress,
    abi: NFT_ABI,
    functionName: 'balanceOf',
    args: [address],
    enabled: show && Boolean(address) && Boolean(nftContractAddress),
  });

  const { writeContractAsync, isPending } = useWriteContract();

  if (!show) return null;

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    const ms = Math.floor((seconds * 1000) % 1000);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}.${ms.toString().padStart(3, '0')}`;
  };

  const handleSubmitScore = async () => {
    if (!nftBalance || nftBalance === 0n) {
      toast.error('You need to own the NFT to submit scores');
      return;
    }

    if (!leaderboardAddress) {
      toast.error('Leaderboard contract address not available');
      return;
    }

    setShowCancelPopup(false);
    setIsSubmitting(true);
    
    try {
      console.log("Starting score submission process");
      
      // PENTING: Konversi waktu ke detik (integer) dengan benar
      const timeSeconds = Math.floor(timer); // Gunakan floor untuk konsistensi
      const mistakesCount = Math.floor(mistakes); // Pastikan integer
      
      // Debug info
      console.log(`Submitting score: ${timeSeconds} seconds, ${mistakesCount} mistakes`);
      
      // Generate puzzle hash
      const puzzleData = {
        difficulty,
        timeSeconds,
        mistakes: mistakesCount,
        player: address
      };
      
      console.log('Puzzle data:', puzzleData);
      
      const puzzleHash = keccak256(
        toBytes(stringToHex(JSON.stringify(puzzleData)))
      );

      // GET SIGNATURE FROM BACKEND
      console.log('Sending to backend:', {
        playerAddress: address,
        timeSeconds: timeSeconds,
        mistakes: mistakesCount,
        puzzleHash: puzzleHash,
        difficulty: difficulty,
        chainId: chainId
      });

      const response = await fetch(`${BACKEND_URL}/sign-score`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          playerAddress: address,
          timeSeconds: timeSeconds, // Kirim waktu dalam detik
          mistakes: mistakesCount,
          puzzleHash: puzzleHash,
          difficulty: difficulty,
          chainId: chainId
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to get signature');
      }

      const { signature } = await response.json();

      // SUBMIT TO BLOCKCHAIN
      try {
        console.log('Contract parameters:', {
          address: leaderboardAddress,
          functionName: 'addScore',
          args: [
            BigInt(timeSeconds),   // waktu dalam detik sebagai BigInt
            BigInt(mistakesCount),      // mistakes sebagai BigInt
            puzzleHash,            // puzzleHash
            signature              // signature
          ]
        });

        // Menggunakan writeContractAsync
        const txResult = await writeContractAsync({
          address: leaderboardAddress,
          abi: LEADERBOARD_ABI,
          functionName: 'addScore',
          args: [BigInt(timeSeconds), BigInt(mistakesCount), puzzleHash, signature],
        });
        
        console.log('Transaction result:', txResult);
        
        setIsSubmitted(true);
        setIsSubmitting(false);
        toast.success('Score submitted successfully!');

      } catch (contractError) {
        console.error('Contract call error details:', contractError);
        throw contractError;
      }

    } catch (error) {
      console.error('Full error:', error);
      toast.error(error.message || 'Failed to submit score');
      setIsSubmitting(false);
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
  if (isPending || isSubmitting) {
    return (
      <div className="modal-overlay">
        <div className="modal-content">
          <h2 className="modal-title">⏳ Processing Transaction</h2>
          <div className="modal-body">
            <p>Please confirm the transaction in your wallet...</p>
            <p>Time: <strong>{formatTime(timer)}</strong></p>
            <p>Mistakes: <strong>{mistakes}</strong></p>
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
            <p>Mistakes: <strong>{mistakes}</strong></p>
            <p>The better your time and fewer mistakes, the higher your score!</p>
          </div>
          <div className="modal-footer">
            <button 
              onClick={onPlayAgain} 
              className="btn btn-primary"
              disabled={isSignatureVerifying}
            >
              {isSignatureVerifying ? 'Please sign...' : 'Play Again'}
            </button>
            <button onClick={handleDone} className="btn btn-secondary">
              Exit
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
          <p>Mistakes: <strong>{mistakes}</strong></p>
          {difficulty && (
            <p>Difficulty: <strong>{difficulty}</strong></p>
          )}
        </div>
        <div className="modal-footer">
          {nftBalance && nftBalance > 0n ? (
            <button 
              onClick={handleSubmitScore} 
              className="btn btn-primary"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Submitting...' : 'Submit Score'}
            </button>
          ) : (
            <div className="error-message">
              You need to own the NFT to submit scores
            </div>
          )}
          <button 
            onClick={onPlayAgain} 
            className="btn btn-secondary"
            disabled={isSignatureVerifying}
          >
            {isSignatureVerifying ? 'Please sign...' : 'Play Again'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default WinModal;
