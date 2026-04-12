import type { Ref } from 'react';
import type { ControlsProps } from '@/components/app/controls';
import Controls from '@/components/app/controls';
import Crosshair from '@/components/app/crosshair';
import Hint from '@/components/app/hint';
import Hud, { type HudProps } from '@/components/app/hud';
import Scanlines from '@/components/app/scanlines';
import TopBar from '@/components/app/top-bar';
import Status from './components/status';
import styles from './index.module.css';

interface SceneLayoutProps extends React.HTMLAttributes<HTMLDivElement> {
  canvasRef: Ref<HTMLCanvasElement>;
  hud: HudProps;
  controls: ControlsProps;
}

export default function SceneLayout(props: SceneLayoutProps) {
  const { canvasRef, hud, controls, children } = props;
  return (
    <div className={styles['scene-layout']}>
      <canvas ref={canvasRef} className={styles.canvas} />
      <Hud>
        <TopBar title={hud.title} subtitle={hud.subtitle} statsItems={hud.stats} glossaryItems={hud.glossary} />
        {hud.hints && <Hint items={hud.hints} />}
        {children}
      </Hud>
      <Scanlines />
      <Crosshair />
      {hud.status && <Status status={hud.status} />}
      {controls && <Controls sliders={controls.sliders} radios={controls.radios} toggles={controls.toggles} />}
      {children}
    </div>
  );
}
