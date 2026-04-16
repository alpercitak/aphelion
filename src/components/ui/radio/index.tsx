import Button from '@/components/ui/button';
import styles from './index.module.css';
import Text from '../text';
import clsx from 'clsx';

interface RadioOption {
  id: string;
  label: string;
}

export interface RadioProps {
  id: string;
  options: Array<RadioOption>;
  value: string;
  onChange: (value: string) => void;
  label?: string;
  labelTooltip?: string;
  className?: string;
}

export default function Radio({ options, value, onChange, label, labelTooltip, className }: RadioProps) {
  return (
    <div className={clsx(styles['radio'], className)}>
      {label && (
        <Text color="gray" family="mono" tooltip={labelTooltip}>
          {label}
        </Text>
      )}
      <div className={styles['radio__options']}>
        {options.map((option) => {
          const isActive = option.id === value;
          return (
            <Button key={option.id} variant={isActive ? 'primary' : 'secondary'} onClick={() => onChange(option.id)}>
              {option.label}
            </Button>
          );
        })}
      </div>
    </div>
  );
}
