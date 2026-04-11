import clsx from 'clsx';
import styles from './index.module.css';

export interface ToggleProps {
  id: string;
  label: string;
  active: boolean;
  onClick: () => void;
}

export default function Toggle({ label, active, onClick }: ToggleProps) {
  return (
    <button className={clsx(styles['toggle'], active && styles['toggle--active'])} onClick={onClick} type="button">
      {label}
      <span className={styles['toggle__dot']} />
    </button>
  );
}
