import styles from './index.module.css';

export interface HintItem {
  title: string;
  values?: Array<string>;
}

interface HintsProps {
  items: ReadonlyArray<HintItem>;
}

export default function Hints({ items }: HintsProps) {
  return (
    <div className={styles['hints']}>
      {items.map((item, index) => (
        <div key={`hints-${index}`}>
          <div className={styles['hints__item-title']}>{item.title}</div>
          {item.values?.map((value, itemIndex) => (
            <div key={`hints__item-${index}-${itemIndex}`}>{value}</div>
          ))}
        </div>
      ))}
      {items.length > 0 && <br />}
      <div>Drag to orbit</div>
      <div>Scroll to zoom</div>
    </div>
  );
}
