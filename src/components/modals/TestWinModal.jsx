// src/components/modals/TestWinModal.jsx
import React, { useState, useEffect } from 'react';
import '../../styles/modal.css';

const TestWinModal = ({ 
  show, 
  onClose, 
  onConfirm, 
  time, 
  setTime,
  mistakes, 
  setMistakes 
}) => {
  const [estimatedPoints, setEstimatedPoints] = useState(0);
  
  // Konstanta untuk menghitung poin (HARUS SAMA dengan di smart contract)
  const MAX_TIME = 7200; // Maksimal waktu dalam detik (2 jam)
  const MAX_MISTAKES = 9; // Maksimal kesalahan
  const MISTAKE_PENALTY = 100; // Penalti per kesalahan

  // Recalculate points whenever time or mistakes change - sesuai dengan smart contract
  useEffect(() => {
    if (time <= MAX_TIME && mistakes <= MAX_MISTAKES && time > 0) {
      // Rumus sesuai dengan smart contract
      const timePoints = MAX_TIME - time;
      const mistakePenalty = mistakes * MISTAKE_PENALTY;
      
      // Perhitungan yang sama dengan smart contract
      let calculatedPoints = 0;
      if (mistakePenalty < timePoints) {
        calculatedPoints = timePoints - mistakePenalty;
      }
      
      setEstimatedPoints(Math.floor(calculatedPoints)); // Gunakan Math.floor untuk memastikan integer
    } else {
      setEstimatedPoints(0);
    }
  }, [time, mistakes]);

  if (!show) return null;

  const handleTimeChange = (e) => {
    // Pastikan nilai valid (positif dan tidak melebihi MAX_TIME)
    const value = parseFloat(e.target.value);
    if (!isNaN(value) && value >= 1 && value <= MAX_TIME) {
      // Simpan waktu sebagai integer
      setTime(Math.floor(value));
    }
  };

  const handleMistakesChange = (e) => {
    // Pastikan nilai valid (integer positif dan <= MAX_MISTAKES)
    const value = parseInt(e.target.value);
    if (!isNaN(value) && value >= 0 && value <= MAX_MISTAKES) {
      setMistakes(value);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content test-win-modal">
        <div className="modal-header">
          <h2>Test Win</h2>
          <button className="close-button" onClick={onClose}>×</button>
        </div>
        
        <div className="modal-body">
          <p className="dev-warning">Developer Only: This will simulate winning with custom values.</p>
          
          <div className="test-win-inputs">
            <div className="input-group">
              <label htmlFor="test-time">Time (seconds - integer):</label>
              <input 
                id="test-time"
                type="number" 
                min="1" 
                max={MAX_TIME}
                step="1"
                value={time} 
                onChange={handleTimeChange}
                className="time-input"
              />
              <span className="input-hint">Must be between 1 and {MAX_TIME} seconds ({Math.floor(MAX_TIME/3600)} hours)</span>
            </div>
            
            <div className="input-group">
              <label htmlFor="test-mistakes">Mistakes:</label>
              <input 
                id="test-mistakes"
                type="number" 
                min="0" 
                max={MAX_MISTAKES}
                value={mistakes} 
                onChange={handleMistakesChange}
                className="mistake-input"
              />
              <span className="input-hint">Max: {MAX_MISTAKES} mistakes</span>
            </div>
          </div>
          
          <div className="score-preview">
            <h3>Estimated Score:</h3>
            <p>
              {time <= MAX_TIME && mistakes <= MAX_MISTAKES && time > 0 ? 
                `${estimatedPoints.toLocaleString()} points` : 
                'Invalid values (exceeds max or min limits)'
              }
            </p>
            <div className="calculation-detail">
              <small>
                Calculation: {MAX_TIME} - {time} - ({mistakes} × {MISTAKE_PENALTY}) = {estimatedPoints}
              </small>
            </div>
          </div>
        </div>
        
        <div className="modal-footer">
          <button onClick={onClose} className="cancel-button">Cancel</button>
          <button 
            onClick={onConfirm} 
            className="confirm-button"
            disabled={time <= 0 || time > MAX_TIME || mistakes > MAX_MISTAKES}
          >
            Test Win
          </button>
        </div>
      </div>
    </div>
  );
};

export default TestWinModal;