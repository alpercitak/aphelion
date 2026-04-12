import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '@/components/ui/button';
import Glossary from '@/components/app/glossary';
import styles from './index.module.css';

interface FeatureHeaderProps {
  title: string;
  subtitle: string;
  onGlossaryClick: () => void;
}

export default function FeatureHeader({ title, subtitle, glossaryItems }: FeatureHeaderProps) {
  const navigate = useNavigate();
  const [glossaryOpen, setGlossaryOpen] = useState(false);

  const showGlossary = glossaryItems?.length > 0;

  return (
    <div className={styles['feature-header']}>
      <div className={styles['feature-header__title-wrapper']}>
        <h1 className={styles['feature-header__title']}>{title}</h1>
        {showGlossary && <Button onClick={() => setGlossaryOpen((o) => !o)}>?</Button>}
      </div>
      <div className={styles['feature-header__subtitle']}>{subtitle}</div>
      {title && (
        <Button variant="tertiary" onClick={() => navigate('/')}>
          ← APHELION
        </Button>
      )}
      {showGlossary && (
        <Glossary isOpen={glossaryOpen} entries={glossaryItems} onClose={() => setGlossaryOpen(false)} />
      )}
    </div>
  );
}
