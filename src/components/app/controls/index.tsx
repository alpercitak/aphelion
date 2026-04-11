import Panel from '@/components/ui/panel';
import SliderGroup from '@/components/ui/slider-group';
import ToggleGroup from '@/components/ui/toggle-group';
import type { SliderProps } from '@/components/ui/slider';
import type { ToggleProps } from '@/components/ui/toggle';
import styles from './index.module.css';

interface ControlsProps {
  sliders: Array<SliderProps>;
  toggles: Array<ToggleProps>;
}

export default function Controls({ sliders, toggles }: ControlsProps) {
  return (
    <Panel className={styles['controls']}>
      <SliderGroup items={sliders} />
      <ToggleGroup items={toggles} />
    </Panel>
  );
}
