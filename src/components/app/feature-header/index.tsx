import { useNavigate } from 'react-router-dom';
import styles from './index.module.css';

interface FeatureHeaderProps {
  title: string;
  subtitle: string;
  onGlossaryClick: () => void;
}

export default function FeatureHeader({ title, subtitle, onGlossaryClick }: FeatureHeaderProps) {
  const navigate = useNavigate();
  return (
    <div className={styles['feature-header']}>
      <div className={styles['feature-header__title-wrapper']}>
        <h1 className={styles['feature-header__title']}>{title}</h1>
        <button className={styles['feature-header__glossary-button']} onClick={() => onGlossaryClick()}>
          ?
        </button>
      </div>
      <div className={styles['feature-header__subtitle']}>{subtitle}</div>
      <button className={styles['feature-header__back']} onClick={() => navigate('/')}>
        ← APHELION
      </button>
    </div>
  );
}
