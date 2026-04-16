import styles from './index.module.css';

export interface GlossarySectionItemProps {
  term: string;
  def: string;
  formula?: string;
}

export default function GlossarySectionItem({ term, def, formula }: GlossarySectionItemProps) {
  return (
    <article className={styles['glossary-section-item']}>
      <div className={styles['glossary-section-item__term']}>
        {term}
        {formula && <span className={styles['glossary-section-item__formula']}>{formula}</span>}
      </div>
      <div className={styles['glossary-section-item__def']} dangerouslySetInnerHTML={{ __html: def }} />
    </article>
  );
}
