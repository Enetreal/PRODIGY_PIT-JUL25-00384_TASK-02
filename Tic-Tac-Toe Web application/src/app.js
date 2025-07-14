import React, { useState, useEffect } from 'react';
import './App.css';

const initialBoard = Array(9).fill(null);

function App() {
  const [board, setBoard] = useState(initialBoard);
  const [isPlayerTurn, setIsPlayerTurn] = useState(true);
  const [winner, setWinner] = useState(null);

  const winningCombinations = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  const checkWinner = (currentBoard) => {
    for (let combo of winningCombinations) {
      const [a, b, c] = combo;
      if (currentBoard[a] && currentBoard[a] === currentBoard[b] && currentBoard[b] === currentBoard[c]) {
        return currentBoard[a];
      }
    }
    if (!currentBoard.includes(null)) return 'Draw';
    return null;
  };

  const handleClick = (index) => {
    if (!isPlayerTurn || board[index] || winner) return;

    const newBoard = [...board];
    newBoard[index] = 'X';
    setBoard(newBoard);
    setIsPlayerTurn(false);
  };

  const aiMove = () => {
    const emptyIndices = board.map((val, idx) => val === null ? idx : null).filter(val => val !== null);
    if (emptyIndices.length === 0) return;

    const randomIndex = emptyIndices[Math.floor(Math.random() * emptyIndices.length)];
    const newBoard = [...board];
    newBoard[randomIndex] = 'O';
    setBoard(newBoard);
    setIsPlayerTurn(true);
  };

  useEffect(() => {
    const result = checkWinner(board);
    if (result) {
      setWinner(result);
    } else if (!isPlayerTurn) {
      setTimeout(aiMove, 500); // AI "thinks"
    }
  }, [board, isPlayerTurn]);

  const resetGame = () => {
    setBoard(initialBoard);
    setIsPlayerTurn(true);
    setWinner(null);
  };

  return (
    <div className="container">
      <h1>Tic-Tac-Toe (vs AI)</h1>
      <div className="board">
        {board.map((cell, index) => (
          <div key={index} className="cell" onClick={() => handleClick(index)}>
            {cell}
          </div>
        ))}
      </div>
      {winner && (
        <div className="result">
          <h2>{winner === 'Draw' ? "It's a Draw!" : `${winner} Wins!`}</h2>
          <button onClick={resetGame}>Play Again</button>
        </div>
      )}
    </div>
  );
}

export default App;
