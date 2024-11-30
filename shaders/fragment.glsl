varying vec3 vPosition;
varying vec3 vNormal;
varying vec2 vUv;
uniform float uTime;

void main() {
    // Create a color gradient
    vec3 color = vec3(0.5 + 0.5 * sin(vUv.x * 10.0 + uTime),
                      0.5 + 0.5 * cos(vUv.y * 10.0 + uTime),
                      0.5 + 0.5 * sin(vUv.x * 10.0 + uTime + vUv.y * 10.0));

    gl_FragColor = vec4(color, 1.0);
}