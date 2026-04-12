import Panel from '@/components/ui/panel';
import RadioGroup from '@/components/ui/radio-group';
import SliderGroup from '@/components/ui/slider-group';
import ToggleGroup from '@/components/ui/toggle-group';
import type { RadioProps } from '@/components/ui/radio';
import type { SliderProps } from '@/components/ui/slider';
import type { ToggleProps } from '@/components/ui/toggle';
import styles from './index.module.css';

export interface ControlsProps {
  sliders?: Array<SliderProps>;
  toggles?: Array<ToggleProps>;
  radios?: Array<RadioProps>;
}

export default function Controls({ sliders, toggles, radios }: ControlsProps) {
  return (
    <Panel className={styles['controls']}>
      {sliders && <SliderGroup items={sliders} />}
      {radios && <RadioGroup items={radios} />}
      {toggles && <ToggleGroup items={toggles} />}
    </Panel>
  );
}
