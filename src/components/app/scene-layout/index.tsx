import type { Ref } from 'react';
import Controls, { type ControlsProps } from '@/components/app/controls';
import Crosshair from '@/components/app/crosshair';
import Hints, { type HintItem } from '@/components/app/hints';
import Hud, { type HudProps } from '@/components/app/hud';
import Scanlines from '@/components/app/scanlines';
import Status from '@/components/app/status';
import TopBar from '@/components/app/top-bar';
import styles from './index.module.css';
import type { StatsItem } from '../stats';
import type { GlossarySection } from '../glossary';
import Stats from '../stats';

export interface SceneLayoutHudProps {
  title: string;
  subtitle: string;
  stats: ReadonlyArray<StatsItem>;
  glossary: ReadonlyArray<GlossarySection>;
  hints: ReadonlyArray<HintItem>;
  status?: string;
}

export interface SceneLayoutControlsProps extends ControlsProps {}

export interface SceneLayoutProps extends React.HTMLAttributes<HTMLDivElement> {
  canvasRef: Ref<HTMLCanvasElement>;
  hud: SceneLayoutHudProps;
  controls: SceneLayoutControlsProps;
}

export default function SceneLayout({ canvasRef, hud, controls }: SceneLayoutProps) {
  return (
    <div className={styles['scene-layout']}>
      <canvas ref={canvasRef} className={styles.canvas} />
      <Hud>
        <TopBar title={hud.title} subtitle={hud.subtitle} glossaryItems={hud.glossary} />

        {hud.stats && <Stats items={hud.stats} />}
        {hud.hints && <Hints items={hud.hints} />}
        {hud.status && <Status status={hud.status} />}
      </Hud>
      {controls && <Controls sliders={controls.sliders} radios={controls.radios} toggles={controls.toggles} />}
      <Scanlines />
      <Crosshair />
    </div>
  );
}
