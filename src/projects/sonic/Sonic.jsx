import React, { useEffect, useRef } from 'react';
import GameLogic from './GameLogic';

function Sonic() {
    const gameCanvasRef = useRef(null);

    useEffect(() => {
        const canvas = gameCanvasRef.current;

        if (canvas) {
            GameLogic(canvas);
        }
    }, []);

    return (
        <canvas id="gameCanvas" ref={gameCanvasRef} style={{ display: 'block' }}></canvas>
    );
};

export default Sonic;


