import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import * as CANNON from 'cannon-es';

export function spawnPoint(scene, world, pointBodies, pointMeshes) {
  const lanes = [-1, 0, 1];
  const randomLane = lanes[Math.floor(Math.random() * lanes.length)];
  const spawnZ = -30;

  const pointShape = new CANNON.Sphere(0.2);
  const pointBody = new CANNON.Body({ mass: 0, shape: pointShape });
  pointBody.position.set(randomLane, 0.6, spawnZ);
  world.addBody(pointBody);
  pointBodies.push(pointBody);

  const loader = new GLTFLoader();
  loader.load(
    '/models/coin.glb',
    (gltf) => {
      const pointMesh = gltf.scene;
      pointMesh.scale.set(0.05, 0.05, 0.05);
      pointMesh.position.copy(pointBody.position);
      scene.add(pointMesh);
      pointMeshes.push(pointMesh);
    },
    undefined,
    (error) => console.error('Error loading point model:', error)
  );
}
