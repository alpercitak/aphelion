import styles from './index.module.css';
import Button from '../button';

export interface ToggleProps {
  id: string;
  label: string;
  active: boolean;
  onClick: () => void;
}

export default function Toggle({ label, active, onClick }: ToggleProps) {
  return (
    <Button onClick={onClick} variant={active ? 'primary' : 'secondary'}>
      {label}
      <span className={styles['toggle__dot']} />
    </Button>
  );
}
