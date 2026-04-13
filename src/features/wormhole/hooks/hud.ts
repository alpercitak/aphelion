import { useMemo } from 'react';
import { BASE_HUD_PROPS, DESTINATION_LABEL_MAP } from '../constants';
import type { Params } from '../types';

export const useHud = (params: Params) =>
  useMemo(() => {
    const stats = [
      { label: 'THROAT', value: params.throatRadius.toFixed(2), unit: 'r₀' },
      { label: 'EXOTIC', value: params.exoticDensity.toFixed(2), unit: 'ρ' },
      { label: 'DEST', value: DESTINATION_LABEL_MAP[params.destination].toUpperCase() },
      { label: 'STATUS', value: 'THEORETICAL' },
    ];

    return {
      ...BASE_HUD_PROPS,
      stats,
    };
  }, [params.throatRadius, params.exoticDensity, params.destination]);
