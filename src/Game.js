import React, { useState, useEffect, useRef } from "react";
import "./Game.css";
import { v4 as uuidv4 } from 'uuid';

const Game = () => {
  const [playerPosition, setPlayerPosition] = useState(250); // Position du vaisseau
  const [projectiles, setProjectiles] = useState([]); // Liste des projectiles
  const [obstacles, setObstacles] = useState([]); // Liste des obstacles
  const [score, setScore] = useState(0); // Score du joueur
  const gameContainerRef = useRef(null); // Référence pour capturer le focus

  // Gérer le mouvement du joueur et le tir
  const handleKeyDown = (e) => {
    if (e.key === "ArrowLeft" && playerPosition > 0) {
      setPlayerPosition((prev) => prev - 20);
    } else if (e.key === "ArrowRight" && playerPosition < 470) {
      setPlayerPosition((prev) => prev + 20);
    } else if (e.key === " ") {
      shootProjectile();
    }
  };

  useEffect(() => {
    // Ajouter un écouteur d'événements pour capturer les touches du clavier
    const container = gameContainerRef.current;
    container.focus(); // S'assurer que le conteneur a le focus pour capter les touches
    container.addEventListener("keydown", handleKeyDown);
    return () => container.removeEventListener("keydown", handleKeyDown);
  }, [playerPosition]);

  // Ajouter un projectile
  const shootProjectile = () => {
    const newProjectile = { id: uuidv4(), x: playerPosition + 15, y: 450 };
    setProjectiles((prev) => [...prev, newProjectile]); // Ajoute uniquement lors du tir
  };

  // Déplacer les projectiles
  useEffect(() => {
    const interval = setInterval(() => {
      setProjectiles((prev) =>
        prev.map((p) => ({ ...p, y: p.y - 10 })).filter((p) => p.y > 0) // Supprimer les projectiles hors écran
      );
    }, 50);
    return () => clearInterval(interval);
  }, []);

  // Ajouter des obstacles avec un ID unique
  useEffect(() => {
    const interval = setInterval(() => {
      const randomX = Math.floor(Math.random() * 480);
      setObstacles((prev) => {
        // Vérifier qu'aucun obstacle ne précède de manière incorrecte
        const isDuplicate = prev.some((o) => o.x === randomX && o.y === 0);
        if (isDuplicate) {
          return prev; // Ignore si un obstacle à cette position existe déjà
        }
        return [...prev, { id: uuidv4(), x: randomX, y: 0 }];
      });
    }, 1000); // Intervalle d'apparition
    return () => clearInterval(interval);
  }, []);

  // Déplacer les obstacles
  useEffect(() => {
    const interval = setInterval(() => {
      setObstacles((prev) =>
        prev.map((o) => ({ ...o, y: o.y + 10 })).filter((o) => o.y < 500) // Supprime les obstacles hors écran
      );
    }, 100);
    return () => clearInterval(interval);
  }, []);

  // Gérer les collisions entre projectiles et obstacles
  useEffect(() => {
    const updatedObstacles = obstacles.filter((obstacle) => {
      const hit = projectiles.some(
        (p) =>
          p.x >= obstacle.x &&
          p.x <= obstacle.x + 20 &&
          p.y >= obstacle.y &&
          p.y <= obstacle.y + 20
      );

      if (hit) {
        const explosion = document.createElement("div");
        explosion.className = "explosion";
        explosion.style.left = `${obstacle.x}px`;
        explosion.style.top = `${obstacle.y}px`;
        document.querySelector(".game-container").appendChild(explosion);

        setTimeout(() => explosion.remove(), 300);
        setScore((prev) => prev + 1);
      }

      return !hit; // Garder uniquement les obstacles non touchés
    });

    setObstacles(updatedObstacles);

    // Supprimer les projectiles ayant touché un obstacle
    const remainingProjectiles = projectiles.filter((p) =>
      !obstacles.some(
        (o) =>
          p.x >= o.x &&
          p.x <= o.x + 20 &&
          p.y >= o.y &&
          p.y <= o.y + 20
      )
    );
    setProjectiles(remainingProjectiles);
  }, [obstacles, projectiles]);

  // Gérer les collisions entre obstacles et le joueur
  useEffect(() => {
    const collision = obstacles.some(
      (o) =>
        o.x < playerPosition + 30 && // Bord gauche du joueur
        o.x + 20 > playerPosition && // Bord droit du joueur
        o.y >= 450 && // Bord supérieur du joueur
        o.y <= 480 // Bord inférieur du joueur
    );
    if (collision) {
      alert("Game Over! Votre score : " + score);
      window.location.reload();
    }
  }, [obstacles, playerPosition]);

  return (
    <div
      className="game-container"
      tabIndex={0}
      ref={gameContainerRef}
    >
      <div className="player" style={{ left: playerPosition }}></div>
      {projectiles.map((p) => (
        <div
          key={p.id}
          className="projectile"
          style={{
            left: `${p.x}px`,
            top: `${p.y}px`,
          }}
        ></div>
      ))}

      {obstacles.map((o) => (
        <div
          key={o.id}
          className="obstacle"
          style={{ left: o.x, top: o.y }}
        ></div>
      ))}
      <div className="score">Score: {score}</div>
    </div>
  );
};

export default Game;
