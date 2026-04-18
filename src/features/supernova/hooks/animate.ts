import type { RefObject } from 'react';
import { PointsMaterial, ShaderMaterial, type MeshBasicMaterial } from 'three';
import { useSceneAnimation } from '@/hooks/scene-animation';
import type { SceneRefType } from '@/types';
import { PHASE_MAP } from '../constants';
import type { PhaseValue, SceneParams, SceneRef, SetTimeline } from '../types';

const getPhaseProgress = (timeline: number, phase: PhaseValue): number =>
  Math.max(0, Math.min(1, (timeline - phase[0]) / (phase[1] - phase[0])));

const animate = (
  refs: SceneRef,
  params: SceneParams,
  time: number,
  timelineRef: RefObject<number>,
  setTimeline: SetTimeline,
) => {
  if (!refs) {
    return;
  }
  const { core, entities } = refs;

  core.orbit.updateCamera(core.camera);
  core.stars!.rotation.y = time * 0.001;

  // Advance timeline
  if (params.autoPlay) {
    timelineRef.current = Math.min(1, timelineRef.current + 0.0004 * params.playbackSpeed);
    if (timelineRef.current >= 1) {
      timelineRef.current = 0; // loop
    }
    setTimeline(timelineRef.current);
  }

  const timeline = timelineRef.current;
  const effectiveTimeline = params.supernovaType === 'type-ia' ? Math.max(timeline, PHASE_MAP.FLASH[0]) : timeline;

  // ── PROGENITOR phase ─────────────────────────────────────────────────
  refs.entities.star.visible = params.supernovaType === 'type-ii' && timeline < PHASE_MAP.EXPANSION[0];
  if (refs.entities.star.visible) {
    entities.starUniforms.time.value = time;
    entities.starUniforms.mass.value = params.progenitorMass;

    // effectiveTimeline === timeline here since star only visible for type-ii
    const collapseP = getPhaseProgress(effectiveTimeline, PHASE_MAP.COLLAPSE);
    entities.starUniforms.collapse.value = collapseP;
    const shrink = 1 - collapseP * 0.6;
    refs.entities.star.scale.setScalar(Math.max(0.05, shrink));
  }

  // ── FLASH / SHOCK BREAKOUT ────────────────────────────────────────────
  const flashP = getPhaseProgress(effectiveTimeline, PHASE_MAP.FLASH);
  const flashBrightness = params.supernovaType === 'type-ia' ? 1.0 : 0.85;
  entities.flash.material.opacity = Math.sin(flashP * Math.PI) * flashBrightness;

  // ── NEUTRINO BURST ────────────────────────────────────────────────────
  const neutrinoP = getPhaseProgress(effectiveTimeline, PHASE_MAP.COLLAPSE);
  refs.entities.neutrinoParticles.visible =
    params.showNeutrinos && params.supernovaType === 'type-ii' && neutrinoP > 0 && neutrinoP < 1;
  if (refs.entities.neutrinoParticles.visible) {
    // Scale outward very fast — neutrinos travel near c
    const neutrinoR = neutrinoP * 12;
    refs.entities.neutrinoParticles.scale.setScalar(neutrinoR);
    (refs.entities.neutrinoParticles.material as PointsMaterial).opacity = (1 - neutrinoP) * 0.6;
  }

  // ── EXPANSION phase ───────────────────────────────────────────────────
  const expansionP = getPhaseProgress(effectiveTimeline, PHASE_MAP.EXPANSION);

  refs.entities.shockwave.visible = params.showShockwave && expansionP > 0;
  if (refs.entities.shockwave.visible) {
    const shockR = 0.3 + expansionP * 7.0;
    refs.entities.shockwave.scale.setScalar(shockR);
    entities.shockUniforms.opacity.value = Math.max(0.05, (1 - expansionP * 0.7) * 0.7);
    // Shockwave cools: white-hot → orange → red
    entities.shockUniforms.innerColor.value.setRGB(
      1.0,
      Math.max(0.3, 0.95 - expansionP * 0.5),
      Math.max(0.0, 0.85 - expansionP * 0.85),
    );
  }

  refs.entities.ejectaShell.visible = params.showEjecta && expansionP > 0.1;
  if (refs.entities.ejectaShell.visible) {
    const ejectaR = 0.5 + expansionP * 5.5;
    refs.entities.ejectaShell.scale.setScalar(ejectaR);
    (refs.entities.ejectaShell.material as MeshBasicMaterial).opacity = Math.max(0.02, 0.15 * (1 - expansionP * 0.6));
  }

  refs.entities.ejectaParticles.visible = params.showEjecta && expansionP > 0.05;
  if (refs.entities.ejectaParticles.visible) {
    const pR = expansionP * 6.5;
    refs.entities.ejectaParticles.scale.setScalar(pR);
    (refs.entities.ejectaParticles.material as PointsMaterial).opacity = Math.max(0.05, 0.8 * (1 - expansionP * 0.5));
  }

  // ── NEBULA phase ──────────────────────────────────────────────────────
  const nebulaP = getPhaseProgress(effectiveTimeline, PHASE_MAP.NEBULA);
  refs.entities.nebula.visible = nebulaP > 0;
  if (refs.entities.nebula.visible) {
    const nebulaR = 1 + nebulaP * 4.5;
    refs.entities.nebula.scale.setScalar(nebulaR);
    refs.entities.nebulaUniforms.viewVector.value.copy(refs.core.camera.position);
    // Nebula color shifts blue over time as it cools
    refs.entities.nebulaUniforms.glowColor.value.setRGB(
      Math.max(0.1, 0.8 - nebulaP * 0.6),
      0.5 + nebulaP * 0.2,
      0.8 + nebulaP * 0.2,
    );
    (refs.entities.nebula.material as ShaderMaterial).uniforms['opacity']; // opacity controlled via glow intensity
  }

  // ── REMNANT ───────────────────────────────────────────────────────────
  if (refs.entities.remnant) {
    refs.entities.remnant.visible = params.showRemnant && params.supernovaType === 'type-ii' && expansionP > 0.3;
    if (refs.entities.remnant.visible && refs.entities.remnant.material instanceof ShaderMaterial) {
      refs.entities.remnant.material.uniforms['viewVector']!.value.copy(refs.core.camera.position);
    }
  }
};

export const useAnimate = (
  sceneRef: SceneRefType<SceneRef>,
  paramsRef: RefObject<SceneParams>,
  timelineRef: RefObject<number>,
  setTimeline: SetTimeline,
) => {
  useSceneAnimation((time) => {
    const refs = sceneRef.current;
    if (!refs) {
      return;
    }
    animate(refs, paramsRef.current, time, timelineRef, setTimeline);
    refs.core.renderer.render(refs.core.scene, refs.core.camera);
  });
};
