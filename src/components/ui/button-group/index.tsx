import Button, { type ButtonProps } from '@/components/ui/button';
import styles from './index.module.css';

export interface ButtonGroupProps {
  items: Array<ButtonProps>;
}

export default function ButtonGroup({ items }: ButtonGroupProps) {
  if (items.length === 0) {
    return null;
  }

  return (
    <div className={styles['button-group']}>
      {items.map((item, index) => (
        <Button key={`${item.id}-${index}`} {...item} />
      ))}
    </div>
  );
}
