import { lazy } from 'react';

export const SCENES = [
  {
    id: 'black-hole',
    title: 'BLACK HOLE',
    subtitle: 'Schwarzschild · Kerr Metric',
    description: 'Event horizon, accretion disk, relativistic jets and gravitational lensing.',
    status: 'available',
    component: lazy(() => import('@/features/black-hole')),
  },
  {
    id: 'binary-merger',
    title: 'BINARY MERGER',
    subtitle: 'Gravitational Waves',
    description: 'Two black holes in decaying orbit. The LIGO moment visualized.',
    status: 'available',
    component: lazy(() => import('@/features/binary-merger')),
  },
  {
    id: 'neutron-star',
    title: 'NEUTRON STAR',
    subtitle: 'TOV Limit · Pulsar Beam',
    description: 'Extreme density and rapid rotation. Visualizing degenerate matter and lighthouse effects.',
    status: 'available',
    component: lazy(() => import('@/features/neutron-star')),
  },
];

export const getScene = (id: string) => {
  return SCENES.find((s) => s.id === id);
};
