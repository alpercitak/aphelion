import { AdditiveBlending, Color, DoubleSide, Mesh, TorusGeometry, Vector3 } from 'three';
import { createShaderMaterial } from '@/utils/shader';
import { FRESNEL_FRAGMENT_SHADER, FRESNEL_VERTEX_SHADER } from './constants';

// Torus rim — the visible edge of the throat
export const createThroatRim = (radius: number) => {
  const geo = new TorusGeometry(radius, radius * 0.04, 32, 128);
  const mat = createShaderMaterial({
    uniforms: {
      glowColor: { value: new Color(0xaaccff) },
      viewVector: { value: new Vector3(0, 0, 5) },
      power: { value: 2.0 },
    },
    vertexShader: FRESNEL_VERTEX_SHADER,
    fragmentShader: FRESNEL_FRAGMENT_SHADER,
    blending: AdditiveBlending,
    transparent: true,
    depthWrite: false,
    side: DoubleSide,
  });
  return new Mesh(geo, mat);
};
