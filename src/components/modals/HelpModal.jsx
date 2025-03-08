// src/components/modals/HelpModal.jsx
import { useState } from 'react';
import '../../styles/modal.css';
import '../../styles/help-modal.css';

const HelpModal = ({ show, onClose }) => {
  const [activeTab, setActiveTab] = useState('rules');

  if (!show) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content help-modal help-modal-720p">
        <div className="help-header">
          <h2 className="modal-title">Game FAQ</h2>
          <button 
            onClick={onClose}
            className="close-button"
            aria-label="Close"
          >
            ×
          </button>
        </div>
        
        <div className="help-tabs">
          <button 
            className={`tab-button ${activeTab === 'rules' ? 'active' : ''}`}
            onClick={() => setActiveTab('rules')}
          >
            Rules
          </button>
          <button 
            className={`tab-button ${activeTab === 'controls' ? 'active' : ''}`}
            onClick={() => setActiveTab('controls')}
          >
            Controls
          </button>
          <button 
            className={`tab-button ${activeTab === 'scoring' ? 'active' : ''}`}
            onClick={() => setActiveTab('scoring')}
          >
            Scoring
          </button>
          <button 
            className={`tab-button ${activeTab === 'nft' ? 'active' : ''}`}
            onClick={() => setActiveTab('nft')}
          >
            NFT
          </button>
        </div>
        
        <div className="tab-content">
          {activeTab === 'rules' && (
            <div className="rules-tab">
              <h3>Sudoku Rules</h3>
              <div className="compact-grid">
                <div className="rule-item">
                  <div className="rule-icon">🎮</div>
                  <div className="rule-text">
                    <p>Complete the 9×9 grid with digits.</p>
                  </div>
                </div>
                
                <div className="rule-item">
                  <div className="rule-icon">↔️</div>
                  <div className="rule-text">
                    <p>Each row must contain digits 1-9 without repetition.</p>
                  </div>
                </div>
                
                <div className="rule-item">
                  <div className="rule-icon">↕️</div>
                  <div className="rule-text">
                    <p>Each column must contain digits 1-9 without repetition.</p>
                  </div>
                </div>
                
                <div className="rule-item">
                  <div className="rule-icon">🔲</div>
                  <div className="rule-text">
                    <p>Each 3×3 box must contain digits 1-9 without repetition.</p>
                  </div>
                </div>
                
                <div className="rule-item">
                  <div className="rule-icon">⏱️</div>
                  <div className="rule-text">
                    <p>Solve as quickly as possible with minimal mistakes.</p>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {activeTab === 'controls' && (
            <div className="controls-tab">
              <h3>How to Play</h3>
              
              <div className="compact-grid">
                <div className="control-item">
                  <div className="control-icon">👆</div>
                  <div className="control-text">
                    <p><strong>Select a Cell:</strong> Click on any empty cell to select it.</p>
                  </div>
                </div>
                
                <div className="control-item">
                  <div className="control-icon">🔢</div>
                  <div className="control-text">
                    <p><strong>Enter a Number:</strong> Click a number on the numpad or press 1-9 key.</p>
                  </div>
                </div>
                
                <div className="control-item">
                  <div className="control-icon">❌</div>
                  <div className="control-text">
                    <p><strong>Clear a Cell:</strong> Click "Clear" or press Backspace/Delete.</p>
                  </div>
                </div>
                
                <div className="control-item">
                  <div className="control-icon">🚫</div>
                  <div className="control-text">
                    <p><strong>Mistakes Limit:</strong> Max 10 mistakes before game ends.</p>
                  </div>
                </div>
                
                <div className="control-item">
                  <div className="control-icon">🔄</div>
                  <div className="control-text">
                    <p><strong>New Game:</strong> Start a new game with the "New Game" button.</p>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {activeTab === 'scoring' && (
            <div className="scoring-tab">
              <h3>Scoring System</h3>
              
              <div className="scoring-formula">
                <div className="formula-box">
                  <span className="formula">Points = (7200 - Time) - (Mistakes × 100)</span>
                </div>
              </div>
              
              <div className="compact-grid">
                <div className="scoring-item">
                  <div className="scoring-icon">⏱️</div>
                  <div className="scoring-text">
                    <p><strong>Time Factor:</strong> Max 7200 seconds (2 hours). Faster = higher score.</p>
                  </div>
                </div>
                
                <div className="scoring-item">
                  <div className="scoring-icon">❌</div>
                  <div className="scoring-text">
                    <p><strong>Mistakes Penalty:</strong> Each mistake reduces score by 100 points.</p>
                  </div>
                </div>
                
                <div className="scoring-item">
                  <div className="scoring-icon">🏆</div>
                  <div className="scoring-text">
                    <p><strong>Leaderboard:</strong> Top 100 scores per season on blockchain.</p>
                  </div>
                </div>
                
                <div className="scoring-item">
                  <div className="scoring-icon">⚙️</div>
                  <div className="scoring-text">
                    <p><strong>Verification:</strong> All scores are cryptographically verified.</p>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {activeTab === 'nft' && (
            <div className="nft-tab">
              <h3>NFT Integration</h3>
              
              <div className="compact-grid">
                <div className="nft-item">
                  <div className="nft-icon">🎮</div>
                  <div className="nft-text">
                    <p><strong>NFT Access:</strong> Own a Crypto Sudoku NFT to play and submit scores.</p>
                  </div>
                </div>
                
                <div className="nft-item">
                  <div className="nft-icon">🏆</div>
                  <div className="nft-text">
                    <p><strong>Seasonal Rewards:</strong> Compete for seasonal prizes.</p>
                  </div>
                </div>
                
                <div className="nft-item">
                  <div className="nft-icon">🌐</div>
                  <div className="nft-text">
                    <p><strong>Multi-chain:</strong> Available on Mint Sepolia and Monad Testnet.</p>
                  </div>
                </div>
                
                <div className="nft-item">
                  <div className="nft-icon">💫</div>
                  <div className="nft-text">
                    <p><strong>Limited Supply:</strong> Unique NFTs with permanent game access.</p>
                  </div>
                </div>
              </div>
              
              <div className="mint-info-compact">
                <a href="https://mint.cryptosudoku.xyz" target="_blank" rel="noopener noreferrer">Mint your NFT here</a>
              </div>
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
