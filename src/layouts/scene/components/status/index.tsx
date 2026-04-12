import styles from './index.module.css';

export default function Status({ status }: { status: string }) {
  return <div className={styles['status']}>{status}</div>;
}
