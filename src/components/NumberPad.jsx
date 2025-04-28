// src/components/NumberPad.jsx
import '../styles/number-pad.css';

const NumberPad = ({ onNumberClick }) => {
  return (
    <div className="number-pad">
      {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
        <button
          key={num}
          className="num-btn"
          onClick={() => onNumberClick(num)}
        >
          {num}
        </button>
      ))}
      <button
        className="num-btn clear-btn"
        onClick={() => onNumberClick(0)}
      >
        Clear
      </button>
    </div>
  );
};

export default NumberPad;
