import type { HTMLAttributes } from 'react';
import clsx from 'clsx';
import styles from './index.module.css';

interface TextProps extends HTMLAttributes<HTMLDivElement> {
  tooltip?: string;
  family?: 'body' | 'mono';
  size?: 'small' | 'medium' | 'large';
  color?: 'orange' | 'orange-light' | 'gray' | 'gray-light' | 'blue';
}

export default function Text({
  children,
  className,
  family = 'body',
  size = 'medium',
  color = 'orange',
  tooltip,
}: TextProps) {
  const clsName = clsx(
    styles['text'],
    styles[`text--family-${family}`],
    styles[`text--size-${size}`],
    styles[`text--color-${color}`],
    className,
  );
  return (
    <div className={clsName} data-tip={tooltip}>
      {children}
    </div>
  );
}
