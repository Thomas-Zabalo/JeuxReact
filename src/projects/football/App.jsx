import React, { useEffect } from 'react';

function App() {
    useEffect(() => {
        // Lorsque le composant est monté, on peut initialiser le jeu
        const script = document.createElement('script');
        script.src = './Game.js'
        script.async = true;
        document.body.appendChild(script);

        script.onload = () => {
            console.log("Jeu initialisé !");
        };

        return () => {
            document.body.removeChild(script); 
        };
    }, []);

    return (
        <div>
            <canvas id="gameCanvas" width="800" height="600"></canvas>
        </div>
    );
}

export default App;
