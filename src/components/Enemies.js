import * as THREE from 'three';
import * as CANNON from 'cannon-es';

export function spawnEnemy(scene, world, enemyBodies, enemyMeshes) {
  const lanes = [-1, 0, 1];
  const randomLane = lanes[Math.floor(Math.random() * lanes.length)];
  const spawnZ = -30;

  const enemyShape = new CANNON.Sphere(0.4);
  const enemyBody = new CANNON.Body({ mass: 0, shape: enemyShape });
  enemyBody.position.set(randomLane, 0.6, spawnZ);
  world.addBody(enemyBody);
  enemyBodies.push(enemyBody);

  const enemyGeometry = new THREE.SphereGeometry(0.4, 16, 16);
  const enemyMaterial = new THREE.MeshStandardMaterial({ color: 0xff0000 });
  const enemyMesh = new THREE.Mesh(enemyGeometry, enemyMaterial);
  enemyMesh.position.copy(enemyBody.position);
  scene.add(enemyMesh);
  enemyMeshes.push(enemyMesh);
}
