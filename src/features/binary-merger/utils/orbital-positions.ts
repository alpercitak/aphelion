interface OrbitalPositions {
  x1: number;
  z1: number;
  x2: number;
  z2: number;
}

export const orbitalPositions = (angle: number, separation: number): OrbitalPositions => {
  const r = separation / 2;
  const cx = Math.cos(angle) * r;
  const cz = Math.sin(angle) * r;
  return { x1: cx, z1: cz, x2: -cx, z2: -cz };
};
