import { Mesh, ShaderMaterial, SphereGeometry } from 'three';
import { NS_RADIUS } from '../constants';

const VERTEX_SHADER = `
  uniform float time;
  uniform float fieldStrength;
  varying vec3 vNormal;
  varying vec2 vUv;
  varying vec3 vPosition;

  float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1,311.7))) * 43758.5453); }
  float noise(vec2 p) {
    vec2 i = floor(p); vec2 f = fract(p);
    f = f*f*(3.0-2.0*f);
    return mix(mix(hash(i),hash(i+vec2(1,0)),f.x),mix(hash(i+vec2(0,1)),hash(i+vec2(1,1)),f.x),f.y);
  }

  void main() {
    vNormal = normalize(normalMatrix * normal);
    vUv = uv;
    vPosition = position;
    vec3 pos = position;
    // Stronger field = more surface deformation
    float n = noise(uv * 6.0 + time * 0.08) * 0.018 * fieldStrength;
    float n2 = noise(uv * 14.0 - time * 0.05) * 0.008 * fieldStrength;
    pos += normal * (n + n2);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  }
`;

const FRAGMENT_SHADER = `
  uniform float time;
  uniform float surfaceTemp;  // normalised 0–1
  uniform float fieldStrength;
  varying vec3 vNormal;
  varying vec2 vUv;

  float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1,311.7))) * 43758.5453); }
  float noise(vec2 p) {
    vec2 i = floor(p); vec2 f = fract(p);
    f = f*f*(3.0-2.0*f);
    return mix(mix(hash(i),hash(i+vec2(1,0)),f.x),mix(mix(hash(i+vec2(0,1)),hash(i+vec2(1,1)),f.x),f.y));
  }

  void main() {
    // Temperature-driven base color: orange-white (cool) → blue-white (hot)
    vec3 coolColor = vec3(1.0, 0.75, 0.5);
    vec3 hotColor  = vec3(0.75, 0.88, 1.0);
    vec3 baseColor = mix(coolColor, hotColor, surfaceTemp);

    // Crust texture layers
    float n1 = noise(vUv * 10.0 + time * 0.03);
    float n2 = noise(vUv * 22.0 - time * 0.07);
    float n3 = noise(vUv * 48.0);
    vec3 crustColor = baseColor * (0.78 + n1 * 0.13 + n2 * 0.07 + n3 * 0.04);

    // Magnetic hot spots — scattered bright patches driven by field
    float hotspot = smoothstep(0.55, 0.75, noise(vUv * 4.0 + time * 0.02)) * fieldStrength * 0.5;
    crustColor += hotColor * hotspot;

    // Polar brightening
    float pole = abs(vNormal.y);
    crustColor += vec3(0.4, 0.6, 1.0) * smoothstep(0.6, 1.0, pole) * 0.35;

    gl_FragColor = vec4(crustColor, 1.0);
  }
`;

export const createMagnetarBody = (): Mesh<SphereGeometry, ShaderMaterial> =>
  new Mesh(
    new SphereGeometry(NS_RADIUS, 64, 64),
    new ShaderMaterial({
      uniforms: {
        time: { value: 0 },
        fieldStrength: { value: 1.0 },
        surfaceTemp: { value: 0.5 },
      },
      vertexShader: VERTEX_SHADER,
      fragmentShader: FRAGMENT_SHADER,
    }),
  );
