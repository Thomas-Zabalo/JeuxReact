import * as THREE from 'three';
import * as CANNON from 'cannon-es';

export function createGround(scene, world) {
  const groundShape = new CANNON.Box(new CANNON.Vec3(2, 0.1, 2000));
  const groundBody = new CANNON.Body({ mass: 0, shape: groundShape });
  groundBody.position.set(0, 0, -1000);
  world.addBody(groundBody);

  const groundMesh = new THREE.Mesh(
    new THREE.BoxGeometry(4, 0.2, 4000),
    new THREE.MeshStandardMaterial({
      color: 0xbee6fe,
      roughness: 0.1,
      metalness: 0.7,
    })
  );
  groundMesh.position.set(0, 0, -1000);
  scene.add(groundMesh);
}
