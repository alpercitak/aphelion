import Panel from '@/components/ui/panel';
import ButtonGroup from '@/components/ui/button-group';
import RadioGroup from '@/components/ui/radio-group';
import SliderGroup from '@/components/ui/slider-group';
import ToggleGroup from '@/components/ui/toggle-group';
import Text from '@/components/ui/text';
import type { ButtonProps } from '@/components/ui/button';
import type { RadioProps } from '@/components/ui/radio';
import type { SliderProps } from '@/components/ui/slider';
import type { ToggleProps } from '@/components/ui/toggle';
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
