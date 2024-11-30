varying vec3 vPosition;
varying vec3 vNormal;
varying vec2 vUv;
uniform float uTime;

void main() {
    vPosition = position;
    vUv = uv;
    vNormal = normal;

    // Create a wavy effect
    vec3 newPosition = position;
    newPosition.z += sin(position.x * 5.0 + uTime) * 0.2;
    newPosition.z += cos(position.y * 5.0 + uTime) * 0.2;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
}