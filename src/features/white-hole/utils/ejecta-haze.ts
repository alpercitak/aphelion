import { massScale } from '@/utils/physics';
import { AdditiveBlending, BackSide, Mesh, MeshBasicMaterial, SphereGeometry } from 'three';

// Ejecta haze — large semi-transparent sphere surrounding the white hole
export const createEjectaHaze = (mass: number): Mesh<SphereGeometry, MeshBasicMaterial> => {
  const s = massScale(mass) * 0.9 * 4.5;
  return new Mesh(
    new SphereGeometry(s, 48, 48),
    new MeshBasicMaterial({
      color: 0xffcc44,
      transparent: true,
      opacity: 0.04,
      side: BackSide,
      blending: AdditiveBlending,
      depthWrite: false,
    }),
  );
};
