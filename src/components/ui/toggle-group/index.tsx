import Toggle, { type ToggleProps } from '@/components/ui/toggle';
import styles from './index.module.css';

export interface ToggleGroupProps {
  items: Array<ToggleProps>;
}

export default function ToggleGroup({ items }: ToggleGroupProps) {
  if (items.length === 0) {
    return null;
  }

  return (
    <div className={styles['toggle-group']}>
      {items.map((item) => (
        <Toggle key={item.id} {...item} />
      ))}
    </div>
  );
}
