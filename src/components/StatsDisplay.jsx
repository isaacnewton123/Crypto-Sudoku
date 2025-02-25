// StatsDisplay.jsx
import PropTypes from 'prop-types';
import '../styles/stats.css';

const StatsDisplay = ({ timer, mistakes, maxMistakes = 10 }) => {
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="stats">
      <div className="stat-item">
        <span className="stat-label">Time:</span>
        <span className="stat-value">{formatTime(timer)}</span>
      </div>
      <div className="stat-item">
        <span className="stat-label">Mistakes:</span>
        <span className="stat-value">{mistakes}</span>
        <span className="stat-max">/{maxMistakes}</span>
      </div>
    </div>
  );
};

StatsDisplay.propTypes = {
  timer: PropTypes.number.isRequired,
  mistakes: PropTypes.number.isRequired,
  maxMistakes: PropTypes.number
};

export default StatsDisplay;