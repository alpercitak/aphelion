import { AdditiveBlending, BackSide, Color, Mesh, SphereGeometry, Vector3 } from 'three';
import type { TypedShaderMaterial } from '@/types';
import { createShaderMaterial } from '@/utils/shader';
import type { NebulaUniforms } from '../types';
import { FRESNEL_FRAGMENT_SHADER, FRESNEL_VERTEX_SHADER } from './constants';

// Faint expanding nebula shell — Fresnel glow
export const createNebula = (radius: number): Mesh<SphereGeometry, TypedShaderMaterial<NebulaUniforms>> =>
  new Mesh(
    new SphereGeometry(radius, 48, 48),
    createShaderMaterial({
      uniforms: {
        glowColor: { value: new Color(0x4488ff) },
        viewVector: { value: new Vector3(0, 0, 6) },
      },
      vertexShader: FRESNEL_VERTEX_SHADER,
      fragmentShader: FRESNEL_FRAGMENT_SHADER,
      side: BackSide,
      blending: AdditiveBlending,
      transparent: true,
      depthWrite: false,
    }),
  );
