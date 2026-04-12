import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ACESFilmicToneMapping, Clock, PerspectiveCamera, Scene, WebGLRenderer } from 'three';

import Controls from '@/components/app/controls';
import SceneLayout from '@/layouts/scene';
import { createOrbitControls } from '@/utils/camera';
import { hawkingTemperature, schwarzschildRadius } from '@/utils/physics';
import { createStarField } from '@/utils/starfield';

import { GLOSSARY_ITEMS, HINT_ITEMS, PARAMS, SLIDERS, TOGGLES } from './constants';
import type { SceneRef } from './types';
import { createAccretionDisk } from './utils/accretion-disk';
import { createEventHorizon } from './utils/event-horizon';
import { createLensingRings } from './utils/lensing-rings';
import { applyMassScale } from './utils/mass-scale';
import { createOuterGlow } from './utils/outer-glow';
import { createPhotonSphere } from './utils/photon-sphere';
import { createRelativisticJets } from './utils/relativistic-jets';

import styles from './index.module.css';

export default function BlackHole() {
  const canvasRef = useRef(null);
  const sceneRef = useRef<SceneRef>(null);
  const [params, setParams] = useState(PARAMS);
  const paramsRef = useRef(params);

  // Keep ref in sync for use inside animation loop
  useEffect(() => {
    paramsRef.current = params;
  }, [params]);

  const set = useCallback((key: string, value: string | number | boolean) => {
    setParams((prev) => ({ ...prev, [key]: value }));
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      return;
    }

    // ── Renderer ──────────────────────────────────────────────────────────────
    const renderer = new WebGLRenderer({ canvas, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.toneMapping = ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;

    const scene = new Scene();

    const camera = new PerspectiveCamera(55, window.innerWidth / window.innerHeight, 0.01, 1000);
    camera.position.set(0, 3, 8);
    camera.lookAt(0, 0, 0);

    const orbit = createOrbitControls(canvas);

    // ── Objects ───────────────────────────────────────────────────────────────
    const stars = createStarField();
    scene.add(stars);

    const blackHole = createEventHorizon();
    scene.add(blackHole);

    const photonSphere = createPhotonSphere(camera.position);
    scene.add(photonSphere);

    const outerGlow = createOuterGlow(camera.position);
    scene.add(outerGlow);

    const { photonRing, einsteinRing } = createLensingRings();
    scene.add(photonRing);
    scene.add(einsteinRing);

    const diskGroup = createAccretionDisk(PARAMS.temp, false);
    scene.add(diskGroup);

    const jetsGroup = createRelativisticJets();
    scene.add(jetsGroup);

    // Store refs for external param changes
    sceneRef.current = {
      scene,
      renderer,
      camera,
      orbit,
      stars,
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

    // ── Animation ─────────────────────────────────────────────────────────────
    const clock = new Clock();
    let raf: number;

    function animate() {
      raf = requestAnimationFrame(animate);
      const t = clock.getElapsedTime();
      const p = paramsRef.current;
      const refs = sceneRef.current!;

      orbit.updateCamera(camera);

      // Disk rotation (Keplerian)
      if (refs.diskGroup && p.showDisk) {
        refs.diskGroup.children.forEach((child, i) => {
          child.rotation.y = t * (0.08 + (1 - i / refs.diskGroup.children.length) * 0.12);
        });
      }

      // Photon sphere pulse
      const pulse = 1 + Math.sin(t * 2.1) * 0.015;
      const s = Math.cbrt(p.mass / 10);
      const oblate = 1 - p.spin * 0.15;
      refs.photonSphere.scale.set(s * pulse, s * oblate * pulse, s * pulse);

      // Update glow view vectors
      refs.photonMat.uniforms.viewVector?.value.copy(camera.position);
      refs.outerGlow.material.uniforms.viewVector?.value.copy(camera.position);

      if (p.showStars) refs.stars.rotation.y = t * 0.003;

      // Lensing rings face camera
      refs.photonRing.lookAt(camera.position);
      refs.einsteinRing.lookAt(camera.position);

      renderer.render(scene, camera);
    }

    animate();

    // ── Resize ────────────────────────────────────────────────────────────────
    const onResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', onResize);

    return () => {
      cancelAnimationFrame(raf);
      orbit.dispose();
      window.removeEventListener('resize', onResize);
      renderer.dispose();
    };
  }, []);

  // ── React to param changes ────────────────────────────────────────────────
  useEffect(() => {
    const refs = sceneRef.current;
    if (!refs) {
      return;
    }
    const { scene, blackHole, photonSphere, outerGlow, photonRing, einsteinRing } = refs;

    applyMassScale({ blackHole, photonSphere, outerGlow, photonRing, einsteinRing }, params.mass, params.spin);
  }, [params.mass, params.spin]);

  useEffect(() => {
    const refs = sceneRef.current;
    if (!refs) {
      return;
    }
    refs.scene.remove(refs.diskGroup);
    refs.diskGroup.traverse((o) => {
      o.geometry?.dispose();
      o.material?.dispose();
    });
    const newDisk = createAccretionDisk(params.temp, params.dopplerShift);
    refs.diskGroup = newDisk;
    if (sceneRef.current) {
      sceneRef.current.diskGroup = newDisk;
    }
    if (params.showDisk) {
      refs.scene.add(newDisk);
    }
  }, [params.temp, params.dopplerShift]);

  useEffect(() => {
    const refs = sceneRef.current;
    if (!refs) {
      return;
    }
    if (params.showDisk) {
      refs.scene.add(refs.diskGroup);
    } else {
      refs.scene.remove(refs.diskGroup);
    }
  }, [params.showDisk]);

  useEffect(() => {
    const refs = sceneRef.current;
    if (!refs) {
      return;
    }
    if (params.showJets) {
      refs.scene.add(refs.jetsGroup);
    } else {
      refs.scene.remove(refs.jetsGroup);
    }
  }, [params.showJets]);

  useEffect(() => {
    const refs = sceneRef.current;
    if (!refs) {
      return;
    }
    refs.stars.visible = params.showStars;
  }, [params.showStars]);

  useEffect(() => {
    const refs = sceneRef.current;
    if (!refs) {
      return;
    }
    refs.photonRingMat.opacity = params.lensStrength * 0.9;
    refs.einsteinMat.opacity = params.lensStrength * 0.5;
    refs.photonMat.uniforms.glowColor?.value.setRGB(1.0, 0.67 * params.lensStrength, 0.27 * params.lensStrength);
  }, [params.lensStrength]);

  // ── Sliders & toggles config ──────────────────────────────────────────────
  const sliders = useMemo(
    () =>
      Object.values(SLIDERS).map((config) => ({
        ...config,
        value: params[config.id],
        onChange: (v: number) => set(config.id, v),
      })),
    [params.mass, params.spin, params.temp, params.lensStrength],
  );

  const toggles = useMemo(
    () =>
      TOGGLES.map(({ id, label }) => ({
        id,
        label,
        active: params[id],
        onClick: () => set(id, !params[id]),
      })),
    [params.showDisk, params.showJets, params.showStars, params.dopplerShift],
  );

  const rs = schwarzschildRadius(params.mass);
  const hTemp = hawkingTemperature(params.mass);

  const statsItems = useMemo(() => {
    return [
      { label: 'mass', value: params.mass.toFixed(1), unit: 'M☉' },
      { label: 'spin', value: params.spin.toFixed(2), unit: 'a' },
      { label: 'temp', value: hTemp > 1e10 ? (hTemp / 1e10).toExponential(1) : '~0', unit: 'K' },
      { label: 'Rₛ', value: rs.toFixed(1), unit: 'km' },
    ];
  }, [params.mass, params.spin, hTemp, rs]);

  return (
    <SceneLayout
      className={styles.root}
      title={'Black Hole'}
      subtitle={'SCHWARZSCHILD METRIC · GRAVITATIONAL LENSING'}
      statsItems={statsItems}
      glossaryItems={GLOSSARY_ITEMS}
      hintItems={HINT_ITEMS}
    >
      <canvas ref={canvasRef} className={styles.canvas} />
      <Controls sliders={sliders} toggles={toggles} />
    </SceneLayout>
  );
}
