import * as THREE from "three";

class Character {
  constructor() {
    this.mesh = null; // Will hold the loaded model later
    this.velocity = new THREE.Vector3();
  }
}

export { Character };
