import Radio, { type RadioProps } from '@/components/ui/radio';
import styles from './index.module.css';

export interface RadioGroupProps {
  items: Array<RadioProps>;
}

export default function RadioGroup({ items }: RadioGroupProps) {
  if (items.length === 0) {
    return null;
  }

  return (
    <div className={styles['toggle-group']}>
      {items.map((item) => (
        <Radio key={item.id} {...item} />
      ))}
    </div>
  );
}
