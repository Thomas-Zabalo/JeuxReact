import React, { useEffect } from 'react';
import './App.css';
import * as THREE from 'three';

function App() {

  useEffect(() => {
    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 4.5;
    camera.position.y = 1.5;

    const pointsUI = document.getElementById("points")
    let points = 0

    const randomRangeNum = (max, min) => {
      return Math.floor(Math.random() * (max - min + 1) + min)
    }
    const moveObstacle = (arr, speed, maxX, minX, maxZ, minZ) => {
      arr.forEach(e => {
        e.position.z += speed;
        if (e.position.z > camera.position.z) {
          e.position.x = randomRangeNum(maxX, minX)
          e.position.z = randomRangeNum(maxZ, minZ)
        }
      });
    }

    // Renderer setup
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);


    // Orbit control 
    // const controls = new OrbitControls(camera, renderer.domElement);

    // Grid Helper
    const gridHelper = new THREE.GridHelper(30, 30)

    //ajouter une grille pour voir où se situe l'objet
    scene.add(gridHelper)


    // Ground
    const ground = new THREE.Mesh(
      new THREE.BoxGeometry(30, 1, 30),
      new THREE.MeshBasicMaterial({ color: 0x91785d })
    )
    ground.position.y = -2

    // Player
    const player = new THREE.Mesh(
      new THREE.BoxGeometry(0.5, 0.5, 0.5),
      new THREE.MeshBasicMaterial({ color: 0xffff42 })
    )

    const powerups = []
    for (let i = 0; i < 10; i++) {
      const powerup = new THREE.Mesh(
        new THREE.TorusGeometry(1, 0.4, 16, 50),
        new THREE.MeshBasicMaterial({ color: 0xffdd08 })
      )
      powerup.scale.set(0.1, 0.1, 0.1)
      powerup.name = "powerup" + i + 1
      powerup.position.x = randomRangeNum(8, -8)
      powerup.position.z = randomRangeNum(-5, -10)
      powerups.push(powerup)
      scene.add(powerup)
    }


    scene.add(player);
    scene.add(ground)


    // Animation loop
    function animate() {
      moveObstacle(powerups, 0.1, 8, -8, -5, -10)
      renderer.render(scene, camera);
    }

    // Start animation
    renderer.setAnimationLoop(animate);

    window.addEventListener("resize", () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight)
    })

    window.addEventListener("keydown", (e) => {
      if (e.key === "d" || e.key === "D" || e.key === "ArrowRight") {
        player.position.x += 0.1;
      }
      else if (e.key === "q" || e.key === "Q" || e.key === "ArrowLeft") {
        player.position.x -= 0.1;
      }
      else if (e.key === "z" || e.key === "Z" || e.key === "ArrowUp") {
        player.position.z -= 0.1;
      }
      else if (e.key === "S" || e.key === "S" || e.key === "ArrowDown") {
        player.position.z += 0.1;
      }
    })

    // Cleanup function to remove the renderer on component unmount
    return () => {
      document.body.removeChild(renderer.domElement);
    };
  }, []); // Empty dependency array ensures this effect runs only once when the component mounts

  return (
    <>
      <div className="absolute m-0 text-white top-3 left-3">
        <h1>Points: <span id="pointsUI">00</span></h1>
      </div>
    </>
  );
}

export default App;
