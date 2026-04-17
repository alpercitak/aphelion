import {
  AdditiveBlending,
  BufferAttribute,
  BufferGeometry,
  ConeGeometry,
  DoubleSide,
  Group,
  Mesh,
  MeshBasicMaterial,
  Points,
  PointsMaterial,
} from 'three';
import { NS_RADIUS } from '../constants';

const BEAM_LENGTH = 12 as const;
const CONE_ANGLE_NARROW = 0.06 as const;
const CONE_ANGLE_WIDE = 0.14 as const;

export const createPulsarBeams = (beamWidth: string): Group => {
  const group = new Group();
  const coneAngle = beamWidth === 'narrow' ? CONE_ANGLE_NARROW : CONE_ANGLE_WIDE;

  [-1, 1].forEach((dir) => {
    // Cone volume
    const coneGeo = new ConeGeometry(coneAngle * BEAM_LENGTH, BEAM_LENGTH, 32, 1, true);
    const coneMat = new MeshBasicMaterial({
      color: 0x88ccff,
      transparent: true,
      opacity: 0.12,
      side: DoubleSide,
      blending: AdditiveBlending,
      depthWrite: false,
    });
    const cone = new Mesh(coneGeo, coneMat);
    cone.position.y = dir * BEAM_LENGTH * 0.5;
    cone.rotation.x = dir === 1 ? 0 : Math.PI;
    group.add(cone);

    // Core beam line particles
    const count = 300;
    const pos = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const t = Math.random();
      const spread = t * coneAngle * BEAM_LENGTH * 0.8;
      const angle = Math.random() * Math.PI * 2;
      pos[i * 3] = Math.cos(angle) * spread;
      pos[i * 3 + 1] = dir * (NS_RADIUS + t * BEAM_LENGTH);
      pos[i * 3 + 2] = Math.sin(angle) * spread;
      const brightness = Math.pow(1 - t, 1.5);
      colors[i * 3] = 0.4 * brightness;
      colors[i * 3 + 1] = 0.65 * brightness;
      colors[i * 3 + 2] = 1.0 * brightness;
    }
    const pGeo = new BufferGeometry();
    pGeo.setAttribute('position', new BufferAttribute(pos, 3));
    pGeo.setAttribute('color', new BufferAttribute(colors, 3));
    group.add(
      new Points(
        pGeo,
        new PointsMaterial({
          size: 0.05,
          vertexColors: true,
          transparent: true,
          opacity: 0.8,
          blending: AdditiveBlending,
          depthWrite: false,
        }),
      ),
    );
  });

  return group;
};
