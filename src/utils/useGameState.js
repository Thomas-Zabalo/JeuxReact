import { useState, useEffect } from 'react';

export function useGameState() {
  const [points, setPoints] = useState(0);
  const [bestScore, setBestScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [startGame, setStartGame] = useState(false);

  useEffect(() => {
    const storedBestScore = localStorage.getItem('bestScore');
    if (storedBestScore) {
      setBestScore(parseInt(storedBestScore));
    }
  }, []);

  const resetGame = () => {
    setPoints(0);
    setGameOver(false);
    setStartGame(false);
  };

  useEffect(() => {
    if (points > bestScore) {
      setBestScore(points);
      localStorage.setItem('bestScore', points);
    }
  }, [points, bestScore]);

  return {
    points,
    bestScore,
    gameOver,
    startGame,
    resetGame,
    setStartGame,
  };
}
