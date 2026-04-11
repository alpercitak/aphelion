import Hud from '@/components/app/hud';
import TopBar from '@/components/app/top-bar';
import Hint from '@/components/app/hint';
import Scanlines from '@/components/app/scanlines';
import Crosshair from '@/components/app/crosshair';
import styles from './index.module.css';

interface SceneLayoutProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  subtitle: string;
}

export default function SceneLayout(props: SceneLayoutProps) {
  const { title, subtitle, statsItems, glossaryItems, hintItems, children } = props;
  return (
    <div className={styles['scene-layout']}>
      <Hud>
        <TopBar title={title} subtitle={subtitle} statsItems={statsItems} glossaryItems={glossaryItems} />
        {hintItems && <Hint items={hintItems} />}
        {children}
      </Hud>
      <Scanlines />
      <Crosshair />
      {children}
    </div>
  );
}
