My project goal was to create a fishtank simulation. The main thing I was interested in exploring was simulating 
creatures in a 3D space and working with simple collision detection.

TO INTERACT:
LMB + Mouse Movement: Rotation
RMB + Mouse Movement: Translation
MMB + Mouse Movement (or Mouse Scroll Wheel): Camera Distance

The main cool thing is how robust the fish movement is. It took quite a bit of fine tuning to get the algorithm
setup so that fish don't get trapped in corners or behave strangely when colliding with the bounding box.

The box size, speed of the fish, and number of fish can be adjusted too! My simulation will react to all of those accordingly.

I used threes.js, GLTFLoader, and OrbitControls as libraries (GLTFLoader and OrbitControls are a part of threes). 
The fish model I found online here: https://sketchfab.com/3d-models/koi-fish-8ffded4f28514e439ea0a26d28c1852a
The rest of the project was done by me.