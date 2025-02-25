// src/components/modals/HelpModal.jsx
import '../../styles/modal.css';

const HelpModal = ({ show, onClose }) => {
  if (!show) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2 className="modal-title">How to Play</h2>
        
        <div className="modal-body">
          <div className="help-section">
            <h3>Rules</h3>
            <ul>
              <li>Fill the grid with numbers 1-9</li>
              <li>Each row must contain numbers 1-9</li>
              <li>Each column must contain numbers 1-9</li>
              <li>Each 3x3 box must contain numbers 1-9</li>
            </ul>
          </div>
          
          <div className="help-section">
            <h3>Controls</h3>
            <ul>
              <li>Click a cell to select it</li>
              <li>Use number pad or keyboard to enter numbers</li>
              <li>Use backspace or clear button to remove numbers</li>
              <li>You have 3 chances to make mistakes</li>
            </ul>
          </div>
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