import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Glossary from '../glossary';
import styles from './index.module.css';

interface FeatureHeaderProps {
  title: string;
  subtitle: string;
  onGlossaryClick: () => void;
}

export default function FeatureHeader({ title, subtitle, glossaryItems }: FeatureHeaderProps) {
  const navigate = useNavigate();
  const [glossaryOpen, setGlossaryOpen] = useState(false);

  return (
    <div className={styles['feature-header']}>
      <div className={styles['feature-header__title-wrapper']}>
        <h1 className={styles['feature-header__title']}>{title}</h1>
        <button className={styles['feature-header__glossary-button']} onClick={() => setGlossaryOpen((o) => !o)}>
          ?
        </button>
      </div>
      <div className={styles['feature-header__subtitle']}>{subtitle}</div>
      <button className={styles['feature-header__back']} onClick={() => navigate('/')}>
        ← APHELION
      </button>
      <Glossary isOpen={glossaryOpen} entries={glossaryItems} onClose={() => setGlossaryOpen(false)} />
    </div>
  );
}
