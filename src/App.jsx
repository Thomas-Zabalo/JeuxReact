import React, { useEffect, useRef, useState } from 'react';
import './App.css';
import * as THREE from 'three';
import * as CANNON from 'cannon-es';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

function App() {
  const [points, setPoints] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [startGame, setStartGame] = useState(false);
  const [bestScore, setBestScore] = useState(0);
  const requestRef = useRef();
  const rendererRef = useRef();
  const worldRef = useRef();
  const cameraRef = useRef();
  const sceneRef = useRef();
  const playerBodyRef = useRef();
  const playerMeshRef = useRef();
  const pointBodiesRef = useRef([]);
  const pointMeshesRef = useRef([]);
  const clockRef = useRef(new THREE.Clock());

  useEffect(() => {
    // --- Chargement du meilleur score depuis le localStorage ---
    const storedBestScore = localStorage.getItem('bestScore');
    if (storedBestScore) {
      setBestScore(parseInt(storedBestScore)); // Récupérer le meilleur score enregistré
    }

    // --- Setup Three.js Scene and Cannon.js World ---
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // Fog: Pink fog with a light effect
    scene.fog = new THREE.Fog(0xffffff, 1, 150); // Light pink fog with near/far distances

    const world = new CANNON.World({ gravity: new CANNON.Vec3(0, -10, 0) });
    worldRef.current = world;

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
    const playerGeometry = new THREE.BoxGeometry(0.5, 0.5, 0.5);
    const playerMaterial = new THREE.MeshStandardMaterial({ color: 0xff0000 });
    const playerMesh = new THREE.Mesh(playerGeometry, playerMaterial);
    playerMesh.position.y = -1;
    scene.add(playerMesh);
    playerMeshRef.current = playerMesh;

    const playerShape = new CANNON.Box(new CANNON.Vec3(0.25, 0.25, 0.25));
    const playerBody = new CANNON.Body({
      mass: 1,
      shape: playerShape,
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
    const groundGeometry = new THREE.BoxGeometry(4, 0.2, 4000);
    const groundMaterial = new THREE.MeshStandardMaterial({
      color: 0xbee6fe,
      roughness: 0.1, // Low roughness for more shine
      metalness: 0.7, // Higher metalness for a shiny, reflective surface
    });

    const groundMesh = new THREE.Mesh(groundGeometry, groundMaterial);
    groundMesh.position.set(0, 0, -1000);
    scene.add(groundMesh);

    // --- Spawning Points ---
    function spawnPoint() {
      const lanes = [-1, 0, 1];
      const randomLane = lanes[Math.floor(Math.random() * lanes.length)];
      const spawnZ = playerBody.position.z - 30; // spawn far ahead
      const pointShape = new CANNON.Sphere(0.2);
      const pointBody = new CANNON.Body({ mass: 0, shape: pointShape });
      pointBody.position.set(randomLane, 0.6, spawnZ);

      world.addBody(pointBody);
      pointBodiesRef.current.push(pointBody);

      const pointGeometry = new THREE.SphereGeometry(0.2, 16, 16);
      const pointMat = new THREE.MeshStandardMaterial({ color: 0xffff00 });
      const pointMesh = new THREE.Mesh(pointGeometry, pointMat);
      pointMesh.position.copy(pointBody.position);
      scene.add(pointMesh);
      pointMeshesRef.current.push(pointMesh);
    }

    let pointSpawnTimer = 0;
    const pointSpawnInterval = 0.5; // seconds

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
        playerBody.applyImpulse(new CANNON.Vec3(0, 10, 0), playerBody.position);
        jumpCooldown = true;
        setTimeout(() => {
          jumpCooldown = false;
        }, 500);
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
    function checkGameOver() {
      // If player falls off track or goes out of lane bounds
      if (playerBody.position.y < -2 || playerBody.position.x < -1.5 || playerBody.position.x > 1.5) {
        setGameOver(true);
        setStartGame(false);
        if (points > bestScore) {
          setBestScore(points);
          localStorage.setItem('bestScore', points); // Sauvegarder le meilleur score
        }
      }
    }

    // --- Animation Loop ---
    function animate() {
      requestRef.current = requestAnimationFrame(animate);
      const delta = clockRef.current.getDelta();

      if (startGame && !gameOver) {
        // Move the player forward
        playerBody.position.z -= 10 * delta; // speed

        // Spawn points at intervals
        pointSpawnTimer += delta;
        if (pointSpawnTimer > pointSpawnInterval) {
          spawnPoint();
          pointSpawnTimer = 0;
        }

        // Update physics
        world.fixedStep();

        // Update player mesh
        playerMesh.position.copy(playerBody.position);
        playerMesh.quaternion.copy(playerBody.quaternion);

        // Update camera
        camera.position.x = playerMesh.position.x;
        camera.position.y = playerMesh.position.y + 1.5;
        camera.position.z = playerMesh.position.z + 5;
        camera.lookAt(playerMesh.position.x, playerMesh.position.y, playerMesh.position.z);

        // Check point collisions
        for (let i = 0; i < pointBodiesRef.current.length; i++) {
          const pBody = pointBodiesRef.current[i];
          const pMesh = pointMeshesRef.current[i];
          const dist = playerBody.position.vsub(pBody.position).length();
          if (dist < 0.5) {
            // Collect point
            setPoints((prev) => prev + 1);
            // Remove the point from world and scene
            world.removeBody(pBody);
            scene.remove(pMesh);
            pointBodiesRef.current.splice(i, 1);
            pointMeshesRef.current.splice(i, 1);
            i--;
          }
        }

        // Check Game Over
        checkGameOver();
      }

      // cannonDebugger.update();
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