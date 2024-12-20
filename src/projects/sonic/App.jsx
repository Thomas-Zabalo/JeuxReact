import React, { useEffect, useRef } from 'react';
import GameLogic from './GameLogic';

function App() {
    const gameCanvasRef = useRef(null);

    useEffect(() => {
        const canvas = gameCanvasRef.current;

        if (canvas) {
            GameLogic(canvas);
        }
    }, []);

    return (
        <canvas
            id="gameCanvas"
            ref={gameCanvasRef}
            style={{ display: 'block', width: '100vw', height: '100vh' }}
        />
    );
};

export default App;
