import React, { useEffect, useRef } from 'react';
import AppLogic from './AppLogic';

function Football() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    // Rest of your logic
    const app = new AppLogic(canvas, ctx);
    app.init();

    return () => {
      app.cleanup();
      // Cleanup event listeners or intervals if needed
      window.removeEventListener('resize', app.resizeCanvas);
      clearInterval(app.enemySpawnInterval);
    };
  }, []);

  return (
    <canvas id="gameCanvas" ref={canvasRef} style={{ display: 'block' }}></canvas>
  );
};
export default Football;
