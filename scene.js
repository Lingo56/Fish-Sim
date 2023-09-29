import * as THREE from "three";
import { OrbitControls } from "./three/examples/jsm/controls/OrbitControls.js";
import { GLTFLoader } from "./three/examples/jsm/loaders/GLTFLoader.js";
import { Character } from "./character.js";
import { BoxContainer } from "./container.js";

// Setup
const numCharacters = 22; // Number of fish simulated
const swimSpeed = 0.02; // How fast the fish move
const boxWidth = 28;
const boxHeight = 15;
const boxDepth = 15;

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.set(0, 2, 25);
camera.lookAt(0, 0, 0);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0x000033, 1); // Set background

document.body.appendChild(renderer.domElement);

// Lights
const ambientLight = new THREE.AmbientLight(0xffffff);
ambientLight.intensity = 0.04;
scene.add(ambientLight);

// Point Light
const pointLight = new THREE.PointLight(0xffffff, 50);
pointLight.position.set(0, 0, 0); // Set the position of the light

// Sphere to visualize the light source
const lightSphereGeometry = new THREE.SphereGeometry(0.5);
const lightSphereMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
const lightSphere = new THREE.Mesh(lightSphereGeometry, lightSphereMaterial);
lightSphere.position.copy(pointLight.position);

scene.add(pointLight);
scene.add(lightSphere);

// Container
const container = new BoxContainer(
  boxWidth,
  boxHeight,
  boxDepth,
  0xffffff,
  new THREE.Vector3(0, 0, 0)
);
const {
  width: containerWidth,
  height: containerHeight,
  depth: containerDepth,
} = container.mesh.geometry.parameters;
scene.add(container.mesh);

// Characters
const characters = [];
let allModelsLoaded = false;

for (let i = 0; i < numCharacters; i++) {
  const characterScale = 0.005; // Set the character's width
  const characterWidth = 0.005; // Set the character's width
  const characterHeight = 0.005; // Set the character's width
  const characterDepth = 0.005; // Set the character's width

  const randomPosition = new THREE.Vector3(
    Math.random() * (containerWidth - characterWidth) -
      containerWidth / 2 +
      characterWidth / 2,
    Math.random() * (containerHeight - characterHeight) -
      containerHeight / 2 +
      characterHeight / 2,
    Math.random() * (containerDepth - characterDepth) -
      containerDepth / 2 +
      characterDepth / 2
  );

  const character = new Character();

  // Load GLTF model using the GLTFLoader
  const loader = new GLTFLoader();
  loader.load("./fish.gltf", (gltf) => {
    const model = gltf.scene;
    model.scale.set(characterScale, characterScale, characterScale);
    model.position.copy(randomPosition);
    scene.add(model);

    character.mesh = model;

    // Initialize random velocities for x, y, and z directions
    character.velocity = new THREE.Vector3(
      Math.random() - 0.5,
      Math.random() - 0.5,
      Math.random() - 0.5
    );

    // Check if all models are loaded
    if (characters.every((char) => char.mesh !== null)) {
      allModelsLoaded = true;
    }
  });

  characters.push(character);
}

// Particle System
const textureLoader = new THREE.TextureLoader();
const particleTexture = textureLoader.load("./particle.png");
particleTexture.magFilter = THREE.NearestFilter; // Ensures pixelated look
particleTexture.minFilter = THREE.NearestFilter; // Ensures pixelated look

const particleMaterial = new THREE.PointsMaterial({
  size: 0.1, // Adjust the size of the particles
  map: particleTexture,
  transparent: true,
  opacity: 0.7,
  blending: THREE.AdditiveBlending,
});

const numParticles = 75; // Adjust the number of particles as needed
const particlesGeometry = new THREE.BufferGeometry();
const particlePositions = new Float32Array(numParticles * 3);
const particleVelocities = new Float32Array(numParticles * 3);

for (let i = 0; i < numParticles; i++) {
  const offset = i * 3;

  particlePositions[offset] =
    Math.random() * containerWidth - containerWidth / 2;
  particlePositions[offset + 1] =
    Math.random() * containerHeight - containerHeight / 2;
  particlePositions[offset + 2] =
    Math.random() * containerDepth - containerDepth / 2;

  particleVelocities[offset] = 0; // Initialize x velocity
  particleVelocities[offset + 1] = 0; // Initialize y velocity
  particleVelocities[offset + 2] = 0; // Initialize z velocity
}

particlesGeometry.setAttribute(
  "position",
  new THREE.BufferAttribute(particlePositions, 3)
);
particlesGeometry.setAttribute(
  "velocity",
  new THREE.BufferAttribute(particleVelocities, 3)
);

const particleSystem = new THREE.Points(particlesGeometry, particleMaterial);
scene.add(particleSystem);

// Controls
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;
controls.enableZoom = true;
controls.autoRotate = false;
controls.autoRotateSpeed = 2.0;
controls.enablePan = true;

// Resize event
function onResize() {
  const { innerWidth, innerHeight, devicePixelRatio } = window;
  renderer.setPixelRatio(devicePixelRatio);
  renderer.setSize(innerWidth, innerHeight);
  camera.aspect = innerWidth / innerHeight;
  camera.updateProjectionMatrix();
}

// Listen for window resize event and call onResize
window.addEventListener("resize", onResize);

// Animation loop
function animate() {
  requestAnimationFrame(animate);

  particleSimulation();

  if (allModelsLoaded) {
    fishSwimmingAnimation();
  }

  controls.update();
  renderer.render(scene, camera);
}

function particleSimulation() {
  const particleSpeed = 0.01; // Adjust the speed of the particle movement
  const particleAmplitude = 0.5; // Adjust the amplitude of the up and down movement

  // Move particles up and down slightly within container
  const positions = particlesGeometry.attributes.position.array;
  const velocities = particlesGeometry.attributes.velocity.array;

  for (let i = 0; i < numParticles; i++) {
    const offset = i * 3;

    // Update particle position along the y-axis (up and down movement)
    velocities[offset + 1] += particleSpeed * (Math.random() - 0.5);
    positions[offset + 1] += velocities[offset + 1] * particleAmplitude;

    // Ensure particles stay within the container
    positions[offset] = Math.max(
      -containerWidth / 2,
      Math.min(containerWidth / 2, positions[offset])
    );
    positions[offset + 1] = Math.max(
      -containerHeight / 2,
      Math.min(containerHeight / 2, positions[offset + 1])
    );
    positions[offset + 2] = Math.max(
      -containerDepth / 2,
      Math.min(containerDepth / 2, positions[offset + 2])
    );

    // Update particle velocity decay
    velocities[offset + 1] *= 0.98;
  }

  particlesGeometry.attributes.position.needsUpdate = true;
}

function fishSwimmingAnimation() {
  const rotationSpeed = 0.1;
  const clippingMargin = 1.1;

  characters.forEach((character) => {
    const characterPosition = character.mesh.position;

    const newPosition = characterPosition
      .clone()
      .add(character.velocity.clone().multiplyScalar(swimSpeed));

    const targetRotation = new THREE.Euler().setFromQuaternion(
      new THREE.Quaternion().setFromUnitVectors(
        new THREE.Vector3(0, 0, 1),
        character.velocity.clone().normalize()
      )
    );
    targetRotation.z += Math.PI / 2;

    character.mesh.rotation.x +=
      (targetRotation.x - character.mesh.rotation.x) * rotationSpeed;
    character.mesh.rotation.y +=
      (targetRotation.y - character.mesh.rotation.y) * rotationSpeed;
    character.mesh.rotation.z +=
      (targetRotation.z - character.mesh.rotation.z) * rotationSpeed;

    // Calculate boundaries with clipping margin
    const minX = -containerWidth / 2 + clippingMargin;
    const maxX = containerWidth / 2 - clippingMargin;
    const minY = -containerHeight / 2 + clippingMargin;
    const maxY = containerHeight / 2 - clippingMargin;
    const minZ = -containerDepth / 2 + clippingMargin;
    const maxZ = containerDepth / 2 - clippingMargin;

    // Check if new position is within the bounding box
    if (
      newPosition.x < minX ||
      newPosition.x > maxX ||
      newPosition.y < minY ||
      newPosition.y > maxY ||
      newPosition.z < minZ ||
      newPosition.z > maxZ
    ) {
      // Clamp the position to stay within the bounds
      characterPosition.x = Math.max(minX, Math.min(maxX, newPosition.x));
      characterPosition.y = Math.max(minY, Math.min(maxY, newPosition.y));
      characterPosition.z = Math.max(minZ, Math.min(maxZ, newPosition.z));

      // Reverse the velocity component that hits the boundary
      if (newPosition.x < minX || newPosition.x > maxX) {
        character.velocity.x *= -1;
      }
      if (newPosition.y < minY || newPosition.y > maxY) {
        character.velocity.y *= -1;
      }
      if (newPosition.z < minZ || newPosition.z > maxZ) {
        character.velocity.z *= -1;
      }
    } else {
      // Update character's position
      characterPosition.copy(newPosition);
    }
  });
}

animate();
