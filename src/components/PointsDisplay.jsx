// src/components/PointsDisplay.jsx
import React, { useMemo } from 'react';
import '../styles/stats.css';

/**
 * Simplified points display component
 */
const PointsDisplay = ({ timer, mistakes }) => {
  // Konstanta dari smart contract
  const MAX_TIME = 7200; // 2 jam dalam detik
  const MISTAKE_PENALTY = 100;

  // Menghitung poin saat ini
  const points = useMemo(() => {
    const timePoints = MAX_TIME - timer;
    const mistakePenalty = mistakes * MISTAKE_PENALTY;
    
    if (mistakePenalty >= timePoints) {
      return 0;
    }
    
    return Math.max(0, Math.floor(timePoints - mistakePenalty));
  }, [timer, mistakes]);

  return (
    <div className="points-display">
      <div className="points-label">Points:</div>
      <div className="points-value">{points.toLocaleString()}</div>
    </div>
  );
};

export default PointsDisplay;