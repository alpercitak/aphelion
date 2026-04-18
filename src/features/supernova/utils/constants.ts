export const FRESNEL_VERTEX_SHADER = `
  uniform vec3 viewVector;
  varying float intensity;
  void main() {
    vec3 vN = normalize(normalMatrix * normal);
    vec3 vV = normalize(normalMatrix * viewVector);
    intensity = pow(max(0.0, 0.65 - dot(vN, vV)), 3.0);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

export const FRESNEL_FRAGMENT_SHADER = `
  uniform vec3 glowColor;
  varying float intensity;
  void main() {
    gl_FragColor = vec4(glowColor * intensity, intensity * 0.9);
  }
`;
