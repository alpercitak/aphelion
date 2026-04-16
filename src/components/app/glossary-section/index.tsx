import GlossarySectionItem, { type GlossarySectionItemProps } from '../glossary-section-item';
import styles from './index.module.css';

export interface GlossarySectionProps {
  title: string;
  items: Array<GlossarySectionItemProps>;
}

export default function GlossarySection({ title, items }: GlossarySectionProps) {
  return (
    <div className={styles['glossary-section']}>
      <h3 className={styles['glossary-section__title']}>{title}</h3>
      {items.map((item) => (
        <GlossarySectionItem key={item.term} {...item} />
      ))}
    </div>
  );
}
