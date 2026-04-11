import type { ReactNode } from 'react';
import styles from './index.module.css';

interface StatsItem {
  label: string | ReactNode;
  value: string;
  unit?: string;
}

interface StatsProps {
  items: Array<StatsItem>;
}

export default function Stats({ items = [] }: StatsProps) {
  return (
    <div className={styles.stats}>
      {items.map(({ label, value, unit }) => (
        <div className={styles['stats__item']}>
          <span className={styles['stats__item-label']}>{label}</span>
          <span className={styles['stats__item-value']}>{value}</span>
          {unit && <span>{unit}</span>}
        </div>
      ))}
    </div>
  );
}
