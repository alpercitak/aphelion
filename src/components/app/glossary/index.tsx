import clsx from 'clsx';
import GlossarySection, { type GlossarySectionProps } from '@/components/app/glossary-section';
import Button from '@/components/ui/button';
import Panel from '@/components/ui/panel';
import Text from '@/components/ui/text';
import styles from './index.module.css';

interface GlossaryProps {
  isOpen: boolean;
  onClose: () => void;
  entries: ReadonlyArray<GlossarySectionProps>;
}

const TITLE = 'PHYSICS GLOSSARY';
const ARIA_LABEL_CLOSE_BUTTON = 'Close glossary';

export default function Glossary({ isOpen, onClose, entries = [] }: GlossaryProps) {
  return (
    <Panel className={clsx(styles['glossary'], isOpen && styles['glossary--open'])} aria-hidden={!isOpen}>
      <div className={styles['glossary__header']}>
        <Text>{TITLE}</Text>
        <Button onClick={onClose} aria-label={ARIA_LABEL_CLOSE_BUTTON}>
          ✕
        </Button>
      </div>
      {entries.map((section) => (
        <GlossarySection key={section.title} {...section} />
      ))}
    </Panel>
  );
}
