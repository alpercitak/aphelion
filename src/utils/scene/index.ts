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
];

export const getScene = (id: string) => {
  return SCENES.find((s) => s.id === id);
};
