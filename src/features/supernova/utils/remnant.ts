import {
  AdditiveBlending,
  Color,
  FrontSide,
  Mesh,
  MeshBasicMaterial,
  ShaderMaterial,
  SphereGeometry,
  Vector3,
} from 'three';
import type { RemnantType } from '../types';
import { FRESNEL_FRAGMENT_SHADER, FRESNEL_VERTEX_SHADER } from './constants';

// Remnant type based on progenitor mass
export const getRemnantType = (mass: number): RemnantType => {
  if (mass > 130) {
    return 'none'; // pair instability — no remnant
  }
  if (mass > 25) {
    return 'black-hole';
  }
  return 'neutron-star';
};

// Compact remnant — neutron star or black hole
export const createRemnant = (type: RemnantType): Mesh<SphereGeometry, MeshBasicMaterial | ShaderMaterial> => {
  if (type === 'black-hole') {
    return new Mesh(new SphereGeometry(0.12, 32, 32), new MeshBasicMaterial({ color: 0x000000 }));
  }
  // Neutron star — bright blue-white
  return new Mesh(
    new SphereGeometry(0.06, 32, 32),
    new ShaderMaterial({
      uniforms: {
        glowColor: { value: new Color(0x99bbff) },
        viewVector: { value: new Vector3(0, 0, 6) },
      },
      vertexShader: FRESNEL_VERTEX_SHADER,
      fragmentShader: FRESNEL_FRAGMENT_SHADER,
      side: FrontSide,
      blending: AdditiveBlending,
      transparent: true,
      depthWrite: false,
    }),
  );
};
