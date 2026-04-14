import { useEffect, useRef } from 'react';
import { Mesh } from 'three';

import SceneLayout from '@/components/app/scene-layout';

import { useAnimate } from './hooks/animate';
import { useControls } from './hooks/controls';
import { useHud } from './hooks/hud';
import { useInit } from './hooks/init';
import type { SceneRef } from './types';
import { createAccretionDisk } from './utils/accretion-disk';
import { applyMassScale } from './utils/mass-scale';

export default function BlackHole() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sceneRef = useRef<SceneRef>(null);

  const { params, paramsRef, controls } = useControls();
  const hud = useHud(params);

  useInit(canvasRef, sceneRef);
  useAnimate(sceneRef, paramsRef);

  // ── React to param changes ────────────────────────────────────────────────
  useEffect(() => {
    const refs = sceneRef.current;
    if (!refs) {
      return;
    }
    const { entities } = refs;
    const { blackHole, photonSphere, outerGlow, photonRing, einsteinRing } = entities;
    applyMassScale({ blackHole, photonSphere, outerGlow, photonRing, einsteinRing }, params.mass, params.spin);
  }, [params.mass, params.spin]);

  useEffect(() => {
    const refs = sceneRef.current;
    if (!refs) {
      return;
    }
    const { core, entities } = refs;
    core.scene.remove(entities.diskGroup);
    entities.diskGroup.traverse((o) => {
      if (o instanceof Mesh) {
        o.geometry?.dispose();
        o.material?.dispose();
      }
    });
    const newDisk = createAccretionDisk(params.temp, params.dopplerShift);
    entities.diskGroup = newDisk;
    if (sceneRef.current) {
      sceneRef.current.entities.diskGroup = newDisk;
    }
    if (params.showDisk) {
      refs.core.scene.add(newDisk);
    }
  }, [params.temp, params.dopplerShift]);

  useEffect(() => {
    const refs = sceneRef.current;
    if (!refs) {
      return;
    }
    const { core, entities } = refs;
    if (params.showDisk) {
      core.scene.add(entities.diskGroup);
    } else {
      core.scene.remove(entities.diskGroup);
    }
  }, [params.showDisk]);

  useEffect(() => {
    const refs = sceneRef.current;
    if (!refs) {
      return;
    }
    if (params.showJets) {
      refs.core.scene.add(refs.entities.jetsGroup);
    } else {
      refs.core.scene.remove(refs.entities.jetsGroup);
    }
  }, [params.showJets]);

  useEffect(() => {
    const refs = sceneRef.current;
    if (!refs) {
      return;
    }
    refs.core.stars.visible = params.showStars;
  }, [params.showStars]);

  useEffect(() => {
    const refs = sceneRef.current;
    if (!refs) {
      return;
    }
    const { entities } = refs;
    entities.photonRingMat.opacity = params.lensStrength * 0.9;
    entities.einsteinMat.opacity = params.lensStrength * 0.5;
    entities.photonMat.uniforms.glowColor?.value.setRGB(1.0, 0.67 * params.lensStrength, 0.27 * params.lensStrength);
  }, [params.lensStrength]);

  return <SceneLayout canvasRef={canvasRef} hud={hud} controls={controls} />;
}
