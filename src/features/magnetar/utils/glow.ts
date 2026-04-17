import { AdditiveBlending, Color, Mesh, ShaderMaterial, SphereGeometry, type Side, type Vector3 } from 'three';

const VERTEX_SHADER = `
  uniform vec3 viewVector;
  varying float intensity;
  void main() {
    vec3 vNormal = normalize(normalMatrix * normal);
    vec3 vNormel = normalize(normalMatrix * viewVector);
    intensity = pow(max(0.0, 0.68 - dot(vNormal, vNormel)), 3.0);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const FRAGMENT_SHADER = `
  uniform vec3 glowColor;
  varying float intensity;
  void main() {
    gl_FragColor = vec4(glowColor * intensity, intensity * 0.9);
  }
`;

export const createGlow = (
  cameraPos: Vector3,
  color: number,
  radius: number,
  side: Side,
): Mesh<SphereGeometry, ShaderMaterial> =>
  new Mesh(
    new SphereGeometry(radius, 48, 48),
    new ShaderMaterial({
      uniforms: {
        glowColor: { value: new Color(color) },
        viewVector: { value: cameraPos.clone() },
      },
      vertexShader: VERTEX_SHADER,
      fragmentShader: FRAGMENT_SHADER,
      side,
      blending: AdditiveBlending,
      transparent: true,
      depthWrite: false,
    }),
  );
