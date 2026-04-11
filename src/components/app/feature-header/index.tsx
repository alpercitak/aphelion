import { useNavigate } from 'react-router-dom';
import styles from './index.module.css';

interface FeatureHeaderProps {
  title: string;
  subtitle: string;
}

export default function FeatureHeader({ title, subtitle }: FeatureHeaderProps) {
  const navigate = useNavigate();
  return (
    <div className={styles['feature-header']}>
      <div>
        <h1 className={styles['feature-header__title']}>{title}</h1>
        {/* <button className={styles.glossaryBtn} onClick={() => setGlossaryOpen((o) => !o)}>
          ?
        </button> */}
      </div>
      <div className={styles['feature-header__subtitle']}>{subtitle}</div>
      <button className={styles['feature-header__back']} onClick={() => navigate('/')}>
        ← APHELION
      </button>
    </div>
  );
}
