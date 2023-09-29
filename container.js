import * as THREE from "./node_modules/three/build/three.module.js";

class BoxContainer {
  constructor(
    width = 100,
    height = 100,
    depth = 100,
    color = 0xffffff,
    position = new THREE.Vector3()
  ) {
    const geometry = new THREE.BoxGeometry(width, height, depth);
    const material = new THREE.MeshLambertMaterial({
      color: color,
      transparent: true,
      opacity: 0.05,
      wireframe: false,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
    this.mesh = new THREE.Mesh(geometry, material);
    this.mesh.position.copy(position);
  }
}

export { BoxContainer };
