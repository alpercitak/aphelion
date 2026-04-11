import type { HTMLAttributes } from 'react';
import clsx from 'clsx';
import Hint from '../hint';
import TopBar from '../top-bar';
import styles from './index.module.css';

interface Props extends HTMLAttributes<HTMLDivElement> {
  className?: string;
}

export default function Hud({ children, className, title, subtitle, statsItems, hintItems, glossaryItems }: Props) {
  return (
    <div className={clsx(styles['hud'], className)}>
      <span className={clsx(styles['hud__corner'], styles['hud__corner--tl'])} />
      <span className={clsx(styles['hud__corner'], styles['hud__corner--tr'])} />
      <span className={clsx(styles['hud__corner'], styles['hud__corner--bl'])} />
      <span className={clsx(styles['hud__corner'], styles['hud__corner--br'])} />

      {hintItems && <Hint items={hintItems} />}
      <TopBar title={title} subtitle={subtitle} statsItems={statsItems} glossaryItems={glossaryItems} />

      {children}
    </div>
  );
}
