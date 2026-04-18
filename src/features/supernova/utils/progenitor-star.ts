import { Mesh, ShaderMaterial, SphereGeometry } from 'three';

const VERTEX_SHADER = `
  uniform float time;
  varying vec3  vNormal;
  varying vec2  vUv;

  float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
  float noise(vec2 p) {
    vec2 i = floor(p); vec2 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    float a = mix(hash(i),              hash(i + vec2(1.0, 0.0)), f.x);
    float b = mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), f.x);
    return mix(a, b, f.y);
  }

  void main() {
    vNormal = normalize(normalMatrix * normal);
    vUv     = uv;
    vec3 pos = position;
    // Convective surface boiling
    float n = noise(uv * 5.0 + time * 0.15) * 0.04;
    pos += normal * n;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  }
`;

const FRAGMENT_SHADER = `
  uniform float time;
  uniform float mass;       // progenitor mass, affects color
  uniform float collapse;   // 0→1 during collapse phase
  varying vec3  vNormal;
  varying vec2  vUv;

  float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
  float noise(vec2 p) {
    vec2 i = floor(p); vec2 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    float a = mix(hash(i),              hash(i + vec2(1.0, 0.0)), f.x);
    float b = mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), f.x);
    return mix(a, b, f.y);
  }

  void main() {
    // Massive stars are blue-white; lower mass → orange-red supergiants
    float massT    = clamp((mass - 8.0) / 142.0, 0.0, 1.0);
    vec3  coolCol  = vec3(1.0, 0.45, 0.1);   // red supergiant
    vec3  hotCol   = vec3(0.7, 0.85, 1.0);   // blue supergiant
    vec3  baseCol  = mix(coolCol, hotCol, massT);

    float n1 = noise(vUv * 8.0  + time * 0.12);
    float n2 = noise(vUv * 18.0 - time * 0.08);
    vec3  col = baseCol * (0.75 + n1 * 0.18 + n2 * 0.07);

    // Granulation hotspots
    float hotspot = smoothstep(0.62, 0.78, noise(vUv * 3.5 + time * 0.06)) * 0.35;
    col += vec3(1.0, 0.8, 0.4) * hotspot;

    // Collapse darkens and compresses — inward shrink visible
    col *= 1.0 - collapse * 0.6;

    gl_FragColor = vec4(col, 1.0);
  }
`;

export const createProgenitorStar = (mass: number): Mesh<SphereGeometry, ShaderMaterial> => {
  // Radius scales with mass — red supergiants are enormous
  const r = 0.8 + (mass / 150) * 1.2;
  return new Mesh(
    new SphereGeometry(r, 64, 64),
    new ShaderMaterial({
      uniforms: {
        time: { value: 0 },
        mass: { value: mass },
        collapse: { value: 0 },
      },
      vertexShader: VERTEX_SHADER,
      fragmentShader: FRAGMENT_SHADER,
    }),
  );
};
