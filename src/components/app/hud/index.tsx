import clsx from 'clsx';
import type { HTMLAttributes } from 'react';
import type { GlossarySection } from '../glossary';
import type { HintItem } from '../hint';
import type { StatsItem } from '../stats';
import styles from './index.module.css';

export interface HudProps extends HTMLAttributes<HTMLDivElement> {
  className?: string;
  title: string;
  subtitle: string;
  stats: ReadonlyArray<StatsItem>;
  glossary: ReadonlyArray<GlossarySection>;
  hints: ReadonlyArray<HintItem>;
  status?: string;
}

export default function Hud({ children, className }: HudProps) {
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
