import * as THREE from "node_modules/three/build/three.module.js";

class Character {
  constructor() {
    this.mesh = null; // Will hold the loaded model later
    this.velocity = new THREE.Vector3();
  }
}

export { Character };
