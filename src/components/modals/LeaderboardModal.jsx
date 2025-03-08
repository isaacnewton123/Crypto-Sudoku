// src/components/modals/HelpModal.jsx
import { useState } from 'react';
import '../../styles/modal.css';

const HelpModal = ({ show, onClose }) => {
  const [activeTab, setActiveTab] = useState('rules');

  if (!show) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2 className="modal-title">How to Play</h2>
        
        <div className="help-tabs">
          <button 
            className={`help-tab ${activeTab === 'rules' ? 'active' : ''}`}
            onClick={() => setActiveTab('rules')}
          >
            Rules
          </button>
          <button 
            className={`help-tab ${activeTab === 'controls' ? 'active' : ''}`}
            onClick={() => setActiveTab('controls')}
          >
            Controls
          </button>
          <button 
            className={`help-tab ${activeTab === 'scoring' ? 'active' : ''}`}
            onClick={() => setActiveTab('scoring')}
          >
            Scoring
          </button>
        </div>
        
        <div className="modal-body">
          {activeTab === 'rules' && (
            <div className="help-section">
              <ul className="help-list">
                <li>Fill the 9×9 grid with numbers 1-9</li>
                <li>Each row must contain all numbers 1-9</li>
                <li>Each column must contain all numbers 1-9</li>
                <li>Each 3×3 box must contain all numbers 1-9</li>
                <li>Solve quickly with minimum mistakes for high score</li>
              </ul>
            </div>
          )}
          
          {activeTab === 'controls' && (
            <div className="help-section">
              <ul className="help-list">
                <li><strong>Select Cell:</strong> Click on any empty cell</li>
                <li><strong>Enter Number:</strong> Click a number or press 1-9 key</li>
                <li><strong>Clear Cell:</strong> Click "Clear" or press Backspace/Delete</li>
                <li><strong>New Game:</strong> Start a new game anytime</li>
                <li><strong>Mistakes:</strong> You have a maximum of 10 mistakes</li>
              </ul>
            </div>
          )}
          
          {activeTab === 'scoring' && (
            <div className="help-section">
              <p className="score-formula">
                Points = (7200 - Time) - (Mistakes × 100)
              </p>
              <ul className="help-list">
                <li><strong>Time:</strong> Faster completion gives more points</li>
                <li><strong>Mistakes:</strong> Each mistake costs 100 points</li>
                <li><strong>Leaderboard:</strong> Top 100 scores saved on blockchain</li>
                <li><strong>NFT:</strong> You need to own the NFT to submit scores</li>
              </ul>
            </div>
          )}
        </div>
        
        <div className="modal-footer">
          <button onClick={onClose} className="btn btn-primary">
            Got it!
          </button>
        </div>
      </div>
    </div>
  );
};

export default HelpModal;
