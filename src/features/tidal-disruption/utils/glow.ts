import { AdditiveBlending, BackSide, Color, Mesh, ShaderMaterial, SphereGeometry, type Vector3 } from 'three';
import { GLOW_BASE } from '../constants';

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
  uniform float brightness;
  varying float intensity;
  void main() {
    vec3 glow = glowColor * intensity * brightness;
    gl_FragColor = vec4(glow, intensity * 0.5);
  }
`;

export const createOuterGlow = (cameraPos: Vector3): Mesh<SphereGeometry, ShaderMaterial> => {
  const geo = new SphereGeometry(2.2, 64, 64);
  const mat = new ShaderMaterial({
    uniforms: {
      glowColor: { value: new Color(0xff8a3d) },
      brightness: { value: GLOW_BASE },
      viewVector: { value: cameraPos.clone() },
    },
    vertexShader: VERTEX_SHADER,
    fragmentShader: FRAGMENT_SHADER,
    side: BackSide,
    blending: AdditiveBlending,
    transparent: true,
    depthWrite: false,
  });
  return new Mesh(geo, mat);
};
