import React, { useEffect, useState } from 'react';
import './App.css';
import * as THREE from 'three';
import * as CANNON from 'cannon-es';
import CannonDebugger from 'cannon-es-debugger';


import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { useGamepads } from "react-gamepads";

function App() {
  const [gamepads, setGamepads] = useState({});
  useGamepads((gamepads) => setGamepads(gamepads));
  console.log(gamepads)

  const gamepadDisplay = Object.keys(gamepads).map(gamepadId => {
    console.log("displaying gamepad", gamepads[gamepadId]);
    return (
      <div>
        <h2>{gamepads[gamepadId].id}</h2>
        {gamepads[gamepadId].buttons &&
          gamepads[gamepadId].buttons.map((button, index) => (
            <div>
              {index}: {button.pressed ? 'True' : 'False'}
            </div>
          ))}
      </div>
    );
  });
  

  useEffect(() => {
  

    // Scene setup
    const scene = new THREE.Scene();
    const world = new CANNON.World({
      gravity: new CANNON.Vec3(0, -9.82, 0)
    });


    // Renderer setup
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    const cannonDebugger = new CannonDebugger(scene, world, {
      color: "#AEE2FF",
      scale: 1
    });

    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 4.5;
    camera.position.y = 1.5;

    const controls = new OrbitControls(camera, renderer.domElement);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
    directionalLight.position.set(5, 10, 7.5);
    scene.add(directionalLight);

    const loader = new GLTFLoader();
    let model;

    loader.load(
      '/models/bridge/scene.gltf', // Chemin vers le fichier GLTF/GLB
      (gltf) => {
        model = gltf.scene;
        model.rotation.y= Math.PI / 2;
        scene.add(model);
      },
      undefined,
      (error) => {
        console.error('Une erreur est survenue:', error);
      }
    );


    // const randomRangeNum = (max, min) => {
    //   return Math.floor(Math.random() * (max - min + 1) + min);
    // };

    // const isPositionOccupied = (position, objects) => {
    //   return objects.some(obj => {
    //     const distance = position.clone().sub(obj.body.position).length();
    //     return distance < 2; // Adjust this threshold based on object sizes
    //   });
    // };

    // const moveObstacles = (arr, speed, maxX, minX, maxZ, minZ) => {
    //   arr.forEach((e) => {
    //     e.body.position.z += speed;
    //     if (e.body.position.z > camera.position.z) {
    //       e.body.position.x = randomRangeNum(maxX, minX);
    //       e.body.position.z = randomRangeNum(maxZ, minZ);
    //     }
    //     e.mesh.position.copy(e.body.position);
    //     e.mesh.quaternion.copy(e.body.quaternion);
    //   });
    // };

    // Ground
    const groundBody = new CANNON.Body({
      shape: new CANNON.Box(new CANNON.Vec3(15, 0.5, 150)),
    });
    groundBody.position.y = 0;
    world.addBody(groundBody);

    const ground = new THREE.Mesh(
      new THREE.BoxGeometry(30, 1, 300),
      new THREE.MeshBasicMaterial({ color: 0x91785d })
    );
    ground.position.y = 0;
    scene.add(ground);

    const wall1 = new THREE.Mesh(
      new THREE.BoxGeometry(1, 3, 300),
      new THREE.MeshBasicMaterial({ color: 0xff0000 })
    )
    wall1.position.y = 2;
    wall1.position.x = 3
    scene.add(wall1)

    const wall2 = new THREE.Mesh(
      new THREE.BoxGeometry(1, 3, 300),
      new THREE.MeshBasicMaterial({ color: 0xff0000 })
    )
    wall2.position.y = 2;
    wall2.position.x = -3
    scene.add(wall2)
    // Player
    const playerBody = new CANNON.Body({
      mass: 0,
      shape: new CANNON.Box(new CANNON.Vec3(0.25, 0.25, 0.25)),
      fixedRotation: true
    });
    playerBody.position.y = 1;
    world.addBody(playerBody);

    const player = new THREE.Mesh(
      new THREE.BoxGeometry(0.5, 0.5, 0.5),
      new THREE.MeshBasicMaterial({ color: 0xf00000 })
    );
    scene.add(player);

    // Powerups
    // const powerups = [];
    // const enemies = [];

    // for (let i = 0; i < 10; i++) {
    //   let posX, posZ, position;

    //   do {
    //     posX = randomRangeNum(1, -1);
    //     posZ = randomRangeNum(-10, -40);
    //     position = new THREE.Vector3(posX, 1, posZ);
    //   } while (isPositionOccupied(position, powerups.concat(enemies)));  // Check against powerups and enemies

    //   const powerup = new THREE.Mesh(
    //     new THREE.TorusGeometry(1, 0.4, 16, 50),
    //     new THREE.MeshBasicMaterial({ color: 0xffff00 })
    //   );
    //   powerup.scale.set(0.1, 0.1, 0.1);
    //   powerup.position.set(posX, 1, posZ);
    //   scene.add(powerup);

    //   const powerupBody = new CANNON.Body({
    //     shape: new CANNON.Sphere(0.2),
    //   });
    //   powerupBody.position.set(posX, 1, posZ);
    //   world.addBody(powerupBody);

    //   const powerupObject = {
    //     mesh: powerup,
    //     body: powerupBody,
    //   };

    //   powerups.push(powerupObject);
    // }

    // // Enemies

    // for (let i = 0; i < 2; i++) {
    //   let posX, posZ, position;

    //   do {
    //     posX = randomRangeNum(1, -1);
    //     posZ = randomRangeNum(-5, -10);
    //     position = new THREE.Vector3(posX, 1, posZ);
    //   } while (isPositionOccupied(position, powerups.concat(enemies)));  // Check against powerups and enemies

    //   const enemy = new THREE.Mesh(
    //     new THREE.BoxGeometry(1, 1, 1),
    //     new THREE.MeshBasicMaterial({ color: 0x0000ff })
    //   );
    //   enemy.position.y = 1;
    //   enemy.position.set(posX, 1, posZ);
    //   scene.add(enemy);

    //   const enemyBody = new CANNON.Body({
    //     mass: 1,
    //     shape: new CANNON.Box(new CANNON.Vec3(0.5, 0.5, 0.5)),
    //   });
    //   enemyBody.position.set(posX, 1, posZ);
    //   world.addBody(enemyBody);

    //   const enemyObject = {
    //     mesh: enemy,
    //     body: enemyBody,
    //   };

    //   enemies.push(enemyObject);
    // }

    // // Listen for collisions after enemies and powerups have been initialized
    // playerBody.addEventListener("collide", (e) => {
    //   powerups.forEach((el) => {
    //     if (e.body === el.body) {
    //       el.body.position.x = randomRangeNum(8, -8);
    //       el.body.position.z = randomRangeNum(-10, -40);
    //       el.mesh.position.copy(el.body.position);
    //       el.mesh.quaternion.copy(el.body.quaternion);
    //       points += 1;
    //       pointsUI.textContent = points.toString();
    //     }
    //   });
    //   enemies.forEach((el) => {
    //     if (e.body === el.body) {
    //       gameOver = true;
    //     }
    //   });
    // });

    // Animation loop
    function animate() {
      requestAnimationFrame(animate);

      controls.update()

      // if (!gameOver) {
      //   moveObstacles(powerups, 0.3, 1, -1, -10, -40);
      //   moveObstacles(enemies, 0.3, 1, -1, -10, -40);
      // } else {
      //   pointsUI.textContent = "GAME OVER";
      //   playerBody.velocity.set(playerBody.position.x, 5, 5);

      //   enemies.forEach((el) => {
      //     scene.remove(el.mesh);
      //     world.removeBody(el.body);
      //   });

      //   powerups.forEach((el) => {
      //     scene.remove(el.mesh);
      //     world.removeBody(el.body);
      //   });

      //   if (playerBody.position.z > camera.position.z) {
      //     scene.remove(player);
      //     world.removeBody(playerBody);
      //   }
      // }

      world.fixedStep();

      player.position.copy(playerBody.position);
      player.quaternion.copy(playerBody.quaternion);

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
        playerBody.position.y += 2;
      }
      if (playerBody.position.x > 1 && (e.key === "d" || e.key === "D" || e.key === "ArrowRight")) {
        playerBody.position.x = 1;
      }
      if (playerBody.position.x < -1 && (e.key === "q" || e.key === "Q" || e.key === "ArrowLeft")) {
        playerBody.position.x = -1;
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
      {gamepadDisplay}
    </>
  );
}

export default App;
