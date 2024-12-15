import React from 'react';

function UI({ points, bestScore, gameOver, startGame, resetGame, setStartGame }) {
  return (
    <div className="absolute m-0 text-white top-3 left-3">
      {gameOver && <h1>Game Over! Press R to reset</h1>}
      {!startGame && !gameOver && <h1>Press Enter to Start</h1>}
      <h1>Points: {points}</h1>
      <h1>Best Score: {bestScore}</h1>
    </div>
  );
}

export default UI;
