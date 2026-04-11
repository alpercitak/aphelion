import * as THREE from 'three';
import { tempToColor, massScale } from '../../shared/utils/physics';

// ─── SHADERS ─────────────────────────────────────────────────────────────────
const fresnelVert = `
  uniform vec3 viewVector;
  varying float intensity;
  void main() {
    vec3 vNormal = normalize(normalMatrix * normal);
    vec3 vNormel = normalize(normalMatrix * viewVector);
    intensity = pow(0.65 - dot(vNormal, vNormel), 3.0);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const fresnelFrag = `
  uniform vec3 glowColor;
  varying float intensity;
  void main() {
    vec3 glow = glowColor * intensity;
    gl_FragColor = vec4(glow, intensity * 0.9);
  }
`;

const outerGlowFrag = `
  uniform vec3 glowColor;
  varying float intensity;
  void main() {
    vec3 glow = glowColor * intensity;
    gl_FragColor = vec4(glow, intensity * 0.5);
  }
`;

const outerGlowVert = `
  uniform vec3 viewVector;
  varying float intensity;
  void main() {
    vec3 vNormal = normalize(normalMatrix * normal);
    vec3 vNormel = normalize(normalMatrix * viewVector);
    intensity = pow(0.72 - dot(vNormal, vNormel), 4.0);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

// ─── EVENT HORIZON ────────────────────────────────────────────────────────────
export function createEventHorizon() {
  const geo = new THREE.SphereGeometry(1, 64, 64);
  const mat = new THREE.MeshBasicMaterial({ color: 0x000000 });
  return new THREE.Mesh(geo, mat);
}

// ─── PHOTON SPHERE ────────────────────────────────────────────────────────────
export function createPhotonSphere(cameraPos) {
  const geo = new THREE.SphereGeometry(1.5, 64, 64);
  const mat = new THREE.ShaderMaterial({
    uniforms: {
      glowColor: { value: new THREE.Color(0xffaa44) },
      viewVector: { value: cameraPos.clone() },
    },
    vertexShader: fresnelVert,
    fragmentShader: fresnelFrag,
    side: THREE.FrontSide,
    blending: THREE.AdditiveBlending,
    transparent: true,
    depthWrite: false,
  });
  return new THREE.Mesh(geo, mat);
}

// ─── OUTER GLOW ───────────────────────────────────────────────────────────────
export function createOuterGlow(cameraPos) {
  const geo = new THREE.SphereGeometry(2.2, 64, 64);
  const mat = new THREE.ShaderMaterial({
    uniforms: {
      glowColor: { value: new THREE.Color(0xff6b1a) },
      viewVector: { value: cameraPos.clone() },
    },
    vertexShader: outerGlowVert,
    fragmentShader: outerGlowFrag,
    side: THREE.BackSide,
    blending: THREE.AdditiveBlending,
    transparent: true,
    depthWrite: false,
  });
  return new THREE.Mesh(geo, mat);
}

// ─── LENSING RINGS ────────────────────────────────────────────────────────────
export function createLensingRings() {
  const photonRing = new THREE.Mesh(
    new THREE.RingGeometry(1.48, 1.52, 256, 1),
    new THREE.MeshBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.9,
      side: THREE.DoubleSide,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    }),
  );
  const einsteinRing = new THREE.Mesh(
    new THREE.RingGeometry(1.2, 1.22, 256, 1),
    new THREE.MeshBasicMaterial({
      color: 0xffaa44,
      transparent: true,
      opacity: 0.5,
      side: THREE.DoubleSide,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    }),
  );
  return { photonRing, einsteinRing };
}

// ─── ACCRETION DISK ───────────────────────────────────────────────────────────
export function createAccretionDisk(temp, dopplerMode = false) {
  const group = new THREE.Group();
  const rings = 80,
    innerR = 1.5,
    outerR = 6.0;

  if (dopplerMode) {
    for (let i = 0; i < rings; i++) {
      const t = i / rings;
      const r = innerR + t * (outerR - innerR);
      const width = ((outerR - innerR) / rings) * 1.05;
      const segments = 256;
      const vertices = [],
        cols = [];
      for (let j = 0; j <= segments; j++) {
        const angle = (j / segments) * Math.PI * 2;
        const cosA = Math.cos(angle);
        const ringTemp = temp * (1 - t * 0.75);
        let color;
        if (cosA > 0) {
          color = tempToColor(ringTemp * (1 + cosA * 0.5));
          color.multiplyScalar(1 + cosA * 0.8);
        } else {
          const factor = 1 + cosA * 0.4;
          color = tempToColor(ringTemp * factor);
          color.multiplyScalar(Math.max(0.1, factor));
        }
        for (let k = 0; k < 2; k++) {
          const rr = k === 0 ? r : r + width;
          vertices.push(Math.cos(angle) * rr, 0, Math.sin(angle) * rr);
          cols.push(color.r, color.g, color.b);
        }
      }
      const geo = new THREE.BufferGeometry();
      geo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(vertices), 3));
      geo.setAttribute('color', new THREE.BufferAttribute(new Float32Array(cols), 3));
      const indices = [];
      for (let j = 0; j < segments; j++) {
        const b = j * 2;
        indices.push(b, b + 1, b + 2, b + 1, b + 3, b + 2);
      }
      geo.setIndex(indices);
      const brightness = Math.pow(1 - t, 1.5) * 1.5 + 0.05;
      group.add(
        new THREE.Mesh(
          geo,
          new THREE.MeshBasicMaterial({
            vertexColors: true,
            transparent: true,
            opacity: Math.max(0.02, brightness * 0.9),
            side: THREE.DoubleSide,
            blending: THREE.AdditiveBlending,
            depthWrite: false,
          }),
        ),
      );
    }
  } else {
    for (let i = 0; i < rings; i++) {
      const t = i / rings;
      const r = innerR + t * (outerR - innerR);
      const width = ((outerR - innerR) / rings) * 1.05;
      const geo = new THREE.RingGeometry(r, r + width, 128, 1);
      const color = tempToColor(temp * (1 - t * 0.75));
      const brightness = Math.pow(1 - t, 1.5) * 1.5 + 0.05;
      group.add(
        new THREE.Mesh(
          geo,
          new THREE.MeshBasicMaterial({
            color,
            transparent: true,
            opacity: Math.max(0.02, brightness * 0.9),
            side: THREE.DoubleSide,
            blending: THREE.AdditiveBlending,
            depthWrite: false,
          }),
        ),
      );
    }

    // Turbulence particles
    const count = 3000;
    const pos = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const r = innerR + Math.pow(Math.random(), 1.5) * (outerR - innerR);
      const angle = Math.random() * Math.PI * 2;
      const t2 = (r - innerR) / (outerR - innerR);
      const yJitter = (Math.random() - 0.5) * 0.08 * (1 - t2);
      pos[i * 3] = Math.cos(angle) * r;
      pos[i * 3 + 1] = yJitter;
      pos[i * 3 + 2] = Math.sin(angle) * r;
      const c = tempToColor(temp * (1 - t2 * 0.7));
      colors[i * 3] = c.r;
      colors[i * 3 + 1] = c.g;
      colors[i * 3 + 2] = c.b;
    }
    const pGeo = new THREE.BufferGeometry();
    pGeo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    pGeo.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    group.add(
      new THREE.Points(
        pGeo,
        new THREE.PointsMaterial({
          size: 0.04,
          vertexColors: true,
          transparent: true,
          opacity: 0.6,
          blending: THREE.AdditiveBlending,
          depthWrite: false,
        }),
      ),
    );
  }

  return group;
}

// ─── RELATIVISTIC JETS ────────────────────────────────────────────────────────
export function createJets() {
  const group = new THREE.Group();
  [-1, 1].forEach((dir) => {
    const count = 800;
    const pos = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const t = Math.random();
      const y = dir * (1.5 + t * 12);
      const spread = Math.pow(t, 1.5) * 0.4;
      const angle = Math.random() * Math.PI * 2;
      pos[i * 3] = Math.cos(angle) * spread;
      pos[i * 3 + 1] = y;
      pos[i * 3 + 2] = Math.sin(angle) * spread;
      const intensity = Math.pow(1 - t, 1.2);
      colors[i * 3] = 0.3 * intensity;
      colors[i * 3 + 1] = 0.6 * intensity;
      colors[i * 3 + 2] = 1.0 * intensity;
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    group.add(
      new THREE.Points(
        geo,
        new THREE.PointsMaterial({
          size: 0.06,
          vertexColors: true,
          transparent: true,
          opacity: 0.7,
          blending: THREE.AdditiveBlending,
          depthWrite: false,
        }),
      ),
    );
    const core = new THREE.Mesh(
      new THREE.CylinderGeometry(0.04, 0.08, 13, 8, 1, true),
      new THREE.MeshBasicMaterial({
        color: 0x4fc3f7,
        transparent: true,
        opacity: 0.12,
        side: THREE.DoubleSide,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      }),
    );
    core.position.y = dir * 8;
    group.add(core);
  });
  return group;
}

// ─── APPLY MASS SCALE ─────────────────────────────────────────────────────────
export function applyMassScale(objects, mass, spin = 0) {
  const s = massScale(mass);
  const oblate = 1 - spin * 0.15;
  objects.blackHole.scale.set(s, s * oblate, s);
  objects.photonSphere.scale.set(s, s * oblate, s);
  objects.outerGlow.scale.setScalar(s);
  objects.photonRing.scale.setScalar(s);
  objects.einsteinRing.scale.setScalar(s);
}
