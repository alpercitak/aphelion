import type { HTMLAttributes } from 'react';
import styles from './index.module.css';

interface TextProps extends HTMLAttributes<HTMLDivElement> {
  tooltip?: string;
}

export default function Text({ children, tooltip }: TextProps) {
  return (
    <div className={styles['text']} data-tip={tooltip}>
      {children}
    </div>
  );
}
