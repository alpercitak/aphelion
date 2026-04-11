import FeatureHeader from '@/components/app/feature-header';
import Stats from '@/components/app/stats';
import styles from './index.module.css';

export default function TopBar({ title, subtitle, statsItems, glossaryItems }) {
  return (
    <div className={styles['top-bar']}>
      <FeatureHeader title={title} subtitle={subtitle} glossaryItems={glossaryItems} />
      <Stats items={statsItems} />
    </div>
  );
}
