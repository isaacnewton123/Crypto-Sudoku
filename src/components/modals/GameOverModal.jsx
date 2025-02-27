// src/components/modals/GameOverModal.jsx
import '../../styles/modal.css';

const GameOverModal = ({ show, onPlayAgain, onClose, isSignatureVerifying }) => {
  if (!show) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2 className="modal-title" style={{ color: '#ef4444', fontSize: '2rem' }}>
          💔 Game Over
        </h2>
        <div className="modal-body">
          <div style={{ fontSize: '3rem', textAlign: 'center', margin: '1rem 0' }}>
            😢
          </div>
          <p style={{ color: '#ef4444', textAlign: 'center', fontSize: '1.2rem' }}>
            Better luck next time!
          </p>
          <p style={{ textAlign: 'center', marginTop: '1rem' }}>
            Would you like to try again?
          </p>
        </div>
        
        <div className="modal-footer">
          <button 
            onClick={onPlayAgain} 
            className="btn btn-primary"
            style={{ background: '#3b82f6' }}
            disabled={isSignatureVerifying}
          >
            {isSignatureVerifying ? 'Please sign...' : 'Try Again'}
          </button>
          <button 
            onClick={onClose} 
            className="btn btn-secondary"
          >
            Exit
          </button>
        </div>
      </div>
    </div>
  );
};

export default GameOverModal;