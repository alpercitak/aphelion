import FeatureHeader from '@/components/app/feature-header';
import styles from './index.module.css';

export default function TopBar({ title, subtitle, glossaryItems }) {
  return (
    <div className={styles['top-bar']}>
      <FeatureHeader title={title} subtitle={subtitle} glossaryItems={glossaryItems} />
    </div>
  );
}
