import clsx from 'clsx';
import styles from './index.module.css';

export default function Panel({ children, className }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={clsx(styles['panel'], className)}>{children}</div>;
}
