import { AdditiveBlending, BackSide, Color, Mesh, ShaderMaterial, SphereGeometry, Vector3 } from 'three';

const VERTEX_SHADER = `
  uniform vec3 viewVector;
  varying float intensity;
  void main() {
    vec3 vNormal = normalize(normalMatrix * normal);
    vec3 vNormel = normalize(normalMatrix * viewVector);
    intensity = pow(0.72 - dot(vNormal, vNormel), 4.0);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const FRAGMENT_SHADER = `
  uniform vec3 glowColor;
  varying float intensity;
  void main() {
    vec3 glow = glowColor * intensity;
    gl_FragColor = vec4(glow, intensity * 0.5);
  }
`;

/** Unit-radius rim glow. Scale the mesh (or its parent) to size it. */
export const createGlow = (color: number): Mesh<SphereGeometry, ShaderMaterial> => {
  const mat = new ShaderMaterial({
    uniforms: {
      glowColor: { value: new Color(color) },
      viewVector: { value: new Vector3() },
    },
    vertexShader: VERTEX_SHADER,
    fragmentShader: FRAGMENT_SHADER,
    side: BackSide,
    blending: AdditiveBlending,
    transparent: true,
    depthWrite: false,
  });
  return new Mesh(new SphereGeometry(1, 48, 32), mat);
};
