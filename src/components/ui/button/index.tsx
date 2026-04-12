import type { HTMLAttributes } from 'react';
import clsx from 'clsx';
import styles from './index.module.css';

export interface ButtonProps extends HTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'tertiary';
}

export default function Button({ variant = 'primary', className, children, ...rest }: ButtonProps) {
  return (
    <button type="button" className={clsx(styles['button'], styles[`button--${variant}`], className)} {...rest}>
      {children}
    </button>
  );
}
