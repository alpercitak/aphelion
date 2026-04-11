import FeatureHeader from '@/components/app/feature-header';
import styles from './index.module.css';

interface SceneLayoutProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  subtitle: string;
}

export default function SceneLayout(props: SceneLayoutProps) {
  const { title, subtitle, children } = props;
  return (
    <div className={styles['scene-layout']}>
      <div className={styles['scene-layout__topbar']}>
        <FeatureHeader title={title} subtitle={subtitle} />
      </div>
      {children}
    </div>
  );
}
