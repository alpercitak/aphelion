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
  {
    id: 'cosmic-string',
    title: 'Cosmic String',
    subtitle: 'Topological Defect',
    description: 'A relic of the early universe. Infinite, thin, and conical spacetime.',
    component: lazy(() => import('@/features/cosmic-string')),
  },
  {
    id: 'supernova',
    title: 'Supernova',
    subtitle: 'Core Collapse · Shockwave',
    description: 'Stellar explosion sequence: collapse, shockwave, ejecta, and remnant.',
    component: lazy(() => import('@/features/supernova')),
  },
  {
    id: 'tidal-disruption',
    title: 'Tidal Disruption',
    subtitle: 'Spaghettification · Fallback',
    description: 'A star torn apart by a supermassive black hole. Debris stream, fallback and accretion disk.',
    component: lazy(() => import('@/features/tidal-disruption')),
  },
  {
    id: 'ergosphere',
    title: 'Ergosphere',
    subtitle: 'Kerr Metric · Penrose Process',
    description:
      'A spinning black hole drags spacetime around. Inside the ergosphere nothing stands still, and energy can be extracted.',
    component: lazy(() => import('@/features/ergosphere')),
  },
  {
    id: 'kilonova',
    title: 'Kilonova',
    subtitle: 'Neutron Star Merger · r-Process',
    description:
      'Two neutron stars spiral together and merge. Their r-process ejecta glows blue, then red, as heavy elements form.',
    component: lazy(() => import('@/features/kilonova')),
  },
  {
    id: 'x-ray-binary',
    title: 'X-ray Binary',
    subtitle: 'Roche-Lobe Overflow · Accretion',
    description:
      'A donor star fills its Roche lobe and feeds a compact companion through an accretion disk that glows in X-rays.',
    component: lazy(() => import('@/features/x-ray-binary')),
  },
];

export const getScene = (id: string) => {
  return SCENES.find((s) => s.id === id);
};
