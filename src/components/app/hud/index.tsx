import clsx from 'clsx';
import styles from './index.module.css';

export default function Hud({ children, className }) {
  return (
    <div className={clsx(styles['hud'], className)}>
      <span className={clsx(styles['hud__corner'], styles['hud__corner--tl'])} />
      <span className={clsx(styles['hud__corner'], styles['hud__corner--tr'])} />
      <span className={clsx(styles['hud__corner'], styles['hud__corner--bl'])} />
      <span className={clsx(styles['hud__corner'], styles['hud__corner--br'])} />

      {children}
    </div>
  );
}
