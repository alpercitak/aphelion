import {
  AdditiveBlending,
  type BufferAttribute,
  Color,
  DoubleSide,
  type InterleavedBufferAttribute,
  Mesh,
  MeshBasicMaterial,
  ShaderMaterial,
  SphereGeometry,
} from 'three';
import { ERGOSPHERE_COLOR } from '../constants';
import type { SceneRef } from '../types';
import { ergosphereRadius, horizonRadius } from './kerr';

const FRESNEL_VERT = `
  varying vec3 vNormal;
  varying vec3 vViewDir;
  void main() {
    vec4 worldPos = modelMatrix * vec4(position, 1.0);
    vNormal = normalize(mat3(modelMatrix) * normal);
    vViewDir = normalize(cameraPosition - worldPos.xyz);
    gl_Position = projectionMatrix * viewMatrix * worldPos;
  }
`;

const FRESNEL_FRAG = `
  uniform vec3 glowColor;
  varying vec3 vNormal;
  varying vec3 vViewDir;
  void main() {
    float fresnel = pow(1.0 - abs(dot(normalize(vNormal), normalize(vViewDir))), 2.5);
    float intensity = 0.16 + fresnel * 0.9;
    gl_FragColor = vec4(glowColor * intensity, intensity * 0.6);
  }
`;

export const createSurfaces = () => {
  const horizonGeo = new SphereGeometry(1, 96, 64);
  const horizon = new Mesh(horizonGeo, new MeshBasicMaterial({ color: 0x000000 }));

  const ergosphere = new Mesh(
    new SphereGeometry(1, 96, 64),
    new ShaderMaterial({
      uniforms: { glowColor: { value: new Color(ERGOSPHERE_COLOR) } },
      vertexShader: FRESNEL_VERT,
      fragmentShader: FRESNEL_FRAG,
      side: DoubleSide,
      blending: AdditiveBlending,
      transparent: true,
      depthWrite: false,
    }),
  );

  const unit = Float32Array.from(horizonGeo.getAttribute('position').array);
  return { horizon, ergosphere, unit };
};

/**
 * Maps each unit-sphere vertex to Kerr coordinates: x = √(r²+a²) sinθ cosφ, y = r cosθ, z = √(r²+a²) sinθ sinφ.
 * The unit direction gives sinθ cosφ and cosθ directly, so the mapping needs no trigonometry.
 */
const placeSurface = (
  attr: BufferAttribute | InterleavedBufferAttribute,
  unit: Float32Array,
  a: number,
  radiusAt: (cosTheta: number) => number,
) => {
  for (let i = 0; i < attr.count; i++) {
    const ux = unit[i * 3] ?? 0;
    const uy = unit[i * 3 + 1] ?? 0;
    const uz = unit[i * 3 + 2] ?? 0;
    const r = radiusAt(uy);
    const horizontal = Math.sqrt(r * r + a * a);
    attr.setXYZ(i, horizontal * ux, r * uy, horizontal * uz);
  }
  attr.needsUpdate = true;
};

/** Reshapes both surfaces in place for spin a. */
export const shapeSurfaces = (entities: Pick<SceneRef['entities'], 'horizon' | 'ergosphere' | 'unit'>, a: number) => {
  const { horizon, ergosphere, unit } = entities;
  const rPlus = horizonRadius(a);
  placeSurface(horizon.geometry.getAttribute('position'), unit, a, () => rPlus);
  placeSurface(ergosphere.geometry.getAttribute('position'), unit, a, (cosTheta) => ergosphereRadius(a, cosTheta));

  for (const mesh of [horizon, ergosphere]) {
    mesh.geometry.computeVertexNormals();
    mesh.geometry.computeBoundingSphere();
  }
};
