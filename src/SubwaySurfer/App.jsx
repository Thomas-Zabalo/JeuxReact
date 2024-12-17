import React, { useEffect, useRef, useState } from 'react';
import './App.css';
import * as THREE from 'three';
import * as CANNON from 'cannon-es';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import CannonDebugger from 'cannon-es-debugger';


function App() {
  const [points, setPoints] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [startGame, setStartGame] = useState(false);
  const [bestScore, setBestScore] = useState(0);
  const pointsRef = useRef(0);
  const requestRef = useRef();
  const rendererRef = useRef();
  const worldRef = useRef();
  const cameraRef = useRef();
  const sceneRef = useRef();
  const playerBodyRef = useRef();
  const playerRef = useRef();
  const pointBodiesRef = useRef([]);
  const pointMeshesRef = useRef([]);
  const enemyBodiesRef = useRef([]);
  const enemyMeshesRef = useRef([]);
  const clockRef = useRef(new THREE.Clock());


  useEffect(() => {

    // --- Chargement du meilleur score depuis le localStorage ---
    const storedBestScore = localStorage.getItem('bestScore');
    if (storedBestScore) {
      setBestScore(parseInt(storedBestScore));
    } else {
      localStorage.setItem('bestScore', 0);
    }

    // --- Setup Three.js Scene and Cannon.js World ---
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // Fog: Pink fog with a light effect
    scene.fog = new THREE.Fog(0xffffff, 1, 150); // Light pink fog with near/far distances

    const world = new CANNON.World({
      gravity: new CANNON.Vec3(0, -9.82, 0)
    });
    worldRef.current = world;

    const cannonDebugger = new CannonDebugger(scene, world, {
      color: 0xff0000, // Optional: Color for the wireframes
    });

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x222222);
    document.body.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.set(0, 1.5, 5);
    cameraRef.current = camera;

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enabled = false; // Disable manual orbiting in final gameplay

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.5);
    scene.add(ambientLight);

    // --- Player Setup ---
    const player = new THREE.Mesh(
      new THREE.BoxGeometry(0.5, 0.5, 0.5),
      new THREE.MeshStandardMaterial({ color: 0xff0000 })
    )
    player.position.y = -1;
    scene.add(player);
    playerRef.current = player;


    const playerBody = new CANNON.Body({
      mass: 1,
      shape: new CANNON.Box(new CANNON.Vec3(0.25, 0.25, 0.25)),
      fixedRotation: true,
      position: new CANNON.Vec3(0, 1, 0),
      material: new CANNON.Material({ friction: 0.0, restitution: 0 })
    });
    world.addBody(playerBody);
    playerBodyRef.current = playerBody;

    // Give the player body some linear damping so it doesn't slide forever
    playerBody.linearDamping = 0.1;

    // --- Ground Setup ---
    const groundShape = new CANNON.Box(new CANNON.Vec3(2, 0.1, 2000));
    const groundBody = new CANNON.Body({ mass: 0, shape: groundShape });
    groundBody.position.set(0, 0, -1000);
    world.addBody(groundBody);

    // Ground Material with a shiny effect
    const groundMesh = new THREE.Mesh(
      new THREE.BoxGeometry(4, 0.2, 4000),
      new THREE.MeshStandardMaterial({
        color: 0xbee6fe,
        roughness: 0.1, // Low roughness for more shine
        metalness: 0.7, // Higher metalness for a shiny, reflective surface
      })
    );
    groundMesh.position.set(0, 0, -1000);
    scene.add(groundMesh);

    // --- Spawning Points ---
    function spawnPoint() {
      const lanes = [-1, 0, 1];
      const randomLane = lanes[Math.floor(Math.random() * lanes.length)];
      const spawnZ = playerBody.position.z - 30; // spawn far ahead

      const pointShape = new CANNON.Sphere(0.2); // Shape remains a sphere
      const pointBody = new CANNON.Body({ mass: 0, shape: pointShape });
      pointBody.position.set(randomLane, 0.6, spawnZ);

      world.addBody(pointBody);
      pointBodiesRef.current.push(pointBody);

      // Charger le modèle GLTF
      const loader = new GLTFLoader();
      loader.load(
        '/models/coin.glb', // Remplacez par le chemin de votre modèle
        (gltf) => {
          const pointMesh = gltf.scene;
          pointMesh.scale.set(0.05, 0.05, 0.05); // Échelle du modèle, ajustez selon le modèle
          pointMesh.position.copy(pointBody.position);
          scene.add(pointMesh);
          pointMeshesRef.current.push(pointMesh);
        },
        undefined, // Optionnel : fonction de suivi du chargement
        (error) => {
          console.error('Erreur lors du chargement du modèle GLTF:', error);
        }
      );
    }


    // --- Ennemis ---
    function spawnEnemy() {
      const lanes = [-1, 0, 1];
      const randomLane = lanes[Math.floor(Math.random() * lanes.length)];
      const spawnZ = playerBody.position.z - 30;
      const enemyShape = new CANNON.Sphere(0.4);
      const enemyBody = new CANNON.Body({ mass: 0, shape: enemyShape });
      enemyBody.position.set(randomLane, 0.6, spawnZ);
      world.addBody(enemyBody);
      enemyBodiesRef.current.push(enemyBody);

      const enemyGeometry = new THREE.SphereGeometry(0.4, 16, 16);
      const enemyMat = new THREE.MeshStandardMaterial({ color: 0xff0000 });
      const enemyMesh = new THREE.Mesh(enemyGeometry, enemyMat);
      enemyMesh.position.copy(enemyBody.position);
      scene.add(enemyMesh);
      enemyMeshesRef.current.push(enemyMesh);
    }

    let pointSpawnTimer = 0;
    let enemySpawnTimer = 0;

    // --- Input Handling ---
    let currentLane = 0;
    let jumpCooldown = false;

    const resetGame = () => {
      playerBody.position.set(0, 1, 0);
      playerBody.velocity.set(0, 0, 0);
      setPoints(0);
      setGameOver(false);
      setStartGame(false);

      // Remove points from scene and world
      pointBodiesRef.current.forEach((pb) => world.removeBody(pb));
      pointMeshesRef.current.forEach((pm) => scene.remove(pm));
      pointBodiesRef.current = [];
      pointMeshesRef.current = [];
    };

    function handleKeyDown(e) {
      // Always allow R to reset even if game over
      if (e.key.toLowerCase() === "r") {
        resetGame();
        return;
      }

      if (!startGame && e.key === "Enter") {
        setStartGame(true);
      }

      if (gameOver) return;

      // Left/Right movement
      if (e.key === "ArrowLeft" || e.key.toLowerCase() === "q") {
        currentLane = Math.max(currentLane - 1, -1);
        playerBody.position.x = currentLane;
      }
      if (e.key === "ArrowRight" || e.key.toLowerCase() === "d") {
        currentLane = Math.min(currentLane + 1, 1);
        playerBody.position.x = currentLane;
      }

      // Jump (reduced impulse for a lower jump)
      if (e.key === " " && !jumpCooldown && Math.abs(playerBody.velocity.y) < 0.1) {
        playerBody.applyImpulse(new CANNON.Vec3(0, 5, 0), playerBody.position);
      }
    }

    window.addEventListener("keydown", handleKeyDown);

    // --- Resize Handling ---
    window.addEventListener("resize", () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    });


    // --- Game Over Check ---
    // --- Vérifier la fin de jeu ---
    function checkGameOver() {

      if (
        playerBody.position.y < -2 ||
        playerBody.position.x < -1.5 ||
        playerBody.position.x > 1.5
      ) {
        setGameOver(true);
        setStartGame(false);

        // Update best score
        if (pointsRef.current > bestScore) {
          setBestScore(pointsRef.current);
          localStorage.setItem("bestScore", pointsRef.current);
        }
      }

      // Collision avec les ennemis
      enemyBodiesRef.current.forEach((enemyBody) => {
        const dist = playerBody.position.vsub(enemyBody.position).length();
        if (dist < 0.5) {
          setGameOver(true);
          setStartGame(false);
          // Update best score
          if (pointsRef.current > bestScore) {
            setBestScore(pointsRef.current);
            localStorage.setItem("bestScore", pointsRef.current);
          }
        }
      });
    }

    // --- Animation Loop ---
    function animate() {
      requestRef.current = requestAnimationFrame(animate);
      const delta = clockRef.current.getDelta();

      if (startGame && !gameOver) {
        // Définir une vitesse de base
        const baseSpeed = 10;

        // Multiplier la vitesse en fonction des points du joueur
        const speedIncreasePerPoint = 0.2;
        const speed = baseSpeed + pointsRef.current * speedIncreasePerPoint;

        // Appliquer la nouvelle vitesse
        playerBody.position.z -= speed * delta;

        // Ajuster l'intervalle de spawn en fonction des points
        const minSpawnInterval = 0.2; // L'intervalle minimum entre les spawns (plus petit = plus fréquent)
        const maxSpawnInterval = 0.5; // L'intervalle de spawn de base
        const spawnInterval = maxSpawnInterval - (pointsRef.current * 0.01); // Réduit l'intervalle en fonction des points

        // Assurez-vous que l'intervalle de spawn ne soit pas trop court (vous pouvez ajuster ce seuil)
        const spawnIntervalAdjusted = Math.max(minSpawnInterval, spawnInterval);

        // Spawn des points à intervalles ajustés
        pointSpawnTimer += delta;
        if (pointSpawnTimer > spawnIntervalAdjusted) {
          spawnPoint();
          pointSpawnTimer = 0;
        }

        // Spawn des ennemis à intervalles ajustés
        const enemySpawnIntervalAdjusted = spawnIntervalAdjusted * 1.5; // Les ennemis apparaissent plus lentement que les points
        enemySpawnTimer += delta;
        if (enemySpawnTimer > enemySpawnIntervalAdjusted) {
          spawnEnemy();
          enemySpawnTimer = 0;
        }

        // Mise à jour de la physique
        world.fixedStep();

        // Mise à jour du mesh du joueur
        player.position.copy(playerBody.position);
        player.quaternion.copy(playerBody.quaternion);

        // Mise à jour de la caméra
        camera.position.x = player.position.x;
        camera.position.y = player.position.y + 1.5;
        camera.position.z = player.position.z + 5;
        camera.lookAt(player.position.x, player.position.y, player.position.z);

        // Vérification des collisions avec les points
        for (let i = 0; i < pointBodiesRef.current.length; i++) {
          const pBody = pointBodiesRef.current[i];
          const pMesh = pointMeshesRef.current[i];
          const dist = playerBody.position.vsub(pBody.position).length();
          if (dist < 0.5) {
            // Collecte de points
            setPoints((prev) => {
              const newPoints = prev + 1;
              pointsRef.current = newPoints; // Synchroniser le ref avec les points actuels
              return newPoints;
            });
            // Retirer le point du monde et de la scène
            world.removeBody(pBody);
            scene.remove(pMesh);
            pointBodiesRef.current.splice(i, 1);
            pointMeshesRef.current.splice(i, 1);
            i--;
          }
        }

        // Vérification de la fin de la partie
        checkGameOver();
      }

      cannonDebugger.update();
      renderer.render(scene, camera);
    }


    animate();

    // Cleanup on unmount
    return () => {
      cancelAnimationFrame(requestRef.current);
      document.body.removeChild(renderer.domElement);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [gameOver, startGame]);

  return (
    <div className="absolute m-0 text-white top-3 left-3">
      {gameOver && <h1>Game Over! Press R to reset</h1>}
      {!startGame && !gameOver && <h1>Press Enter to Start</h1>}
      <h1>Points: {points}</h1>
      <h1>Best Score: {bestScore}</h1>
    </div>
  );
}

export default App;


// New app


// import React from 'react';
// import './App.css';
// import GameUI from './components/GameUI';
// import { useGameState } from './utils/useGameState';
// import GameLogic from './components/GameLogic';

// function App() {
//   const { points, bestScore, gameOver, startGame, resetGame, setStartGame } = useGameState();

//   return (
//     <div className="App">
//       <GameUI 
//         points={points} 
//         bestScore={bestScore} 
//         gameOver={gameOver} 
//         startGame={startGame} 
//         resetGame={resetGame} 
//         setStartGame={setStartGame} 
//       />
//       <GameLogic 
//         points={points} 
//         setStartGame={setStartGame} 
//         gameOver={gameOver} 
//         resetGame={resetGame} 
//       />
//     </div>
//   );
// }

// export default App;
