import { useMemo } from 'react';
import { schwarzschildRadius } from '@/utils/physics';
import type { Params } from '../types';
import { BASE_HUD_PROPS } from '../constants';

// Physical Constants
const G = 6.674e-11;
const Msun = 1.989e30;
const R_NS = 1e4;

export const useHud = (params: Params) =>
  useMemo(() => {
    const rs = schwarzschildRadius(params.mass);
    const hz = params.rpm / 60;

    const g = (G * params.mass * Msun) / (R_NS * R_NS);
    const gExponent = Math.floor(Math.log10(g));

    const stats = [
      { label: 'MASS', value: params.mass.toFixed(2), unit: 'M☉' },
      { label: 'FREQ', value: hz.toFixed(1), unit: 'Hz' },
      { label: 'PERIOD', value: hz > 0 ? (1 / hz).toFixed(3) : '—', unit: 's' },
      { label: 'g', value: `~10^${gExponent}`, unit: 'm/s²' },
      { label: 'Rₛ', value: rs.toFixed(1), unit: 'km' },
    ];

    return {
      ...BASE_HUD_PROPS,
      stats,
    };
  }, [params.mass, params.rpm]);
