import { useEffect, useRef } from 'react';
import { Clock, Mesh } from 'three';

import SceneLayout from '@/components/app/scene-layout';
import { setupScene } from '@/utils/setup';

import { PARAMS } from './constants';
import { useControls } from './hooks/controls';
import { useHud } from './hooks/hud';
import type { SceneRef } from './types';
import { createAccretionDisk } from './utils/accretion-disk';
import { createEventHorizon } from './utils/event-horizon';
import { createLensingRings } from './utils/lensing-rings';
import { applyMassScale } from './utils/mass-scale';
import { createOuterGlow } from './utils/outer-glow';
import { createPhotonSphere } from './utils/photon-sphere';
import { createRelativisticJets } from './utils/relativistic-jets';

export default function BlackHole() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sceneRef = useRef<SceneRef>(null);

  const { params, paramsRef, controls } = useControls();
  const hud = useHud(params);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      return;
    }

    // ── Setup ──────────────────────────────────────────────────────────────
    const { renderer, scene, camera, orbit, stars, dispose } = setupScene({
      canvas,
      cameraPosition: [0, 3, 8],
      orbitOptions: { theta: 0.1, phi: Math.PI / 3.5, radius: 16 },
    });

    // ── Objects ───────────────────────────────────────────────────────────────
    const blackHole = createEventHorizon();
    const photonSphere = createPhotonSphere(camera.position);
    const outerGlow = createOuterGlow(camera.position);
    const { photonRing, einsteinRing } = createLensingRings();
    const diskGroup = createAccretionDisk(PARAMS.temp, false);
    const jetsGroup = createRelativisticJets();
    scene.add(blackHole, photonSphere, outerGlow, photonRing, einsteinRing, diskGroup, jetsGroup);

    const core = { scene, renderer, camera, orbit, stars };
    const entities = {
      blackHole,
      photonSphere,
      outerGlow,
      photonRing,
      einsteinRing,
      diskGroup,
      jetsGroup,
      photonMat: photonSphere.material,
      einsteinMat: einsteinRing.material,
      photonRingMat: photonRing.material,
    };
    sceneRef.current = { core, entities };

    // ── Animation ─────────────────────────────────────────────────────────────
    const clock = new Clock();
    let raf: number;

    function animate() {
      raf = requestAnimationFrame(animate);
      const t = clock.getElapsedTime();
      const p = paramsRef.current;
      const refs = sceneRef.current;

      if (!refs) {
        return;
      }
      const { core, entities } = refs;
      const { orbit } = core;
      const { diskGroup, photonMat, photonSphere } = entities;

      orbit.updateCamera(camera);

      // Disk rotation (Keplerian)
      if (diskGroup && p.showDisk) {
        diskGroup.children.forEach((child, i) => {
          child.rotation.y = t * (0.08 + (1 - i / diskGroup.children.length) * 0.12);
        });
      }

      // Photon sphere pulse
      const pulse = 1 + Math.sin(t * 2.1) * 0.015;
      const s = Math.cbrt(p.mass / 10);
      const oblate = 1 - p.spin * 0.15;
      photonSphere.scale.set(s * pulse, s * oblate * pulse, s * pulse);

      // Update glow view vectors
      photonMat.uniforms.viewVector?.value.copy(camera.position);
      outerGlow.material.uniforms.viewVector?.value.copy(camera.position);

      if (p.showStars) {
        stars.rotation.y = t * 0.003;
      }

      // Lensing rings face camera
      photonRing.lookAt(camera.position);
      einsteinRing.lookAt(camera.position);

      renderer.render(scene, camera);
    }

    animate();

    return () => {
      cancelAnimationFrame(raf);
      dispose();
    };
  }, []);

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
