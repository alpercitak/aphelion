import { useMemo } from 'react';
import type { SceneLayoutControlsProps } from '@/components/app/scene-layout';
import type { ButtonProps } from '@/components/ui/button';
import type { RadioProps } from '@/components/ui/radio';
import type { SliderProps } from '@/components/ui/slider';
import type { ToggleProps } from '@/components/ui/toggle';
import { useSceneParams } from '../scene-params';

interface GenericButtonItem extends ButtonProps {}

interface GenericRadioItem<T> extends Omit<RadioProps, 'id' | 'value' | 'onChange'> {
  id: keyof T & string;
}

interface GenericSliderItem<T> extends Omit<SliderProps, 'id' | 'value' | 'onChange'> {
  id: keyof T & string;
}

interface GenericToggleItem<T> extends Omit<ToggleProps, 'id' | 'active' | 'onClick'> {
  id: keyof T & string;
}

interface SceneControlsProps<T> {
  sliders?: ReadonlyArray<GenericSliderItem<T>>;
  toggles?: ReadonlyArray<GenericToggleItem<T>>;
  radios?: ReadonlyArray<GenericRadioItem<T>>;
  buttons?: ReadonlyArray<GenericButtonItem>;
}

export const useSceneControls = <T extends object>(
  initialParams: T,
  { sliders, toggles, radios, buttons }: SceneControlsProps<T>,
) => {
  const { params, paramsRef, set } = useSceneParams<T>(initialParams);

  const controls = useMemo(
    (): SceneLayoutControlsProps => ({
      sliders: sliders?.map((item) => ({
        ...item,
        value: params[item.id] as number,
        onChange: (v: number) => set(item.id, v as T[keyof T]),
      })),
      toggles: toggles?.map((item) => ({
        ...item,
        active: params[item.id] as boolean,
        onClick: () => set(item.id, !params[item.id] as T[keyof T]),
      })),
      radios: radios?.map((item) => ({
        ...item,
        value: params[item.id] as string,
        onChange: (value: string) => set(item.id, value as T[keyof T]),
      })),
      buttons: (buttons ?? []).map((item) => item),
    }),
    [params, set, sliders, toggles, radios],
  );

  return { params, paramsRef, controls, set };
};
