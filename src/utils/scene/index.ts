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
  {
    id: 'white-hole',
    title: 'White Hole',
    subtitle: 'Time-Reversed Singularity',
    description: 'Matter only exits. The inverse of a black hole.',
    component: lazy(() => import('@/features/white-hole')),
  },
  {
    id: 'hawking-evaporation',
    title: 'Hawking Evaporation',
    subtitle: 'Quantum Decay',
    description: 'Virtual particle pairs at the horizon. A micro black hole evaporates.',
    component: lazy(() => import('@/features/hawking-evaporation')),
  },
  {
    id: 'lensing-field',
    title: 'Lensing Field',
    subtitle: 'Gravitational Optics',
    description: 'Invisible mass bending starlight. Einstein rings and dark matter mapping.',
    component: lazy(() => import('@/features/lensing-field')),
  },
];

export const getScene = (id: string) => {
  return SCENES.find((s) => s.id === id);
};
