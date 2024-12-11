import React, { useEffect } from 'react';
import './App.css';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

function App() {

  useEffect(() => {
    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 4.5;
    camera.position.y = 1.5;

    // Renderer setup
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);


    // Orbit control 
    const controls = new OrbitControls(camera, renderer.domElement);

    // Grid Helper
    const gridHelper = new THREE.GridHelper(30, 30)

    //ajouter une grille pour voir où se situe l'objet
    scene.add(gridHelper)

    // Cube setup
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshBasicMaterial({ color: 0xffff42 });
    const cube = new THREE.Mesh(geometry, material);

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

    scene.add(player);
    scene.add(ground)

    // Animation loop
    function animate() {
      controls.update();
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
    <></>
  );
}

export default App;
