import { useState, type Ref } from 'react';
import Controls, { type ControlsProps } from '@/components/app/controls';
import Crosshair from '@/components/app/crosshair';
import Glossary from '@/components/app/glossary';
import type { GlossarySectionProps } from '@/components/app/glossary-section';
import Header from '@/components/app/header';
import Hints, { type HintItem } from '@/components/app/hints';
import Hud from '@/components/app/hud';
import Scanlines from '@/components/app/scanlines';
import type { StatsItem } from '@/components/app/stats';
import Stats from '@/components/app/stats';
import Status from '@/components/app/status';

import styles from './index.module.css';

export interface SceneLayoutHudProps {
  title: string;
  subtitle: string;
  stats: ReadonlyArray<StatsItem>;
  glossary: ReadonlyArray<GlossarySectionProps>;
  hints: ReadonlyArray<HintItem>;
  status?: string;
}

export interface SceneLayoutControlsProps extends ControlsProps {}

export interface SceneLayoutProps {
  canvasRef: Ref<HTMLCanvasElement>;
  hud: SceneLayoutHudProps;
  controls: SceneLayoutControlsProps;
}

export default function SceneLayout({ canvasRef, hud, controls }: SceneLayoutProps) {
  const [glossaryOpen, setGlossaryOpen] = useState(false);

  return (
    <div className={styles['scene-layout']}>
      <canvas ref={canvasRef} />
      <Hud />
      <Header title={hud.title} subtitle={hud.subtitle} onGlossaryClick={() => setGlossaryOpen((o) => !o)} />
      {hud.stats && <Stats items={hud.stats} />}
      {hud.hints && <Hints items={hud.hints} />}
      {hud.status && <Status status={hud.status} />}
      {controls && <Controls {...controls} />}
      <Scanlines />
      <Crosshair />
      <Glossary entries={hud.glossary} isOpen={glossaryOpen} onClose={() => setGlossaryOpen(false)} />
    </div>
  );
}
