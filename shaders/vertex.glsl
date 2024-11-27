varying vec3 vPosition;
varying vec3 vNormal;
varying vec2 vUv;
uniform float uTime;


vec3 rotate(vec3 coords, float velocity) {
	coords.z *= step(velocity * uTime);
	coords.y += sin(velocity * uTime);
	coords.x +=  cos(velocity * uTime);
	return coords;
}

void main() {
	// vPosition = position;
	// vUv = uv;
	// vNormal = normal;
	float center = 0.5;
	float velocity = 3.0;
	vec3 coords = position;
	vec3 newPosition = rotate(coords, velocity);
	// coords.y += sin(uTime)
	gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
}