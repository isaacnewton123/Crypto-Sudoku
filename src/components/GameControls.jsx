// src/components/GameControls.jsx
import '../styles/game-controls.css';

const GameControls = ({ onNewGame, difficulty, setDifficulty }) => {
  return (
    <div className="game-controls">
      <button onClick={onNewGame} className="btn btn-primary">
        New Game
      </button>
      <div className="difficulty-controls">
        {['easy', 'medium', 'hard'].map(level => (
          <button
            key={level}
            onClick={() => setDifficulty(level)}
            className={`btn-difficulty ${difficulty === level ? 'active' : ''}`}
          >
            {level}
          </button>
        ))}
      </div>
    </div>
  );
};

export default GameControls;
