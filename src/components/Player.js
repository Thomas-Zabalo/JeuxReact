import * as THREE from 'three';
import * as CANNON from 'cannon-es';

export function createPlayer(scene, world) {
  const player = new THREE.Mesh(
    new THREE.BoxGeometry(0.5, 0.5, 0.5),
    new THREE.MeshStandardMaterial({ color: 0xff0000 })
  );
  player.position.y = -1;
  scene.add(player);

  const playerBody = new CANNON.Body({
    mass: 1,
    shape: new CANNON.Box(new CANNON.Vec3(0.25, 0.25, 0.25)),
    fixedRotation: true,
    position: new CANNON.Vec3(0, 1, 0),
    material: new CANNON.Material({ friction: 0.0, restitution: 0 })
  });
  playerBody.linearDamping = 0.1;
  world.addBody(playerBody);

  return { player, playerBody };
}
