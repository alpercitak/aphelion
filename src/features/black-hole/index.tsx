import { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import * as THREE from 'three';
import { createOrbitControls } from '@/utils/camera';
import { createStarField } from '@/utils/starfield';
import { schwarzschildRadius, hawkingTemperature } from '@/utils/physics';
import Controls from '@/components/app/controls';
import Stats from '@/components/app/stats';
import Glossary from '@/components/app/glossary';
import { applyMassScale } from './utils/mass-scale';
import { createAccretionDisk } from './utils/accretion-disk';
import { createEventHorizon } from './utils/event-horizon';
import { createLensingRings } from './utils/lensing-rings';
import { createOuterGlow } from './utils/outer-glow';
import { createPhotonSphere } from './utils/photon-sphere';
import { createRelativisticJets } from './utils/relativistic-jets';
import { BLACK_HOLE_GLOSSARY } from './constants';
import styles from './index.module.css';
import FeatureHeader from '@/components/app/feature-header';

const DEFAULTS = {
  mass: 10,
  spin: 0,
  temp: 8000,
  lensStrength: 1.0,
  showDisk: true,
  showJets: true,
  showStars: true,
  dopplerShift: false,
};

export default function BlackHole() {
  const canvasRef = useRef(null);
  const sceneRef = useRef(null);
  const [params, setParams] = useState(DEFAULTS);
  const [glossaryOpen, setGlossaryOpen] = useState(false);
  const paramsRef = useRef(params);

  // Keep ref in sync for use inside animation loop
  useEffect(() => {
    paramsRef.current = params;
  }, [params]);

  const set = useCallback((key, value) => {
    setParams((prev) => ({ ...prev, [key]: value }));
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // ── Renderer ──────────────────────────────────────────────────────────────
    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight, 0.01, 1000);
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

    let diskGroup = createAccretionDisk(DEFAULTS.temp, false);
    scene.add(diskGroup);

    let jetsGroup = createRelativisticJets();
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
    const clock = new THREE.Clock();
    let raf;

    function animate() {
      raf = requestAnimationFrame(animate);
      const t = clock.getElapsedTime();
      const p = paramsRef.current;
      const refs = sceneRef.current;

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
      refs.photonMat.uniforms.viewVector.value.copy(camera.position);
      refs.outerGlow.material.uniforms.viewVector.value.copy(camera.position);

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
    if (!refs) return;
    refs.scene.remove(refs.diskGroup);
    refs.diskGroup.traverse((o) => {
      o.geometry?.dispose();
      o.material?.dispose();
    });
    const newDisk = createAccretionDisk(params.temp, params.dopplerShift);
    refs.diskGroup = newDisk;
    sceneRef.current.diskGroup = newDisk;
    if (params.showDisk) refs.scene.add(newDisk);
  }, [params.temp, params.dopplerShift]);

  useEffect(() => {
    const refs = sceneRef.current;
    if (!refs) return;
    if (params.showDisk) refs.scene.add(refs.diskGroup);
    else refs.scene.remove(refs.diskGroup);
  }, [params.showDisk]);

  useEffect(() => {
    const refs = sceneRef.current;
    if (!refs) return;
    if (params.showJets) refs.scene.add(refs.jetsGroup);
    else refs.scene.remove(refs.jetsGroup);
  }, [params.showJets]);

  useEffect(() => {
    const refs = sceneRef.current;
    if (!refs) return;
    refs.stars.visible = params.showStars;
  }, [params.showStars]);

  useEffect(() => {
    const refs = sceneRef.current;
    if (!refs) return;
    refs.photonRingMat.opacity = params.lensStrength * 0.9;
    refs.einsteinMat.opacity = params.lensStrength * 0.5;
    refs.photonMat.uniforms.glowColor.value.setRGB(1.0, 0.67 * params.lensStrength, 0.27 * params.lensStrength);
  }, [params.lensStrength]);

  // ── Sliders & toggles config ──────────────────────────────────────────────
  const sliders = [
    {
      id: 'mass',
      label: 'MASS',
      value: params.mass,
      min: 1,
      max: 100,
      step: 0.5,
      format: (v: number) => `${v.toFixed(1)} M☉`,
      tooltip: 'Mass in solar units. Larger mass = bigger event horizon and stronger lensing.',
      onChange: (v: number) => set('mass', v),
    },
    {
      id: 'spin',
      label: 'SPIN (a)',
      value: params.spin,
      min: 0,
      max: 0.99,
      step: 0.01,
      format: (v: number) => v.toFixed(2),
      tooltip:
        'Dimensionless spin 0–0.99. Spinning BHs follow Kerr metric, flattening the horizon and dragging spacetime.',
      onChange: (v: number) => set('spin', v),
    },
    {
      id: 'temp',
      label: 'DISK TEMP',
      value: params.temp,
      min: 2000,
      max: 30000,
      step: 100,
      format: (v: number) => `${Math.round(v)} K`,
      tooltip: 'Inner disk blackbody temperature. Hotter = bluer. Real accretion disks reach 10,000–100,000 K.',
      onChange: (v: number) => set('temp', v),
    },
    {
      id: 'lens',
      label: 'LENSING',
      value: params.lensStrength,
      min: 0,
      max: 2,
      step: 0.05,
      format: (v: number) => v.toFixed(2),
      tooltip:
        'Intensity of gravitational light bending. At max, background light wraps around forming an Einstein ring.',
      onChange: (v: number) => set('lensStrength', v),
    },
  ];

  const toggles = [
    {
      id: 'disk',
      label: 'ACCRETION DISK',
      active: params.showDisk,
      onClick: () => set('showDisk', !params.showDisk),
    },
    {
      id: 'jets',
      label: 'RELATIVISTIC JETS',
      active: params.showJets,
      onClick: () => set('showJets', !params.showJets),
    },
    {
      id: 'stars',
      label: 'STAR FIELD',
      active: params.showStars,
      onClick: () => set('showStars', !params.showStars),
    },
    {
      id: 'doppler',
      label: 'DOPPLER SHIFT',
      active: params.dopplerShift,
      onClick: () => set('dopplerShift', !params.dopplerShift),
    },
  ];

  const rs = schwarzschildRadius(params.mass);
  const hTemp = hawkingTemperature(params.mass);

  const statsItems = useMemo(() => {
    return [
      { label: 'mass', value: params.mass.toFixed(1), unit: 'M☉' },
      { label: 'spin', value: params.spin.toFixed(2), unit: 'a' },
      { label: 'temp', value: hTemp > 1e10 ? (hTemp / 1e10).toExponential(1) : '~0', unit: 'K' },
      {
        label: (
          <>
            R<sub>s</sub>
          </>
        ),
        value: rs.toFixed(1),
        unit: 'km',
      },
    ];
  }, [params.mass, params.spin, hTemp, rs]);

  return (
    <div className={styles.root}>
      <canvas ref={canvasRef} className={styles.canvas} />

      <div className={styles.scanlines} />

      <div className={styles.hud}>
        {/* Corners */}
        <span className={`${styles.corner} ${styles.tl}`} />
        <span className={`${styles.corner} ${styles.tr}`} />
        <span className={`${styles.corner} ${styles.bl}`} />
        <span className={`${styles.corner} ${styles.br}`} />

        {/* Top bar */}
        <div className={styles.topbar}>
          <FeatureHeader title={'Black Hole'} subtitle={'SCHWARZSCHILD METRIC · GRAVITATIONAL LENSING'} />
          <div className={styles.topRight}>
            <Stats items={statsItems} />
          </div>
        </div>

        {/* Glossary button */}
        {/* <button className={styles.glossaryBtn} onClick={() => setGlossaryOpen((o) => !o)}>
          ?
        </button> */}

        {/* Controls */}
        <div className={styles.controlsWrap}>
          <Controls sliders={sliders} toggles={toggles} />
        </div>

        {/* Bottom right hint */}
        <div className={styles.hint}>
          DRAG TO ORBIT
          <br />
          SCROLL TO ZOOM
          <br />
          <br />
          <span>SCHWARZSCHILD RADIUS</span>
          <br />
          rₛ = 2GM/c²
          <br />
          <br />
          <span>PHOTON SPHERE</span>
          <br />r = 1.5 rₛ
        </div>

        {/* Crosshair */}
        <div className={styles.crosshair} />
      </div>

      {/* Glossary */}
      <Glossary isOpen={glossaryOpen} onClose={() => setGlossaryOpen(false)} entries={BLACK_HOLE_GLOSSARY} />
    </div>
  );
}
