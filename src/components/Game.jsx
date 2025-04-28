// src/components/Game.jsx
import { useState, useEffect, useRef } from 'react';
import { useAccount, useReadContract, useChainId, useSwitchChain, useSignMessage } from 'wagmi';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { toast } from 'react-toastify';
import Board from './Board';
import NumberPad from './NumberPad';
import StatsDisplay from './StatsDisplay';
import PointsDisplay from './PointsDisplay'; 
import WinModal from './modals/WinModal';
import GameOverModal from './modals/GameOverModal';
import SurrenderModal from './modals/SurrenderModal';
import HelpModal from './modals/HelpModal';
import LeaderboardModal from './modals/LeaderboardModal';
import HomeScreen from './HomeScreen';
import ThemeToggle from './ThemeToggle';
import CountdownAnimation from './CountdownAnimation';
import { generateSudoku } from '../utils/sudoku';
import { mintSepolia, monadTestnet } from '../config/networks';
import { gameAudio } from '../utils/audio';
import { 
  requestGameStartSignature, 
  requestNewGameSignature 
} from '../utils/signatureService';
import '../styles/game-header.css';
import '../styles/network-selector.css';

// SVG Icons
const VolumeIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
    <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
    <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
  </svg>
);

const MuteIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
    <line x1="23" y1="9" x2="17" y2="15" />
    <line x1="17" y1="9" x2="23" y2="15" />
  </svg>
);

const ChevronUpIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="18 15 12 9 6 15"></polyline>
  </svg>
);

// Object to store contract addresses according to the network
const NETWORK_CONTRACTS = {
  [mintSepolia.id]: {
    nftContract: "0x5E5b7277FFD01CC442184a1c2d375F421f3a1562",
    leaderboardContract: "0x6b3fddfccfc1f7ccf54f890766e24c5d65697898",
  },
  [monadTestnet.id]: {
    nftContract: "0x74ffe581f893a630db0094757eb8f9c47108606b",
    leaderboardContract: "0x2a2f9179b137a1fb718f3290cb5bda730c89dec6",
  }
};

// Get supported networks
const SUPPORTED_NETWORKS = [mintSepolia, monadTestnet];

const NFT_ABI = [
  {
    "inputs": [{"internalType": "address", "name": "owner", "type": "address"}],
    "name": "balanceOf",
    "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  }
];

const Game = () => {
  const { address, isConnected } = useAccount();
  const chainId = useChainId();
  const { switchChain } = useSwitchChain();
  const { signMessageAsync } = useSignMessage();
  
  const [gameBoard, setGameBoard] = useState(Array(9).fill().map(() => Array(9).fill(0)));
  const [solution, setSolution] = useState([]);
  const [selectedCell, setSelectedCell] = useState(null);
  const [mistakes, setMistakes] = useState(0);
  const [timer, setTimer] = useState(0);
  const [isGameActive, setIsGameActive] = useState(false);
  const [showWinModal, setShowWinModal] = useState(false);
  const [showGameOverModal, setShowGameOverModal] = useState(false);
  const [showSurrenderConfirm, setShowSurrenderConfirm] = useState(false);
  const [showHelpModal, setShowHelpModal] = useState(false);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [difficulty, setDifficulty] = useState('medium');
  const [cellStatus, setCellStatus] = useState({});
  const [isHeaderVisible, setIsHeaderVisible] = useState(true);
  const [selectedNetwork, setSelectedNetwork] = useState(null);
  const [isSoundEnabled, setIsSoundEnabled] = useState(() => {
    const saved = localStorage.getItem('sudoku-sound-enabled');
    return saved !== null ? JSON.parse(saved) : true;
  });
  // State for countdown animation
  const [showCountdown, setShowCountdown] = useState(false);
  const [isSignatureVerifying, setIsSignatureVerifying] = useState(false);
  
  // Reference untuk game timer
  const startTimeRef = useRef(null);

  // Get contract addresses based on active network
  const contracts = NETWORK_CONTRACTS[chainId] || NETWORK_CONTRACTS[mintSepolia.id];
  const nftContractAddress = contracts?.nftContract;
  const leaderboardContractAddress = contracts?.leaderboardContract;

  const { data: nftBalance } = useReadContract({
    address: nftContractAddress,
    abi: NFT_ABI,
    functionName: 'balanceOf',
    args: [address],
    enabled: Boolean(address) && Boolean(nftContractAddress),
  });

  // Debug countdown state changes
  useEffect(() => {
    console.log("showCountdown state changed:", showCountdown);
  }, [showCountdown]);

  useEffect(() => {
    gameAudio.setEnabled(isSoundEnabled);
    localStorage.setItem('sudoku-sound-enabled', JSON.stringify(isSoundEnabled));
  }, [isSoundEnabled]);

  useEffect(() => {
    // Get selected network based on chainId
    const currentNetwork = SUPPORTED_NETWORKS.find(network => network.id === chainId);
    setSelectedNetwork(currentNetwork || null);
  }, [chainId]);

  useEffect(() => {
    if (isConnected && !SUPPORTED_NETWORKS.some(network => network.id === chainId)) {
      toast.error('Please select a supported network');
    }
  }, [chainId, isConnected]);

  useEffect(() => {
    if (isConnected && nftBalance === 0n) {
      toast.error('You need to own the required NFT to play');
    }
  }, [isConnected, nftBalance]);

  // Timer effect - menggunakan detik dengan presisi milidetik
  useEffect(() => {
    let animationFrameId;
    
    if (isGameActive) {
      startTimeRef.current = Date.now();
      
      const updateTimer = () => {
        const elapsedTime = (Date.now() - startTimeRef.current) / 1000; // Dalam detik dengan milidetik
        setTimer(elapsedTime);
        animationFrameId = requestAnimationFrame(updateTimer);
      };
      
      animationFrameId = requestAnimationFrame(updateTimer);
    }
    
    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, [isGameActive]);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyboardInput);
    return () => {
      document.removeEventListener('keydown', handleKeyboardInput);
    };
  }, [isGameActive, selectedCell]);

  const playSound = (type) => {
    gameAudio.play(type);
  };

  const exitGame = () => {
    setGameStarted(false);
    setIsGameActive(false);
    setShowGameOverModal(false);
    setGameBoard(Array(9).fill().map(() => Array(9).fill(0)));
    setSolution([]);
    setSelectedCell(null);
    setMistakes(0);
    setTimer(0);
    setCellStatus({});
  };

  // Updated with debug logs and fixed game initialization
  const startGameWithSignature = async () => {
    if (!SUPPORTED_NETWORKS.some(network => network.id === chainId)) {
      toast.error('Please select a supported network');
      return;
    }
    
    try {
      console.log("Starting game signature process with address:", address);
      setIsSignatureVerifying(true);
      
      // Reset state permainan
      setMistakes(0);
      setTimer(0);
      setCellStatus({});
      
      // Pastikan timer berhenti
      setIsGameActive(false);
      
      // Request signature from the user with signMessageAsync directly
      console.log("Before requesting signature");
      await requestGameStartSignature(address, signMessageAsync);
      console.log("Signature successful, showing countdown");
      
      // Set gameStarted to true BEFORE showing countdown
      setGameStarted(true);
      console.log("Game started set to TRUE");
      
      // Then show the countdown
      setShowCountdown(true);
      console.log("State showCountdown set to TRUE");
      
      // Actual game initialization will happen after countdown completes
    } catch (error) {
      console.error("Error during signature process:", error);
      setIsSignatureVerifying(false);
      console.error("Failed to start game:", error);
      // Toast error is handled in the signature service
    }
  };

  // This function is called after countdown completes
  const initializeGame = () => {
    console.log("Initializing game after countdown");
    const { board, solution: newSolution } = generateSudoku(difficulty);
    setGameBoard(board);
    setSolution(newSolution);
    setMistakes(0);
    setTimer(0);
    setIsGameActive(true);
    setSelectedCell(null);
    setShowGameOverModal(false);
    setCellStatus({});
    setIsSignatureVerifying(false);
    setShowCountdown(false);
    console.log("Game initialized successfully");
  };

  const handleCountdownComplete = () => {
    console.log("Countdown completed");
    setTimeout(() => {
      // Reset timer sebelum inisialisasi game
      setTimer(0);
      // Kemudian inisialisasi game
      initializeGame();
    }, 500); // Short delay after countdown completes
  };

  const handleSurrender = () => {
    setShowSurrenderConfirm(true);
  };

  const confirmSurrender = () => {
    setShowSurrenderConfirm(false);
    setIsGameActive(false);
    setShowGameOverModal(true);
    playSound('gameover');
    toast.info('Game surrendered');
  };

  const cancelSurrender = () => {
    setShowSurrenderConfirm(false);
  };

  // Updated New Game function with signature and debug logs
  const startNewGameWithSignature = async () => {
    try {
      console.log("Starting new game with signature");
      setIsSignatureVerifying(true);
      
      // Reset state permainan saat memulai permainan baru
      setMistakes(0);
      setTimer(0);
      setCellStatus({});
      
      // Pastikan timer berhenti
      setIsGameActive(false);
      
      // Request signature for new game with signMessageAsync
      console.log("Before requesting new game signature");
      await requestNewGameSignature(address, signMessageAsync);
      console.log("New game signature successful");
      
      // If signature successful, start countdown
      setShowWinModal(false);
      setShowGameOverModal(false);
      setShowCountdown(true);
      console.log("State showCountdown set to TRUE for new game");
      
      // Game will initialize after countdown
    } catch (error) {
      console.error("Error during new game signature:", error);
      setIsSignatureVerifying(false);
      console.error("Failed to start new game:", error);
    }
  };

  const handleNumberInput = (number) => {
    if (!selectedCell || !isGameActive) return;

    const [row, col] = selectedCell;
    const cellKey = `${row}-${col}`;

    if (number === 0) {
      const newBoard = [...gameBoard];
      newBoard[row][col] = 0;
      setGameBoard(newBoard);
      
      const newStatus = {...cellStatus};
      delete newStatus[cellKey];
      setCellStatus(newStatus);
      return;
    }

    if (solution[row][col] === number) {
      const newBoard = [...gameBoard];
      newBoard[row][col] = number;
      setGameBoard(newBoard);
      
      setCellStatus(prev => ({
        ...prev,
        [cellKey]: 'correct'
      }));
      
      playSound('correct');
      checkWin(newBoard);
    } else {
      setCellStatus(prev => ({
        ...prev,
        [cellKey]: 'wrong'
      }));
      
      setMistakes(m => {
        const newMistakes = m + 1;
        if (newMistakes >= 10) {
          gameOver();
        }
        return newMistakes;
      });
      playSound('error');

      setTimeout(() => {
        setCellStatus(prev => {
          const newStatus = {...prev};
          delete newStatus[cellKey];
          return newStatus;
        });
      }, 400);
    }
  };

  const handleKeyboardInput = (e) => {
    if (!isGameActive) return;

    if (e.key >= '1' && e.key <= '9') {
      handleNumberInput(parseInt(e.key));
    } else if (e.key === 'Backspace' || e.key === 'Delete') {
      handleNumberInput(0);
    }
  };

  const checkWin = (board) => {
    for (let i = 0; i < 9; i++) {
      for (let j = 0; j < 9; j++) {
        if (board[i][j] !== solution[i][j]) return;
      }
    }
    gameWon();
  };

  const gameWon = () => {
    console.log('Game won! Timer:', timer, 'Mistakes:', mistakes);
    setIsGameActive(false);
    setShowWinModal(true);
    playSound('win');
  };

  const gameOver = () => {
    setIsGameActive(false);
    setShowGameOverModal(true);
    playSound('gameover');
  };

  const canPlay = isConnected && nftBalance && nftBalance > 0n && 
    SUPPORTED_NETWORKS.some(network => network.id === chainId);

  if (!isConnected) {
    return <HomeScreen hasNFT={false} />;
  }

  // Display network selection modal if not on a supported network
  if (!SUPPORTED_NETWORKS.some(network => network.id === chainId)) {
    return (
      <div className="wrong-network-container">
        <div className="wrong-network-modal">
          <h2>Unsupported Network</h2>
          <p>Please select a network to play:</p>
          <div className="network-buttons">
            {SUPPORTED_NETWORKS.map(network => (
              <button 
                key={network.id}
                className="switch-network-btn"
                onClick={() => switchChain({ chainId: network.id })}
              >
                {network.name}
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!canPlay) {
    return <HomeScreen hasNFT={false} />;
  }

  if (!gameStarted) {
    return (
      <HomeScreen 
        hasNFT={true}
        onStart={startGameWithSignature}
        networkName={selectedNetwork?.name}
        isSignatureVerifying={isSignatureVerifying}
      />
    );
  }

  return (
    <div className="game-layout">
      {/* Countdown Animation Component */}
      <CountdownAnimation 
        isActive={showCountdown} 
        onComplete={handleCountdownComplete} 
      />
    
      <button 
        className={`toggle-header-btn ${!isHeaderVisible ? 'header-hidden' : ''}`}
        onClick={() => setIsHeaderVisible(!isHeaderVisible)}
        title={isHeaderVisible ? "Hide Header" : "Show Header"}
      >
        <ChevronUpIcon />
      </button>

      <header className={`game-header ${!isHeaderVisible ? 'hidden' : ''}`}>
        <div className="header-container">
          <div className="header-left">
            <button 
              className="header-button primary"
              onClick={startNewGameWithSignature}
              disabled={isSignatureVerifying || showCountdown}
            >
              {isSignatureVerifying ? 'Verifying...' : 'New Game'}
            </button>
            <button 
              className="header-button danger"
              onClick={handleSurrender}
              disabled={isSignatureVerifying || showCountdown}
            >
              Surrender
            </button>
          </div>

          <div className="header-right">
            <ThemeToggle />
            <button 
              className="header-button icon-button"
              onClick={() => setIsSoundEnabled(!isSoundEnabled)}
              title={isSoundEnabled ? "Disable Sound" : "Enable Sound"}
            >
              {isSoundEnabled ? <VolumeIcon /> : <MuteIcon />}
            </button>
            <button 
              className="header-button secondary"
              onClick={() => setShowHelpModal(true)}
            >
              <span>FAQ</span>
            </button>
            <button 
              className="header-button secondary"
              onClick={() => setShowLeaderboard(true)}
            >
              <span>Leaderboard</span>
            </button>
            <ConnectButton />
          </div>
        </div>
      </header>

      <main className="game-content">
        <div className="game-container">
          <StatsDisplay 
            timer={timer}
            mistakes={mistakes}
            maxMistakes={10}
          />

          <PointsDisplay timer={timer} mistakes={mistakes} />

          {gameBoard && gameBoard.length > 0 && (
            <Board
              board={gameBoard}
              selectedCell={selectedCell}
              setSelectedCell={setSelectedCell}
              cellStatus={cellStatus}
              isCountdownActive={showCountdown}
            />
          )}
          <NumberPad onNumberClick={handleNumberInput} />
          
          {/* Add active network information */}
          <div className="network-info">
            <p>Network: <strong>{selectedNetwork?.name}</strong></p>
          </div>
        </div>
      </main>

      <WinModal
        show={showWinModal}
        onClose={() => setShowWinModal(false)}
        onPlayAgain={startNewGameWithSignature}
        timer={timer}
        mistakes={mistakes}
        difficulty={difficulty}
        leaderboardAddress={leaderboardContractAddress}
        nftContractAddress={nftContractAddress}
        isSignatureVerifying={isSignatureVerifying}
      />
      
      <GameOverModal
        show={showGameOverModal}
        onClose={exitGame}
        onPlayAgain={startNewGameWithSignature}
        isSignatureVerifying={isSignatureVerifying}
      />

      <SurrenderModal
        show={showSurrenderConfirm}
        onConfirm={confirmSurrender}
        onCancel={cancelSurrender}
      />

      <HelpModal
        show={showHelpModal}
        onClose={() => setShowHelpModal(false)}
      />

      <LeaderboardModal 
        show={showLeaderboard}
        onClose={() => setShowLeaderboard(false)}
        leaderboardAddress={leaderboardContractAddress}
      />
    </div>
  );
};

export default Game;
