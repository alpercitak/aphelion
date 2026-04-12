import styles from './index.module.css';

export default function Text({ children, tooltip }) {
  return (
    <div className={styles['text']} data-tip={tooltip}>
      {children}
    </div>
  );
}
