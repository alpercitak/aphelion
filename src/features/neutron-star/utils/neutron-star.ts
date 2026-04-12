import { Mesh, ShaderMaterial, SphereGeometry } from 'three';
import { NS_RADIUS } from '../constants';

const VERTEX_SHADER = `
  uniform float time;
  uniform float rpm;
  varying vec3 vNormal;
  varying vec2 vUv;

  // Simple hash for noise
  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
  }

  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    return mix(
      mix(hash(i), hash(i + vec2(1,0)), f.x),
      mix(hash(i + vec2(0,1)), hash(i + vec2(1,1)), f.x),
      f.y
    );
  }

  void main() {
    vNormal = normalize(normalMatrix * normal);
    vUv = uv;
    vec3 pos = position;
    // Surface crust displacement
    float n = noise(uv * 8.0 + time * 0.05) * 0.012;
    pos += normal * n;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  }
`;

const FRAGMENT_SHADER = `
  uniform float time;
  uniform float mass;
  varying vec3 vNormal;
  varying vec2 vUv;

  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
  }

  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    return mix(
      mix(hash(i), hash(i + vec2(1,0)), f.x),
      mix(hash(i + vec2(0,1)), hash(i + vec2(1,1)), f.x),
      f.y
    );
  }

  void main() {
    // Base blue-white color, hotter at poles
    float pole = abs(vNormal.y);
    vec3 baseColor = mix(vec3(0.55, 0.72, 1.0), vec3(0.85, 0.92, 1.0), pole);

    // Crust texture
    float n = noise(vUv * 12.0);
    float n2 = noise(vUv * 28.0 + 3.7);
    vec3 crustColor = baseColor * (0.82 + n * 0.12 + n2 * 0.06);

    // Hot spot at magnetic poles
    float hotspot = smoothstep(0.7, 1.0, pole) * 0.4;
    crustColor += vec3(0.3, 0.5, 1.0) * hotspot;

    // Mass-based intensity (heavier = brighter, denser)
    float massBoost = (mass - 1.1) / 1.4;
    crustColor *= 1.0 + massBoost * 0.3;

    gl_FragColor = vec4(crustColor, 1.0);
  }
`;

export const createNeutronStarBody = (mass: number): Mesh<SphereGeometry, ShaderMaterial> => {
  const geo = new SphereGeometry(NS_RADIUS, 64, 64);
  const mat = new ShaderMaterial({
    uniforms: {
      time: { value: 0 },
      rpm: { value: 30 },
      mass: { value: mass },
    },
    vertexShader: VERTEX_SHADER,
    fragmentShader: FRAGMENT_SHADER,
  });
  return new Mesh(geo, mat);
};
