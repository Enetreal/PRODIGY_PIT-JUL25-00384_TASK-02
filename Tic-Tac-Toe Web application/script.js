document.addEventListener('DOMContentLoaded', () => {
  const cellElements = document.querySelectorAll('[data-cell]');
  const board = document.getElementById('board');
  const messageText = document.getElementById('messageText');
  const winningMessage = document.getElementById('winningMessage');
  const restartButton = document.getElementById('restartButton');
  const modeSelector = document.getElementsByName('mode');

  const xScoreEl = document.getElementById('x-score');
  const oScoreEl = document.getElementById('o-score');
  const drawScoreEl = document.getElementById('draw-score');

  const clickSound = document.getElementById('click-sound');
  const winSound = document.getElementById('win-sound');
  const drawSound = document.getElementById('draw-sound');

  const X_CLASS = 'x';
  const O_CLASS = 'o';
  let circleTurn = false;
  let vsAI = false;
  let scores = { x: 0, o: 0, draw: 0 };

  const WINNING_COMBINATIONS = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];

  startGame();

  [...modeSelector].forEach(radio => {
    radio.addEventListener('change', () => {
      vsAI = getSelectedMode() === 'ai';
      startGame();
    });
  });

  restartButton.addEventListener('click', startGame);

  function startGame() {
    circleTurn = false;
    winningMessage.classList.remove('show');
    cellElements.forEach(cell => {
      cell.classList.remove(X_CLASS, O_CLASS);
      cell.removeEventListener('click', handleClick);
      cell.addEventListener('click', handleClick, { once: true });
    });
    vsAI = getSelectedMode() === 'ai';
    setBoardHover();
  }

  function handleClick(e) {
    const cell = e.target;
    const currentClass = circleTurn ? O_CLASS : X_CLASS;
    placeMark(cell, currentClass);
    clickSound.play();

    if (checkWin(currentClass)) {
      endGame(false);
    } else if (isDraw()) {
      endGame(true);
    } else {
      circleTurn = !circleTurn;
      setBoardHover();

      if (vsAI && circleTurn) {
        setTimeout(() => {
          const bestMove = getBestMove();
          placeMark(bestMove, O_CLASS);
          clickSound.play();
          if (checkWin(O_CLASS)) {
            endGame(false);
          } else if (isDraw()) {
            endGame(true);
          } else {
            circleTurn = false;
            setBoardHover();
          }
        }, 500);
      }
    }
  }

  function placeMark(cell, className) {
    cell.classList.add(className);
  }

  function setBoardHover() {
    board.classList.remove(X_CLASS, O_CLASS);
    board.classList.add(circleTurn ? O_CLASS : X_CLASS);
  }

  function checkWin(currentClass) {
    return WINNING_COMBINATIONS.some(combination =>
      combination.every(index =>
        cellElements[index].classList.contains(currentClass)
      )
    );
  }

  function isDraw() {
    return [...cellElements].every(cell =>
      cell.classList.contains(X_CLASS) || cell.classList.contains(O_CLASS)
    );
  }

  function endGame(draw) {
    if (draw) {
      messageText.innerText = 'Draw!';
      drawSound.play();
      scores.draw++;
      drawScoreEl.innerText = scores.draw;
    } else {
      const winner = circleTurn ? O_CLASS : X_CLASS;
      messageText.innerText = `${winner.toUpperCase()}'s Wins!`;
      winSound.play();
      if (winner === X_CLASS) {
        scores.x++;
        xScoreEl.innerText = scores.x;
      } else {
        scores.o++;
        oScoreEl.innerText = scores.o;
      }
    }
    winningMessage.classList.add('show');
  }

  function getSelectedMode() {
    return [...modeSelector].find(r => r.checked).value;
  }

  function getBestMove() {
    const boardState = [...cellElements].map(cell => {
      if (cell.classList.contains(X_CLASS)) return X_CLASS;
      if (cell.classList.contains(O_CLASS)) return O_CLASS;
      return '';
    });

    const best = minimax(boardState, O_CLASS);
    return cellElements[best.index];
  }

  function minimax(newBoard, player) {
    const availSpots = newBoard.map((val, i) => val === '' ? i : null).filter(i => i !== null);

    if (checkMiniWin(newBoard, X_CLASS)) return { score: -10 };
    if (checkMiniWin(newBoard, O_CLASS)) return { score: 10 };
    if (availSpots.length === 0) return { score: 0 };

    const moves = [];

    for (let i = 0; i < availSpots.length; i++) {
      const index = availSpots[i];
      const backup = newBoard[index];
      newBoard[index] = player;

      const result = minimax(newBoard, player === O_CLASS ? X_CLASS : O_CLASS);
      moves.push({ index, score: result.score });

      newBoard[index] = backup;
    }

    let bestMove;
    if (player === O_CLASS) {
      let bestScore = -Infinity;
      moves.forEach((move, i) => {
        if (move.score > bestScore) {
          bestScore = move.score;
          bestMove = i;
        }
      });
    } else {
      let bestScore = Infinity;
      moves.forEach((move, i) => {
        if (move.score < bestScore) {
          bestScore = move.score;
          bestMove = i;
        }
      });
    }

    return moves[bestMove];
  }

  function checkMiniWin(board, player) {
    return WINNING_COMBINATIONS.some(combo =>
      combo.every(index => board[index] === player)
    );
  }
});
