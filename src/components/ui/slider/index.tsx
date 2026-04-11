import type { CSSProperties } from 'react';
import styles from './index.module.css';

export interface SliderProps {
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

export default function Slider({ label, tooltip, value, min, max, step, format, onChange }: SliderProps) {
  const percentage = ((value - min) / (max - min)) * 100;

  return (
    <div className={styles['slider']}>
      <div className={styles['slider__header']}>
        <span className={styles['slider__label']} data-tip={tooltip}>
          {label}
        </span>
        <span className={styles['slider__value']}>{format(value)}</span>
      </div>
      <div className={styles['slider__track-wrapper']}>
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          style={{ '--pct': `${percentage}%` } as CSSProperties}
          onChange={(e) => onChange(parseFloat(e.target.value))}
        />
      </div>
    </div>
  );
}
