import { useNavigate } from 'react-router-dom';
import Button from '@/components/ui/button';
import styles from './index.module.css';

interface HeaderProps {
  title: string;
  subtitle: string;
  onGlossaryClick: () => void;
}

export default function Header({ title, subtitle, onGlossaryClick }: HeaderProps) {
  const navigate = useNavigate();

  return (
    <div className={styles['header']}>
      <div className={styles['header__title-wrapper']}>
        <h1 className={styles['header__title']}>{title}</h1>
        <Button onClick={onGlossaryClick}>?</Button>
      </div>
      <div className={styles['header__subtitle']}>{subtitle}</div>
      <Button variant="tertiary" onClick={() => navigate('/')}>
        ← APHELION
      </Button>
    </div>
  );
}
