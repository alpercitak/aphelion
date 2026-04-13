import { useMemo } from 'react';
import type { SceneLayoutControlsProps } from '@/components/app/scene-layout';
import { useSceneParams } from '@/hooks/scene-params';
import { RADIO_ITEMS, SLIDER_ITEMS, TOGGLE_ITEMS } from '../constants';
import type { Params } from '../types';

export function useControls(initialState: Params) {
  const { params, paramsRef, set } = useSceneParams<Params>(initialState);

  const controls = useMemo(
    (): SceneLayoutControlsProps => ({
      sliders: SLIDER_ITEMS.map((item) => ({
        ...item,
        value: params[item.id],
        onChange: (v: number) => set(item.id, v),
      })),
      radios: RADIO_ITEMS.map((item) => ({
        ...item,
        value: params[item.id],
        onChange: (v: string) => set(item.id, v),
      })),
      toggles: TOGGLE_ITEMS.map((item) => ({
        ...item,
        active: params[item.id],
        onClick: () => set(item.id, !params[item.id]),
      })),
    }),
    [params, set],
  );

  return { params, paramsRef, controls };
}
