import { AdditiveBlending, BackSide, Mesh, MeshBasicMaterial, SphereGeometry } from 'three';
import { tempToColor } from '@/utils/physics';

export const createEjectaShell = (radius: number, temp: number): Mesh<SphereGeometry, MeshBasicMaterial> =>
  new Mesh(
    new SphereGeometry(radius, 64, 32),
    new MeshBasicMaterial({
      color: tempToColor(temp),
      transparent: true,
      opacity: 0.12,
      side: BackSide,
      blending: AdditiveBlending,
      depthWrite: false,
    }),
  );
