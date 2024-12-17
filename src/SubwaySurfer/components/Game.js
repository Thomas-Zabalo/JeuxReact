import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import * as CANNON from 'cannon-es';
import { createPlayer } from './Player';
import { createGround } from './Ground';
import { spawnPoint } from './Points';
import { spawnEnemy } from './Enemies';

function Game({ points, setStartGame, gameOver, resetGame }) {
  const requestRef = useRef();
  const rendererRef = useRef();
  const worldRef = useRef();
  const sceneRef = useRef();
  const cameraRef = useRef();
  const clockRef = useRef(new THREE.Clock());
  const pointBodiesRef = useRef([]);
  const pointMeshesRef = useRef([]);
  const enemyBodiesRef = useRef([]);
  const enemyMeshesRef = useRef([]);
  const pointsRef = useRef(0);

  useEffect(() => {
    // --- Setup Three.js Scene and Cannon.js World ---
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    scene.fog = new THREE.Fog(0xffffff, 1, 150); // Light pink fog

    const world = new CANNON.World({
      gravity: new CANNON.Vec3(0, -9.82, 0)
    });
    worldRef.current = world;

     // Lights
     const ambientLight = new THREE.AmbientLight(0xffffff, 1.5);
     scene.add(ambientLight);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x222222);
    document.body.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 1.5, 5);
    cameraRef.current = camera;

    const playerData = createPlayer(scene, world);
    const player = playerData.player;
    const playerBody = playerData.playerBody;

    createGround(scene, world);

    let pointSpawnTimer = 0;
    let enemySpawnTimer = 0;
    let currentLane = 0;

    function handleKeyDown(e) {
        
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
        if (Math.abs(playerBody.velocity.y) < 0.1) {
          playerBody.applyImpulse(new CANNON.Vec3(0, 5, 0), playerBody.position);
        }
      }
  
      window.addEventListener("keydown", handleKeyDown);

    // --- Game Loop ---
    function animate() {
      requestRef.current = requestAnimationFrame(animate);
      const delta = clockRef.current.getDelta();

      if (gameOver) return; // Stop the game loop if game over

      // Logic for player movement, spawning points and enemies
      const speed = 10 + pointsRef.current * 0.2;
      playerBody.position.z -= speed * delta;

      // Adjust spawn rate based on points
      const spawnInterval = Math.max(0.2, 0.5 - pointsRef.current * 0.01);
      pointSpawnTimer += delta;
      if (pointSpawnTimer > spawnInterval) {
        spawnPoint(scene, world, pointBodiesRef.current, pointMeshesRef.current);
        pointSpawnTimer = 0;
      }

      // Spawn enemies with adjusted spawn rate
      const enemySpawnInterval = spawnInterval * 1.5;
      enemySpawnTimer += delta;
      if (enemySpawnTimer > enemySpawnInterval) {
        spawnEnemy(scene, world, enemyBodiesRef.current, enemyMeshesRef.current);
        enemySpawnTimer = 0;
      }

      // Check for collisions with points and enemies
      for (let i = 0; i < pointBodiesRef.current.length; i++) {
        const pBody = pointBodiesRef.current[i];
        const pMesh = pointMeshesRef.current[i];
        const dist = playerBody.position.vsub(pBody.position).length();
        if (dist < 0.5) {
          pointsRef.current += 1;
          world.removeBody(pBody);
          scene.remove(pMesh);
          pointBodiesRef.current.splice(i, 1);
          pointMeshesRef.current.splice(i, 1);
          i--;
        }
      }

      // Check for collisions with enemies
      for (let i = 0; i < enemyBodiesRef.current.length; i++) {
        const eBody = enemyBodiesRef.current[i];
        const dist = playerBody.position.vsub(eBody.position).length();
        if (dist < 0.5) {
          resetGame(); // Reset game on collision
        }
      }

      // Check for player out of bounds
      if (playerBody.position.y < -2 || Math.abs(playerBody.position.x) > 1.5) {
        resetGame();
      }

      // Update player mesh
      player.position.copy(playerBody.position);
      player.quaternion.copy(playerBody.quaternion);

      // Update camera position
      camera.position.x = player.position.x;
      camera.position.y = player.position.y + 1.5;
      camera.position.z = player.position.z + 5;
      camera.lookAt(player.position.x, player.position.y, player.position.z);

      world.fixedStep();
      renderer.render(scene, camera);
    }

    animate();

    return () => {
      cancelAnimationFrame(requestRef.current);
      document.body.removeChild(renderer.domElement);
    };
  }, [gameOver, resetGame]);

  return null; // This component does not need to render anything directly
}

export default Game;
