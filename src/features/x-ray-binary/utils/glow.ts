import { AdditiveBlending, BackSide, Color, Mesh, ShaderMaterial, SphereGeometry } from 'three';

const VERTEX_SHADER = `
  varying float intensity;
  void main() {
    // View direction approximated by the view-space z axis
    vec3 vNormal = normalize(normalMatrix * normal);
    intensity = pow(0.72 - vNormal.z, 4.0);
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
