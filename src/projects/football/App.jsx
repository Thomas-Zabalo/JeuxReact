import React, { useEffect, useRef } from 'react';
import GameLogic from './GameLogic';

function App() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    // Rest of your logic
    const app = new GameLogic(canvas, ctx);
    app.init();

    return () => {
      // Cleanup event listeners or intervals if needed
      window.removeEventListener('resize', app.resizeCanvas);
      clearInterval(app.enemySpawnInterval);
    };
  }, []);

  return (
    <canvas id="gameCanvas" ref={canvasRef} style={{ display: 'block' }}></canvas>
  );
};
export default App;
