// src/components/Board.jsx
import '../styles/board.css';

const Board = ({ 
  board, 
  selectedCell, 
  setSelectedCell, 
  cellStatus,
  isCountdownActive = false 
}) => {
  return (
    <div className={`board-container ${isCountdownActive ? 'countdown-active' : ''}`}>
      <div className="board">
        {board.map((row, i) => 
          row.map((cell, j) => {
            const cellKey = `${i}-${j}`;
            const status = cellStatus?.[cellKey];
            
            const classes = [
              'grid-cell',
              selectedCell?.[0] === i && selectedCell?.[1] === j ? 'selected' : '',
              cell !== 0 ? 'fixed' : '',
              j === 2 || j === 5 ? 'border-right' : '',
              i === 2 || i === 5 ? 'border-bottom' : '',
              status === 'correct' ? 'correct' : '',
              status === 'wrong' ? 'wrong' : ''
            ].filter(Boolean).join(' ');

            return (
              <div
                key={`${i}-${j}`}
                className={classes}
                onClick={() => cell === 0 && setSelectedCell([i, j])}
              >
                {cell !== 0 ? cell : ''}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default Board;