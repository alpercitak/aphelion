import Slider, { type SliderProps } from '@/components/ui/slider';
import styles from './index.module.css';

export interface SliderGroupProps {
  items: Array<SliderProps>;
}

export default function SliderGroup({ items }: SliderGroupProps) {
  if (items.length === 0) {
    return null;
  }

  return (
    <div className={styles['slider-group']}>
      {items.map((item) => (
        <Slider key={item.id} {...item} />
      ))}
    </div>
  );
}
