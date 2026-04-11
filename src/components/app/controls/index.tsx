import type { CSSProperties } from 'react';
import Slider from '@/components/ui/slider';
import styles from './index.module.css';
import SliderGroup from '@/components/ui/slider-group';

interface SliderProps {
  id: string;
  label: string;
  tooltip: string;
  value: number;
  min: number;
  max: number;
  step: number;
  format: (val: number) => string;
  onChange: (val: number) => void;
}

interface ToggleProps {
  id: string;
  label: string;
  active: boolean;
  onClick: () => void;
}

interface ControlsProps {
  sliders?: Array<SliderProps>;
  toggles?: Array<ToggleProps>;
}

function Toggle({ label, active, onClick }: Omit<ToggleProps, 'id'>) {
  return (
    <button className={`${styles.toggleBtn} ${active ? styles.active : ''}`} onClick={onClick} type="button">
      {label}
      <span className={styles.toggleDot} />
    </button>
  );
}

export default function Controls({ sliders = [], toggles = [] }: ControlsProps) {
  return (
    <div className={styles.panel}>
      <SliderGroup items={sliders} />

      {toggles.length > 0 && (
        <div className={styles.toggles}>
          {toggles.map((t) => (
            <Toggle key={t.id} label={t.label} active={t.active} onClick={t.onClick} />
          ))}
        </div>
      )}
    </div>
  );
}
