import type { CSSProperties } from 'react';
import styles from './index.module.css';

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

function Slider({ label, tooltip, value, min, max, step, format, onChange }: SliderProps) {
  const pct = ((value - min) / (max - min)) * 100;

  return (
    <div className={styles.param}>
      <div className={styles.paramHeader}>
        <span className={styles.paramLabel} data-tip={tooltip}>
          {label}
        </span>
        <span className={styles.paramValue}>{format(value)}</span>
      </div>
      <div className={styles.trackWrap}>
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          style={{ '--pct': `${pct}%` } as CSSProperties}
          onChange={(e) => onChange(parseFloat(e.target.value))}
        />
      </div>
    </div>
  );
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
      {sliders.map((s) => (
        <Slider key={s.id} {...s} />
      ))}

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
