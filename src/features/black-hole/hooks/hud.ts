import { useMemo } from 'react';
import { BASE_HUD_PROPS } from '../constants';
import type { Params } from '../types';
import { hawkingTemperature, schwarzschildRadius } from '@/utils/physics';

export const useHud = (params: Params) =>
  useMemo(() => {
    const rs = schwarzschildRadius(params.mass);
    const hTemp = hawkingTemperature(params.mass);

    const stats = [
      { label: 'mass', value: params.mass.toFixed(1), unit: 'M☉' },
      { label: 'spin', value: params.spin.toFixed(2), unit: 'a' },
      { label: 'temp', value: hTemp > 1e10 ? (hTemp / 1e10).toExponential(1) : '~0', unit: 'K' },
      { label: 'Rₛ', value: rs.toFixed(1), unit: 'km' },
    ];

    return {
      ...BASE_HUD_PROPS,
      stats,
    };
  }, [params.mass, params.spin]);
