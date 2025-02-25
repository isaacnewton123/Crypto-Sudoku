// src/components/Game.jsx
import { useState, useEffect } from 'react';
import { useAccount, useReadContract, useChainId, useSwitchChain } from 'wagmi';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { toast } from 'react-toastify';
import Board from './Board';
import NumberPad from './NumberPad';
import StatsDisplay from './StatsDisplay';
import WinModal from './modals/WinModal';
import GameOverModal from './modals/GameOverModal';
import SurrenderModal from './modals/SurrenderModal';
import HelpModal from './modals/HelpModal';
import LeaderboardModal from './modals/LeaderboardModal';
import HomeScreen from './HomeScreen';
import ThemeToggle from './ThemeToggle';
import { generateSudoku } from '../utils/sudoku';
import { mintSepolia } from '../config/networks';
import { gameAudio } from '../utils/audio';
import '../styles/game-header.css';

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

const NFT_CONTRACT = "0x480c9ebaba0860036c584ef70379dc82efb151bf";
const LEADERBOARD_ADDRESS = "0x043aca1f7284705d3e05318a72f9f5fd32cb1940";

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
  const [isSoundEnabled, setIsSoundEnabled] = useState(() => {
    const saved = localStorage.getItem('sudoku-sound-enabled');
    return saved !== null ? JSON.parse(saved) : true;
  });

  const { data: nftBalance } = useReadContract({
    address: NFT_CONTRACT,
    abi: NFT_ABI,
    functionName: 'balanceOf',
    args: [address],
    enabled: Boolean(address),
  });

  useEffect(() => {
    gameAudio.setEnabled(isSoundEnabled);
    localStorage.setItem('sudoku-sound-enabled', JSON.stringify(isSoundEnabled));
  }, [isSoundEnabled]);

  useEffect(() => {
    if (isConnected && chainId !== mintSepolia.id) {
      toast.error('Please switch to Mint Sepolia Network');
      switchChain({ chainId: mintSepolia.id });
    }
  }, [chainId, isConnected, switchChain]);

  useEffect(() => {
    if (isConnected && nftBalance === 0n) {
      toast.error('You need to own the required NFT to play');
    }
  }, [isConnected, nftBalance]);

  useEffect(() => {
    let interval;
    if (isGameActive) {
      interval = setInterval(() => {
        setTimer(t => t + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
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

  const initializeGame = () => {
    if (chainId !== mintSepolia.id) {
      toast.error('Please switch to Mint Sepolia Network first');
      switchChain({ chainId: mintSepolia.id });
      return;
    }
    
    const { board, solution: newSolution } = generateSudoku(difficulty);
    setGameBoard(board);
    setSolution(newSolution);
    setMistakes(0);
    setTimer(0);
    setIsGameActive(true);
    setSelectedCell(null);
    setGameStarted(true);
    setShowGameOverModal(false);
    setCellStatus({});
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
    setIsGameActive(false);
    setShowWinModal(true);
    playSound('win');
  };

  const gameOver = () => {
    setIsGameActive(false);
    setShowGameOverModal(true);
    playSound('gameover');
  };

  const startNewGame = () => {
    setShowWinModal(false);
    setShowGameOverModal(false);
    initializeGame();
  };

  const canPlay = isConnected && nftBalance && nftBalance > 0n && chainId === mintSepolia.id;

  if (!isConnected) {
    return <HomeScreen hasNFT={false} />;
  }

  if (chainId !== mintSepolia.id) {
    return (
      <div className="wrong-network-container">
        <div className="wrong-network-modal">
          <h2>Wrong Network</h2>
          <p>Please switch to Mint Sepolia Network to continue</p>
          <button 
            className="switch-network-btn"
            onClick={() => switchChain({ chainId: mintSepolia.id })}
          >
            Switch to Mint Sepolia
          </button>
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
        onStart={initializeGame}
      />
    );
  }

  return (
    <div className="game-layout">
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
              onClick={startNewGame}
            >
              New Game
            </button>
            <button 
              className="header-button danger"
              onClick={handleSurrender}
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

          {gameBoard && gameBoard.length > 0 && (
            <Board
              board={gameBoard}
              selectedCell={selectedCell}
              setSelectedCell={setSelectedCell}
              cellStatus={cellStatus}
            />
          )}
          <NumberPad onNumberClick={handleNumberInput} />
        </div>
      </main>

      <WinModal
        show={showWinModal}
        onClose={() => setShowWinModal(false)}
        onPlayAgain={startNewGame}
        timer={timer}
        difficulty={difficulty}
      />
      
      <GameOverModal
        show={showGameOverModal}
        onClose={exitGame}
        onPlayAgain={startNewGame}
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
      />
    </div>
  );
};

export default Game;