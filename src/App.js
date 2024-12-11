import React, { useState } from "react";
import Game from "./Game";
import "./App.css";

const App = () => {
  const [showStartScreen, setShowStartScreen] = useState(true);

  const startGame = () => {
    setShowStartScreen(false);
  };

  return (
    <div className="app-container">
      {showStartScreen ? (
        <div className="start-screen">
          <h1 className="game-title">Space Invader</h1>
          <p className="instructions">Utilisez les flèches pour déplacer votre vaisseau et la barre d'espace pour tirer. Évitez les obstacles et tirez pour gagner des points !</p>
          <button className="start-button" onClick={startGame}>
            Commencer le Jeu
          </button>
        </div>
      ) : (
        <Game />
      )}
    </div>
  );
};

export default App;
