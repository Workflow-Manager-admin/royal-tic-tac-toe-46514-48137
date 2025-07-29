import React, { useState, useEffect } from 'react';
import './App.css';

/**
 * Unicode icons for royal pieces.
 */
const KING = '♚'; // X
const QUEEN = '♛'; // O

// Board is 3x3 for tic-tac-toe
const BOARD_SIZE = 3;

// PUBLIC_INTERFACE
function App() {
  /**
   * Hook for managing theme (only 'light' per requirements,
   * but structure left for possible theme expansion).
   */
  const [theme] = useState('light');

  /**
   * useEffect for setting CSS theme variable on mount/update.
   */
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  /**
   * Board state: null | 'X' | 'O' for each cell.
   * X always goes first by default!
   */
  const [board, setBoard] = useState(Array(BOARD_SIZE * BOARD_SIZE).fill(null));
  const [xIsNext, setXIsNext] = useState(true);
  const [winner, setWinner] = useState(null); // null | 'X' | 'O' | 'draw'

  /**
   * Derived state: is board full?
   */
  const isBoardFull = board.every(cell => cell);

  /**
   * Calculates winner and updates state.
   */
  useEffect(() => {
    const result = calculateWinner(board);
    if (result) setWinner(result);
    else if (isBoardFull) setWinner('draw');
    else setWinner(null);
  }, [board]);

  /**
   * Handles player move on cell click.
   */
  // PUBLIC_INTERFACE
  function handleCellClick(index) {
    if (board[index] || winner) {
      return;
    }
    const newBoard = board.slice();
    newBoard[index] = xIsNext ? 'X' : 'O';
    setBoard(newBoard);
    setXIsNext(!xIsNext);
  }

  /**
   * Handles reset/replay.
   */
  // PUBLIC_INTERFACE
  function handleReset() {
    setBoard(Array(BOARD_SIZE * BOARD_SIZE).fill(null));
    setXIsNext(true);
    setWinner(null);
  }

  /**
   * Returns the icon for a marker.
   */
  function getPieceIcon(value) {
    if (value === 'X') return (
      <span className="king-piece" title="King">{KING}</span>
    );
    if (value === 'O') return (
      <span className="queen-piece" title="Queen">{QUEEN}</span>
    );
    return '';
  }

  /**
   * Returns the current player as a styled string.
   */
  function currentPlayerIndicator() {
    if (winner === 'draw')
      return <span className="draw-text">It&#39;s a draw!</span>;
    if (winner === 'X')
      return (
        <span className="winner-text">
          <span className="king-piece">{KING}</span> King wins!
        </span>
      );
    if (winner === 'O')
      return (
        <span className="winner-text">
          <span className="queen-piece">{QUEEN}</span> Queen wins!
        </span>
      );
    return (
      <span>
        Next move:&nbsp;
        {xIsNext
          ? <span className="king-piece">{KING}</span>
          : <span className="queen-piece">{QUEEN}</span>
        }
      </span>
    );
  }

  /**
   * Render the full App (board, indicators, reset button).
   */
  return (
    <div className="royal-tic-tac-toe-app">
      <div className="game-container">
        <h1 className="royal-title">
          <span style={{color: 'var(--primary)'}}>Royal</span>{' '}
          <span style={{color: 'var(--accent)'}}>Tic-Tac-Toe</span>
        </h1>
        <div className="indicator">
          {currentPlayerIndicator()}
        </div>
        <div className="board-wrapper">
          <GameBoard
            board={board}
            onCellClick={handleCellClick}
            getPieceIcon={getPieceIcon}
            winner={winner}
          />
        </div>
        <button
          className="reset-btn"
          onClick={handleReset}
        >
          {winner ? "Play Again" : "Reset"}
        </button>
      </div>
      <footer className="footer-note">
        <small>
          X = <span className="king-piece">{KING}</span> King &nbsp;&nbsp; | &nbsp;&nbsp; O = <span className="queen-piece">{QUEEN}</span> Queen
        </small>
      </footer>
    </div>
  );
}

/**
 * Game Board Component (3x3 grid)
 * @param {Object} props - Props for the board.
 * @param {string[]} props.board - Board state.
 * @param {function} props.onCellClick - Handler for cell clicks.
 * @param {function} props.getPieceIcon - Returns JSX for the marker.
 * @param {string|null} props.winner - Current winner state.
 */
function GameBoard({ board, onCellClick, getPieceIcon, winner }) {
  // Calculate board dimension
  const size = Math.sqrt(board.length);

  // Styles for disabling board after game end
  const boardClass = 'game-board' + (winner ? ' disabled' : '');

  return (
    <div className={boardClass}>
      {board.map((cell, idx) => (
        <button
          key={idx}
          className={'cell' + (cell === 'X' ? ' cell-x' : cell === 'O' ? ' cell-o' : '')}
          onClick={() => onCellClick(idx)}
          disabled={!!cell || !!winner}
          aria-label={
            cell
              ? (cell === 'X' ? 'King placed' : 'Queen placed')
              : `Cell ${idx+1} - empty`
          }
        >
          {getPieceIcon(cell)}
        </button>
      ))}
    </div>
  );
}

/**
 * Calculate tic-tac-toe winner.
 *
 * @param {string[]} squares - Board as 1D array.
 * @returns {'X'|'O'|null}
 */
// PUBLIC_INTERFACE
function calculateWinner(squares) {
  const lines = [
    [0,1,2], [3,4,5], [6,7,8], // rows
    [0,3,6], [1,4,7], [2,5,8], // columns
    [0,4,8], [2,4,6]           // diagonals
  ];
  for (let [a,b,c] of lines) {
    if (
      squares[a] &&
      squares[a] === squares[b] &&
      squares[a] === squares[c]
    ) {
      return squares[a];
    }
  }
  return null;
}

export default App;
