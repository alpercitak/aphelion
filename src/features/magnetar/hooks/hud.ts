import { useMemo } from 'react';
import { BASE_HUD_PROPS } from '../constants';
import type { Params } from '../types';

export const useHud = (params: Params) =>
  useMemo(() => {
    const fieldGauss = `10^${(13 + params.fieldStrength).toFixed(1)}`;
    const tempMK = (params.surfaceTemp / 1e6).toFixed(0);

    const stats = [
      { label: 'FIELD', value: fieldGauss, unit: 'G' },
      { label: 'TEMP', value: `${tempMK}`, unit: 'MK' },
      { label: 'RADIUS', value: '~10', unit: 'km' },
      { label: 'SPIN', value: '~0.1-10', unit: 'RPM' },
    ];

    return {
      ...BASE_HUD_PROPS,
      stats,
    };
  }, [params.fieldStrength, params.surfaceTemp]);
