import type { ButtonProps } from '@/components/ui/button';
import ButtonGroup from '@/components/ui/button-group';
import Panel from '@/components/ui/panel';
import type { RadioProps } from '@/components/ui/radio';
import RadioGroup from '@/components/ui/radio-group';
import type { SliderProps } from '@/components/ui/slider';
import SliderGroup from '@/components/ui/slider-group';
import Text from '@/components/ui/text';
import type { ToggleProps } from '@/components/ui/toggle';
import ToggleGroup from '@/components/ui/toggle-group';
import styles from './index.module.css';

export interface ControlsProps {
  sliders?: Array<SliderProps>;
  toggles?: Array<ToggleProps>;
  radios?: Array<RadioProps>;
  buttons?: Array<ButtonProps>;
}

export default function Controls({ sliders, toggles, radios, buttons }: ControlsProps) {
  return (
    <Panel className={styles['controls']} title="Parameters">
      <Text className={styles['controls__header']}>Parameters</Text>
      {sliders && <SliderGroup items={sliders} />}
      {radios && <RadioGroup items={radios} />}
      {toggles && <ToggleGroup items={toggles} />}
      {buttons && <ButtonGroup items={buttons} />}
    </Panel>
  );
}
