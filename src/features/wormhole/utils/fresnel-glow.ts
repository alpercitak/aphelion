import { AdditiveBlending, type BackSide, Color, type FrontSide, Mesh, SphereGeometry, type Vector3 } from 'three';
import { createShaderMaterial } from '@/utils/shader';
import { FRESNEL_FRAGMENT_SHADER, FRESNEL_VERTEX_SHADER } from './constants';

export const createFresnelGlow = (
  cameraPos: Vector3,
  color: number,
  radius: number,
  side: typeof FrontSide | typeof BackSide,
  power = 3.5,
) =>
  new Mesh(
    new SphereGeometry(radius, 64, 64),
    createShaderMaterial({
      uniforms: {
        glowColor: { value: new Color(color) },
        viewVector: { value: cameraPos.clone() },
        power: { value: power },
      },
      vertexShader: FRESNEL_VERTEX_SHADER,
      fragmentShader: FRESNEL_FRAGMENT_SHADER,
      side,
      blending: AdditiveBlending,
      transparent: true,
      depthWrite: false,
    }),
  );
