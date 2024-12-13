import React, { useEffect, useState } from 'react';
import './App.css';
import * as THREE from 'three';
import * as CANNON from 'cannon-es';
import CannonDebugger from 'cannon-es-debugger';

import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

function App() {


  useEffect(() => {


    // Scene setup
    const scene = new THREE.Scene();
    const world = new CANNON.World({
      gravity: new CANNON.Vec3(0, -9.82, 0)
    });


    const ambientLight = new THREE.AmbientLight(0x404040, 5); // Ajoutez une lumière ambiante avec une intensité de 1
    scene.add(ambientLight);


    // Renderer setup
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    const cannonDebugger = new CannonDebugger(scene, world, {
      color: "#AEE2FF",
      scale: 1
    });

    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 1.5, 4.5); // Positionner la caméra un peu plus loin


    const controls = new OrbitControls(camera, renderer.domElement);

    const loader = new GLTFLoader();

    loader.load(
      '/models/bridge/scene.glb',
      (gltf) => {
        const model = gltf.scene;
        model.scale.set(0.5, 0.5, 0.5)
        model.position.z = -4
        model.position.y = -8
        model.rotation.y = Math.PI / 2
        scene.add(model);
      },
      undefined,
      (error) => {
        console.error('Une erreur est survenue lors du chargement du modèle:', error);
      }
    );
    loader.load(
      '/models/bridge/scene.glb',
      (gltf) => {
        const model = gltf.scene;
        model.scale.set(0.5, 0.5, 0.5)
        model.position.z = -70
        model.position.y = -8
        model.rotation.y = Math.PI / 2
        scene.add(model);
      },
      undefined,
      (error) => {
        console.error('Une erreur est survenue lors du chargement du modèle:', error);
      }
    );

    const groundBody = new CANNON.Body({
      mass: 0,
      shape: new CANNON.Box(new CANNON.Vec3(2, 0.25, 40)),
      fixedRotation: true
    });
    groundBody.position.y = 0.5;
    world.addBody(groundBody);


    const playerBody = new CANNON.Body({
      mass: 0,
      shape: new CANNON.Box(new CANNON.Vec3(0.25, 0.25, 0.25)),
      fixedRotation: true
    });
    playerBody.position.y = 1;
    playerBody.position.x = playerBody.position.x - 0.5 // POSITION OF PLAYER X 
    world.addBody(playerBody);

    const player = new THREE.Mesh(
      new THREE.BoxGeometry(0.5, 0.5, 0.5),
      new THREE.MeshBasicMaterial({ color: 0xf00000 })
    );
    scene.add(player);

    // const resetThreshold = -50;  // Z position threshold for teleportation
    const startPosition = new THREE.Vector3(0, 1, 0);


    // Animation loop
    function animate() {
      requestAnimationFrame(animate);

      controls.update()

      world.fixedStep();

      playerBody.position.z -= 0.3;  // You can adjust this speed

      // If player reaches the threshold, teleport to the start position
      // if (playerBody.position.z < resetThreshold) {
      //   playerBody.position.copy(startPosition);
      // }

      player.position.copy(playerBody.position);
      player.quaternion.copy(playerBody.quaternion);

      camera.position.x = player.position.x;
      camera.position.z = player.position.z + 3;  // Keep the camera a bit behind
      camera.position.y = player.position.y + 0.5;  // Keep the camera slightly above
      camera.lookAt(player.position);

      cannonDebugger.update();
      renderer.render(scene, camera);
    }

    // Start animation
    animate();

    // Event listener
    window.addEventListener("resize", () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    });

    window.addEventListener("keydown", (e) => {
      if (e.key === "d" || e.key === "D" || e.key === "ArrowRight") {
        playerBody.position.x += 1;
      }
      if (e.key === "q" || e.key === "Q" || e.key === "ArrowLeft") {
        playerBody.position.x -= 1;
      }
      if (e.key === "r" || e.key === "R") {
        playerBody.position.z = 0;
        playerBody.position.x = 0;
        playerBody.position.y = 0;
      }
      if (e.key === " ") {
        playerBody.position.y >= 2 ? playerBody.position.y = 1 : playerBody.position.y += 1;
      }
      if (playerBody.position.x > 1 && (e.key === "d" || e.key === "D" || e.key === "ArrowRight")) {
        playerBody.position.x = 1;
      }
      if (playerBody.position.x < -1 && (e.key === "q" || e.key === "Q" || e.key === "ArrowLeft")) {
        playerBody.position.x = -1;
      }
    });

    window.addEventListener("keyup", (e) => {
      if (e.key === " ") {
        playerBody.position.y >= -2 ? playerBody.position.y = 1 : playerBody.position.y += 1;
      }
    });

    // Cleanup function to remove the renderer on component unmount
    return () => {
      document.body.removeChild(renderer.domElement);
    };
  }, []); // Empty dependency array ensures this effect runs only once when the component mounts

  return (
    <>
      <div className="absolute m-0 text-white top-3 left-3">
        <h1>Points: <span id="points">00</span></h1>
      </div>
    </>
  );
}

export default App;
