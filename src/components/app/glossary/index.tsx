import Panel from '@/components/ui/panel';
import styles from './index.module.css';

interface GlossaryItem {
  term: string;
  def: string;
  formula?: string;
}

interface GlossarySection {
  title: string;
  items: Array<GlossaryItem>;
}

interface GlossaryProps {
  isOpen: boolean;
  onClose: () => void;
  entries: Array<GlossarySection>;
}

export default function Glossary({ isOpen, onClose, entries = [] }: GlossaryProps) {
  return (
    <Panel className={`${styles.panel} ${isOpen ? styles.open : ''}`} aria-hidden={!isOpen}>
      <div className={styles.inner}>
        <div className={styles.header}>
          <h2>PHYSICS GLOSSARY</h2>
          <button className={styles.close} onClick={onClose} aria-label="Close glossary" type="button">
            ✕
          </button>
        </div>

        {entries.map((section) => (
          <div key={section.title} className={styles.section}>
            <h3 className={styles.sectionTitle}>{section.title}</h3>
            {section.items.map((item) => (
              <article key={item.term} className={styles.entry}>
                <div className={styles.term}>
                  {item.term}
                  {item.formula && <span className={styles.formula}>{item.formula}</span>}
                </div>
                <div className={styles.def} dangerouslySetInnerHTML={{ __html: item.def }} />
              </article>
            ))}
          </div>
        ))}
      </div>
    </Panel>
  );
}
