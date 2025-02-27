// src/components/modals/LeaderboardModal.jsx
import { useEffect, useState } from 'react';
import { useReadContract } from 'wagmi';
import '../../styles/modal.css';

const LEADERBOARD_ABI = [
  {
    "inputs": [],
    "name": "currentSeason",
    "outputs": [{"internalType": "uint16", "name": "", "type": "uint16"}],
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
];

const LeaderboardModal = ({ show, onClose, leaderboardAddress }) => {
  const [scores, setScores] = useState([]);
  const [seasonInfo, setSeasonInfo] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [maxScoresPerSeason, setMaxScoresPerSeason] = useState(100); // Default to 100

  // Get current season number
  const { data: currentSeason } = useReadContract({
    address: leaderboardAddress,
    abi: LEADERBOARD_ABI,
    functionName: 'currentSeason',
    enabled: show && Boolean(leaderboardAddress),
  });

  // Get season info
  const { data: seasonInfoData } = useReadContract({
    address: leaderboardAddress,
    abi: LEADERBOARD_ABI,
    functionName: 'getSeasonInfo',
    args: [currentSeason || 1n],
    enabled: Boolean(currentSeason) && Boolean(leaderboardAddress),
  });

  // Get leaderboard data using pagination
  const { 
    data: leaderboardData,
    isError,
    isLoading: scoresLoading,
    error: scoresError
  } = useReadContract({
    address: leaderboardAddress,
    abi: LEADERBOARD_ABI,
    functionName: 'getSeasonScoresPaginated',  // Use pagination function
    args: [currentSeason || 1n, BigInt(currentPage)], // Page is zero-based
    enabled: Boolean(currentSeason) && Boolean(leaderboardAddress),
  });

  useEffect(() => {
    if (seasonInfoData) {
      // Akses data dari hasil getSeasonInfo
      const [startTime, endTime, isActive, totalScores, hasEnded, maxScores] = seasonInfoData;
      
      setSeasonInfo({
        startTime: Number(startTime),
        endTime: Number(endTime),
        isActive,
        totalScores: Number(totalScores),
        hasEnded
      });
      
      // Calculate total pages
      const scoreCount = Number(totalScores);
      const SCORES_PER_PAGE = 20; // Match with smart contract constant
      const calculatedPages = Math.ceil(scoreCount / SCORES_PER_PAGE);
      setTotalPages(calculatedPages > 0 ? calculatedPages : 1);
      
      // Set max scores per season
      if (maxScores) {
        setMaxScoresPerSeason(Number(maxScores));
      }
      
      console.log('Season info:', {
        season: Number(currentSeason),
        scores: scoreCount,
        pages: calculatedPages,
        maxScores: Number(maxScores)
      });
    }
  }, [seasonInfoData, currentSeason]);

  useEffect(() => {
    if (leaderboardData) {
      const [players, times, mistakes, points, timestamps] = leaderboardData;
      
      console.log('Leaderboard data received:', {
        players: players.length,
        times: times.length,
        page: currentPage
      });
      
      const formattedScores = players.map((player, index) => ({
        player,
        time: Number(times[index]),
        mistakes: Number(mistakes[index]),
        points: Number(points[index]),
        timestamp: Number(timestamps[index])
      }));
      
      setScores(formattedScores);
      setIsLoading(false);
    }
    
    if (isError) {
      console.error('Leaderboard error:', scoresError);
      setError(scoresError?.message || 'Failed to load scores');
      setIsLoading(false);
    }
  }, [leaderboardData, isError, scoresError, currentPage]);

  // Format waktu dalam detik (bukan milidetik)
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    // Pad seconds with leading zeros
    return `${mins}:${secs.toString().padStart(2, '0')}`;
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

  if (!leaderboardAddress) {
    return (
      <div className="modal-overlay">
        <div className="modal-content">
          <div className="leaderboard-header">
            <h2 className="leaderboard-title">
              🏆 Leaderboard
              <button 
                onClick={onClose}
                className="close-button"
                aria-label="Close"
              >
                ×
              </button>
            </h2>
          </div>
          <div className="error">
            Leaderboard contract not available for this network
          </div>
          <div className="modal-footer">
            <button onClick={onClose} className="btn btn-secondary">
              Close
            </button>
          </div>
        </div>
      </div>
    );
  }

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
                <div className="score-rank">#{(currentPage * 20) + index + 1}</div>
                <div className="score-address" title={score.player}>
                  {formatAddress(score.player)}
                </div>
                <div className="score-details">
                  <div className="score-time" title={new Date(score.timestamp * 1000).toLocaleString()}>
                    {formatTime(score.time)}
                  </div>
                  <div className="score-mistakes">
                    Mistakes: {score.mistakes}
                  </div>
                  <div className="score-points">
                    <strong>{score.points.toLocaleString()} pts</strong>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {scores.length > 0 && (
          <div className="pagination">
            <button 
              onClick={() => setCurrentPage(Math.max(0, currentPage - 1))}
              disabled={currentPage === 0}
              className="pagination-btn"
            >
              Previous
            </button>
            <span className="page-info">
              Page {currentPage + 1} of {totalPages}
            </span>
            <button 
              onClick={() => setCurrentPage(currentPage + 1)}
              disabled={currentPage >= totalPages - 1 || scores.length < 20}
              className="pagination-btn"
            >
              Next
            </button>
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