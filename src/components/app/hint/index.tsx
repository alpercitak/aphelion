import styles from './index.module.css';

export interface HintItem {
  title: string;
  values?: Array<string>;
}

interface HintProps {
  items: ReadonlyArray<HintItem>;
}

export default function Hint({ items }: HintProps) {
  return (
    <div className={styles['hint']}>
      {items.map((item) => (
        <div>
          <div className={styles['hint__title']}>{item.title}</div>
          {item.values?.map((value) => (
            <div>{value}</div>
          ))}
        </div>
      ))}
      {items.length > 0 && <br />}
      <div>Drag to orbit</div>
      <div>Scroll to zoom</div>
    </div>
  );
}
