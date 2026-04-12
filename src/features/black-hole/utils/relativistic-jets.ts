import {
  AdditiveBlending,
  BufferAttribute,
  BufferGeometry,
  CylinderGeometry,
  DoubleSide,
  Group,
  Mesh,
  MeshBasicMaterial,
  Points,
  PointsMaterial,
} from 'three';

export const createRelativisticJets = (): Group => {
  const group = new Group();

  [-1, 1].forEach((dir) => {
    const count = 800;
    const pos = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const t = Math.random();
      const y = dir * (1.5 + t * 12);
      const spread = Math.pow(t, 1.5) * 0.4;
      const angle = Math.random() * Math.PI * 2;
      pos[i * 3] = Math.cos(angle) * spread;
      pos[i * 3 + 1] = y;
      pos[i * 3 + 2] = Math.sin(angle) * spread;
      const intensity = Math.pow(1 - t, 1.2);
      colors[i * 3] = 0.3 * intensity;
      colors[i * 3 + 1] = 0.6 * intensity;
      colors[i * 3 + 2] = 1.0 * intensity;
    }
    const geo = new BufferGeometry();
    geo.setAttribute('position', new BufferAttribute(pos, 3));
    geo.setAttribute('color', new BufferAttribute(colors, 3));
    group.add(
      new Points(
        geo,
        new PointsMaterial({
          size: 0.06,
          vertexColors: true,
          transparent: true,
          opacity: 0.7,
          blending: AdditiveBlending,
          depthWrite: false,
        }),
      ),
    );
    const core = new Mesh(
      new CylinderGeometry(0.04, 0.08, 13, 8, 1, true),
      new MeshBasicMaterial({
        color: 0x4fc3f7,
        transparent: true,
        opacity: 0.12,
        side: DoubleSide,
        blending: AdditiveBlending,
        depthWrite: false,
      }),
    );
    core.position.y = dir * 8;
    group.add(core);
  });

  return group;
};
