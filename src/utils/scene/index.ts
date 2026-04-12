import { lazy } from 'react';

export const SCENES = [
  {
    id: 'black-hole',
    title: 'BLACK HOLE',
    subtitle: 'Schwarzschild · Kerr Metric',
    description: 'Event horizon, accretion disk, relativistic jets and gravitational lensing.',
    component: lazy(() => import('@/features/black-hole')),
  },
  {
    id: 'binary-merger',
    title: 'BINARY MERGER',
    subtitle: 'Gravitational Waves',
    description: 'Two black holes in decaying orbit. The LIGO moment visualized.',
    component: lazy(() => import('@/features/binary-merger')),
  },
  {
    id: 'neutron-star',
    title: 'NEUTRON STAR',
    subtitle: 'TOV Limit · Pulsar Beam',
    description: 'Extreme density and rapid rotation. Visualizing degenerate matter and lighthouse effects.',
    component: lazy(() => import('@/features/neutron-star')),
  },
  {
    id: 'magnetar',
    title: 'Magnetar',
    subtitle: '10¹⁵ Gauss · Starquakes',
    description: 'Extreme magnetic field, starquakes, and gamma ray bursts.',
    component: lazy(() => import('@/features/magnetar')),
  },
  {
    id: 'wormhole',
    title: 'Wormhole',
    subtitle: 'Einstein-Rosen Bridge',
    description: 'Traversable spacetime shortcut with lensed view through the throat.',
    component: lazy(() => import('@/features/wormhole')),
  },
];

export const getScene = (id: string) => {
  return SCENES.find((s) => s.id === id);
};
