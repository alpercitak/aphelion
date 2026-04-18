import { AdditiveBlending, BackSide, Color, Mesh, ShaderMaterial, SphereGeometry, Vector3 } from 'three';
import { FRESNEL_FRAGMENT_SHADER, FRESNEL_VERTEX_SHADER } from './constants';

// Faint expanding nebula shell — Fresnel glow
export const createNebula = (radius: number): Mesh<SphereGeometry, ShaderMaterial> =>
  new Mesh(
    new SphereGeometry(radius, 48, 48),
    new ShaderMaterial({
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
