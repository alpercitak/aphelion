import { AdditiveBlending, BackSide, Color, FrontSide, Mesh, ShaderMaterial, SphereGeometry, Vector3 } from 'three';
import { FRESNEL_FRAGMENT_SHADER, FRESNEL_VERTEX_SHADER } from './constants';

export const createFresnelGlow = (
  cameraPos: Vector3,
  color: number,
  radius: number,
  side: typeof FrontSide | typeof BackSide,
  power = 3.5,
): Mesh<SphereGeometry, ShaderMaterial> =>
  new Mesh(
    new SphereGeometry(radius, 64, 64),
    new ShaderMaterial({
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
