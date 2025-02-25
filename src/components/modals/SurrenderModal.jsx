// src/components/modals/SurrenderModal.jsx
import '../../styles/modal.css';

const SurrenderModal = ({ show, onConfirm, onCancel }) => {
  if (!show) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2 className="modal-title">⚠️ Surrender Confirmation</h2>
        <div className="modal-body">
          <p>Are you sure you want to surrender this game?</p>
          <p>All your progress will be lost.</p>
        </div>
        <div className="modal-footer">
          <button onClick={onConfirm} className="btn btn-danger">
            Yes, Surrender
          </button>
          <button onClick={onCancel} className="btn btn-secondary">
            No, Continue Playing
          </button>
        </div>
      </div>
    </div>
  );
};

export default SurrenderModal;