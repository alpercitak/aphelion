import * as THREE from 'three';
import { massScale } from '@/utils/physics';

// ─── SHADERS ─────────────────────────────────────────────────────────────────

// Spacetime grid — vertex shader deforms Y with wave equation
export const spacetimeVertShader = `
  uniform float time;
  uniform float amplitude;
  uniform vec2 source1;
  uniform vec2 source2;
  uniform float separation;

  void main() {
    vec3 pos = position;
    float r1 = distance(pos.xz, source1);
    float r2 = distance(pos.xz, source2);

    float k = 1.8;
    float omega = 2.4;
    float damp = 0.18;

    float w1 = amplitude * sin(k * r1 - omega * time) * exp(-r1 * damp);
    float w2 = amplitude * sin(k * r2 - omega * time) * exp(-r2 * damp);

    // Suppress wave inside the orbital radius
    float suppress = smoothstep(separation * 0.4, separation * 1.2, r1)
                   * smoothstep(separation * 0.4, separation * 1.2, r2);

    pos.y = (w1 + w2) * suppress;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  }
`;

export const spacetimeFragShader = `
  uniform float amplitude;
  void main() {
    gl_FragColor = vec4(0.18, 0.55, 0.85, 0.18 + amplitude * 0.12);
  }
`;

// Fresnel glow — shared with BH scene pattern
const fresnelVert = `
  uniform vec3 viewVector;
  uniform float power;
  varying float intensity;
  void main() {
    vec3 vNormal = normalize(normalMatrix * normal);
    vec3 vNormel = normalize(normalMatrix * viewVector);
    intensity = pow(max(0.0, 0.7 - dot(vNormal, vNormel)), power);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const fresnelFrag = `
  uniform vec3 glowColor;
  varying float intensity;
  void main() {
    gl_FragColor = vec4(glowColor * intensity, intensity * 0.85);
  }
`;

// ─── SPACETIME GRID ───────────────────────────────────────────────────────────
export function createSpacetimeGrid() {
  const size = 28;
  const segments = 90;
  const geo = new THREE.PlaneGeometry(size, size, segments, segments);
  geo.rotateX(-Math.PI / 2);

  const mat = new THREE.ShaderMaterial({
    uniforms: {
      time: { value: 0 },
      amplitude: { value: 1.0 },
      source1: { value: new THREE.Vector2(2, 0) },
      source2: { value: new THREE.Vector2(-2, 0) },
      separation: { value: 4.0 },
    },
    vertexShader: spacetimeVertShader,
    fragmentShader: spacetimeFragShader,
    transparent: true,
    depthWrite: false,
    wireframe: true,
  });

  return new THREE.Mesh(geo, mat);
}

// ─── SINGLE BLACK HOLE UNIT ───────────────────────────────────────────────────
export function createBlackHoleUnit(massSolar, cameraPos) {
  const group = new THREE.Group();
  const s = massScale(massSolar, 20) * 0.7;

  // Event horizon
  const bhMesh = new THREE.Mesh(new THREE.SphereGeometry(1, 48, 48), new THREE.MeshBasicMaterial({ color: 0x000000 }));
  bhMesh.scale.setScalar(s);

  // Photon glow
  const glowMat = new THREE.ShaderMaterial({
    uniforms: {
      glowColor: { value: new THREE.Color(0xffaa44) },
      viewVector: { value: cameraPos ? cameraPos.clone() : new THREE.Vector3(0, 3, 8) },
      power: { value: 3.0 },
    },
    vertexShader: fresnelVert,
    fragmentShader: fresnelFrag,
    side: THREE.FrontSide,
    blending: THREE.AdditiveBlending,
    transparent: true,
    depthWrite: false,
  });
  const glowMesh = new THREE.Mesh(new THREE.SphereGeometry(1.55, 48, 48), glowMat);
  glowMesh.scale.setScalar(s);

  // Outer halo
  const haloMat = new THREE.ShaderMaterial({
    uniforms: {
      glowColor: { value: new THREE.Color(0xff6b1a) },
      viewVector: { value: cameraPos ? cameraPos.clone() : new THREE.Vector3(0, 3, 8) },
      power: { value: 4.0 },
    },
    vertexShader: fresnelVert,
    fragmentShader: fresnelFrag,
    side: THREE.BackSide,
    blending: THREE.AdditiveBlending,
    transparent: true,
    depthWrite: false,
  });
  const haloMesh = new THREE.Mesh(new THREE.SphereGeometry(2.1, 48, 48), haloMat);
  haloMesh.scale.setScalar(s);

  // Mini accretion disk
  const diskGroup = new THREE.Group();
  const innerR = 1.6 * s,
    outerR = 3.2 * s;
  const diskColors = [0xff9944, 0xff6633, 0xdd4422, 0x882211];
  for (let i = 0; i < 12; i++) {
    const t = i / 12;
    const r = innerR + t * (outerR - innerR);
    const w = ((outerR - innerR) / 12) * 1.1;
    const col = diskColors[Math.floor(t * diskColors.length)];
    const mesh = new THREE.Mesh(
      new THREE.RingGeometry(r, r + w, 80, 1),
      new THREE.MeshBasicMaterial({
        color: col,
        transparent: true,
        opacity: Math.pow(1 - t, 1.5) * 0.7 + 0.05,
        side: THREE.DoubleSide,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      }),
    );
    diskGroup.add(mesh);
  }

  group.add(bhMesh, glowMesh, haloMesh, diskGroup);
  group.userData = { bhMesh, glowMesh, glowMat, haloMesh, haloMat, diskGroup, baseScale: s };

  return group;
}

// ─── GRAVITATIONAL WAVE RING ──────────────────────────────────────────────────
export function createWaveRing(radius = 0.5) {
  const geo = new THREE.RingGeometry(radius, radius + 0.06, 180, 1);
  const mat = new THREE.MeshBasicMaterial({
    color: 0x4fc3f7,
    transparent: true,
    opacity: 0.7,
    side: THREE.DoubleSide,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  });
  const mesh = new THREE.Mesh(geo, mat);
  mesh.rotation.x = -Math.PI / 2;
  mesh.userData = { born: performance.now(), baseOpacity: 0.7 };
  return mesh;
}

// ─── MERGER FLASH ─────────────────────────────────────────────────────────────
export function createMergerFlash() {
  const geo = new THREE.PlaneGeometry(200, 200);
  const mat = new THREE.MeshBasicMaterial({
    color: 0xffeedd,
    transparent: true,
    opacity: 0,
    depthWrite: false,
    depthTest: false,
  });
  const mesh = new THREE.Mesh(geo, mat);
  mesh.renderOrder = 999;
  return mesh;
}

// ─── MERGED BLACK HOLE ────────────────────────────────────────────────────────
export function createMergedBlackHole(mass1, mass2, cameraPos) {
  const combinedMass = mass1 + mass2;
  return createBlackHoleUnit(combinedMass * 1.2, cameraPos);
}

// ─── ORBITAL MECHANICS ────────────────────────────────────────────────────────
// Returns { x1, z1, x2, z2 } given orbital angle and separation
export function orbitalPositions(angle, separation) {
  const r = separation / 2;
  return {
    x1: Math.cos(angle) * r,
    z1: Math.sin(angle) * r,
    x2: -Math.cos(angle) * r,
    z2: -Math.sin(angle) * r,
  };
}

// Orbital angular velocity (simplified, scales with separation)
export function orbitalOmega(separation, totalMass) {
  // ω ∝ sqrt(M) / r^1.5  — Keplerian
  return (0.6 * Math.sqrt(totalMass / 20)) / Math.pow(Math.max(separation, 0.3), 1.5);
}
