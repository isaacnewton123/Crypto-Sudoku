// src/components/modals/LeaderboardModal.jsx
import { useEffect, useState } from 'react';
import { useReadContract } from 'wagmi';
import '../../styles/modal.css';

const LEADERBOARD_ADDRESS = "0x043aca1f7284705d3e05318a72f9f5fd32cb1940";
const LEADERBOARD_ABI = [
  {
    "inputs": [],
    "name": "currentSeason",
    "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
    "stateMutability": "view",
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
];

const LeaderboardModal = ({ show, onClose }) => {
  const [scores, setScores] = useState([]);
  const [seasonInfo, setSeasonInfo] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Get current season number
  const { data: currentSeason } = useReadContract({
    address: LEADERBOARD_ADDRESS,
    abi: LEADERBOARD_ABI,
    functionName: 'currentSeason',
    enabled: show,
  });

  // Get season info
  const { data: seasonInfoData } = useReadContract({
    address: LEADERBOARD_ADDRESS,
    abi: LEADERBOARD_ABI,
    functionName: 'getSeasonInfo',
    args: [currentSeason || 1n],
    enabled: Boolean(currentSeason),
  });

  // Get leaderboard data
  const { 
    data: leaderboardData,
    isError,
    isLoading: scoresLoading,
    error: scoresError
  } = useReadContract({
    address: LEADERBOARD_ADDRESS,
    abi: LEADERBOARD_ABI,
    functionName: 'getSeasonTopScores',
    args: [currentSeason || 1n, 10n],
    enabled: Boolean(currentSeason),
  });

  useEffect(() => {
    if (seasonInfoData) {
      const [startTime, endTime, isActive, totalScores, hasEnded] = seasonInfoData;
      setSeasonInfo({
        startTime: Number(startTime),
        endTime: Number(endTime),
        isActive,
        totalScores: Number(totalScores),
        hasEnded
      });
    }
  }, [seasonInfoData]);

  useEffect(() => {
    if (leaderboardData) {
      const [players, times, timestamps] = leaderboardData;
      const formattedScores = players.map((player, index) => ({
        player,
        time: Number(times[index]),
        timestamp: Number(timestamps[index])
      }));
      setScores(formattedScores);
      setIsLoading(false);
    }
    
    if (isError) {
      setError(scoresError?.message || 'Failed to load scores');
      setIsLoading(false);
    }
  }, [leaderboardData, isError, scoresError]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const formatAddress = (address) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  // Format time remaining
  const getTimeRemaining = () => {
    if (!seasonInfo) return '';
    
    const now = Math.floor(Date.now() / 1000);
    const remaining = seasonInfo.endTime - now;
    
    if (remaining <= 0) return 'Season ended';
    
    const days = Math.floor(remaining / (24 * 60 * 60));
    const hours = Math.floor((remaining % (24 * 60 * 60)) / (60 * 60));
    
    return `${days}d ${hours}h remaining`;
  };

  if (!show) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="leaderboard-header">
          <h2 className="leaderboard-title">
            🏆 Leaderboard
            {currentSeason && (
              <span className="season-info">
                Season {Number(currentSeason)}
              </span>
            )}
            <button 
              onClick={onClose}
              className="close-button"
              aria-label="Close"
            >
              ×
            </button>
          </h2>
          {seasonInfo && seasonInfo.isActive && (
            <div className="time-remaining">
              {getTimeRemaining()}
            </div>
          )}
        </div>

        {isLoading ? (
          <div className="loading">Loading scores...</div>
        ) : error ? (
          <div className="error">
            {error}
          </div>
        ) : scores.length === 0 ? (
          <div className="empty">No scores yet. Be the first one!</div>
        ) : (
          <div className="leaderboard-list">
            {scores.map((score, index) => (
              <div key={index} className="leaderboard-item">
                <div className="score-rank">#{index + 1}</div>
                <div className="score-address" title={score.player}>
                  {formatAddress(score.player)}
                </div>
                <div className="score-time" title={new Date(score.timestamp * 1000).toLocaleString()}>
                  {formatTime(score.time)}
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="modal-footer">
          <button onClick={onClose} className="btn btn-secondary">
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default LeaderboardModal;