import { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import * as THREE from 'three';
import { createOrbitControls } from '@/utils/camera';
import { createStarField } from '@/utils/starfield';
import ToggleGroup from '@/components/ui/toggle-group';
import SliderGroup from '@/components/ui/slider-group';
import {
  createSpacetimeGrid,
  createBlackHoleUnit,
  createWaveRing,
  createMergerFlash,
  createMergedBlackHole,
  orbitalPositions,
  orbitalOmega,
} from './utils';
import { GLOSSARY_ITEMS, HINT_ITEMS } from './constants';
import { schwarzschildRadius } from '@/utils/physics';
import TopBar from '@/components/app/top-bar';
import Hud from '@/components/app/hud';
import Scanlines from '@/components/app/scanlines';
import Hint from '@/components/app/hint';
import styles from './index.module.css';

const INSPIRAL_RATES = { slow: 0.008, medium: 0.022, fast: 0.055 };
const INITIAL_SEPARATION = 7.0;
const MERGE_THRESHOLD = 1.2;

const DEFAULTS = {
  mass1: 30,
  mass2: 25,
  inspiralRate: 'medium',
  waveAmplitude: 1.0,
  showGrid: true,
  showWaveRings: true,
  showDisks: true,
  autoLoop: true,
};

// Merger phases
const PHASE = { ORBIT: 'orbit', MERGING: 'merging', MERGED: 'merged' };

export default function BinaryMerger() {
  const canvasRef = useRef(null);
  const sceneRef = useRef(null);
  const stateRef = useRef({
    separation: INITIAL_SEPARATION,
    angle: 0,
    phase: PHASE.ORBIT,
    mergeProgress: 0,
    flashOpacity: 0,
    waveRings: [],
    lastRingTime: 0,
    params: { ...DEFAULTS },
  });

  const [params, setParams] = useState(DEFAULTS);
  const [phase, setPhase] = useState(PHASE.ORBIT);

  const set = useCallback((key, value) => {
    setParams((prev) => {
      const next = { ...prev, [key]: value };
      stateRef.current.params = next;
      return next;
    });
  }, []);

  const resetScene = useCallback(() => {
    const s = stateRef.current;
    s.separation = INITIAL_SEPARATION;
    s.angle = 0;
    s.phase = PHASE.ORBIT;
    s.mergeProgress = 0;
    s.flashOpacity = 0;
    s.waveRings = [];
    s.lastRingTime = 0;
    setPhase(PHASE.ORBIT);

    const refs = sceneRef.current;
    if (!refs) return;
    const { scene, bh1, bh2, mergedBH, flash } = refs;

    bh1.visible = true;
    bh2.visible = true;
    mergedBH.visible = false;
    flash.material.opacity = 0;

    // Clear old wave rings
    refs.waveRingMeshes.forEach((r) => scene.remove(r));
    refs.waveRingMeshes = [];

    // Reposition
    const pos = orbitalPositions(0, INITIAL_SEPARATION);
    bh1.position.set(pos.x1, 0, pos.z1);
    bh2.position.set(pos.x2, 0, pos.z2);
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
    camera.position.set(0, 10, 14);
    camera.lookAt(0, 0, 0);

    const orbit = createOrbitControls(canvas, { theta: 0.1, phi: Math.PI / 3.5, radius: 16 });

    // ── Objects ───────────────────────────────────────────────────────────────
    const stars = createStarField(4000);
    scene.add(stars);

    const grid = createSpacetimeGrid();
    scene.add(grid);

    const p = stateRef.current.params;
    const bh1 = createBlackHoleUnit(p.mass1, camera.position);
    const bh2 = createBlackHoleUnit(p.mass2, camera.position);
    scene.add(bh1, bh2);

    const mergedBH = createMergedBlackHole(p.mass1, p.mass2, camera.position);
    mergedBH.visible = false;
    scene.add(mergedBH);

    const flash = createMergerFlash();
    camera.add(flash);
    flash.position.z = -1;
    scene.add(camera);

    const waveRingMeshes = [];

    sceneRef.current = {
      scene,
      renderer,
      camera,
      orbit,
      stars,
      grid,
      bh1,
      bh2,
      mergedBH,
      flash,
      waveRingMeshes,
    };

    // ── Initial positions ─────────────────────────────────────────────────────
    const initPos = orbitalPositions(0, INITIAL_SEPARATION);
    bh1.position.set(initPos.x1, 0, initPos.z1);
    bh2.position.set(initPos.x2, 0, initPos.z2);

    // ── Animation ─────────────────────────────────────────────────────────────
    const clock = new THREE.Clock();
    let raf;

    function spawnWaveRing(cx, cz, radius) {
      const ring = createWaveRing(radius);
      ring.position.set(cx, 0.02, cz);
      scene.add(ring);
      waveRingMeshes.push(ring);
      stateRef.current.waveRings.push({ mesh: ring, born: clock.getElapsedTime() });
    }

    function animate() {
      raf = requestAnimationFrame(animate);
      const t = clock.getElapsedTime();
      const s = stateRef.current;
      const pr = s.params;
      const refs = sceneRef.current;

      orbit.updateCamera(camera);
      stars.rotation.y = t * 0.002;

      const totalMass = pr.mass1 + pr.mass2;

      // ── ORBIT PHASE ──────────────────────────────────────────────────────
      if (s.phase === PHASE.ORBIT) {
        const rate = INSPIRAL_RATES[pr.inspiralRate];
        s.separation = Math.max(MERGE_THRESHOLD, s.separation - rate * 0.016);

        const omega = orbitalOmega(s.separation, totalMass);
        s.angle += omega * 0.016;

        const pos = orbitalPositions(s.angle, s.separation);
        bh1.position.set(pos.x1, 0, pos.z1);
        bh2.position.set(pos.x2, 0, pos.z2);

        // Disk counter-rotation
        bh1.userData.diskGroup.rotation.y = t * 0.35;
        bh2.userData.diskGroup.rotation.y = -t * 0.28;

        // Update spacetime grid sources
        refs.grid.material.uniforms.source1.value.set(pos.x1, pos.z1);
        refs.grid.material.uniforms.source2.value.set(pos.x2, pos.z2);
        refs.grid.material.uniforms.separation.value = s.separation;
        refs.grid.material.uniforms.amplitude.value = pr.waveAmplitude;
        refs.grid.material.uniforms.time.value = t * 1.8;
        refs.grid.visible = pr.showGrid;

        // Glow view vectors
        bh1.userData.glowMat.uniforms.viewVector.value.copy(camera.position).sub(bh1.position);
        bh2.userData.glowMat.uniforms.viewVector.value.copy(camera.position).sub(bh2.position);
        bh1.userData.haloMat.uniforms.viewVector.value.copy(camera.position).sub(bh1.position);
        bh2.userData.haloMat.uniforms.viewVector.value.copy(camera.position).sub(bh2.position);

        // Disk visibility
        bh1.userData.diskGroup.visible = pr.showDisks;
        bh2.userData.diskGroup.visible = pr.showDisks;

        // Spawn wave rings from midpoint periodically
        const ringInterval = Math.max(0.18, 0.4 - (INITIAL_SEPARATION - s.separation) * 0.02);
        if (pr.showWaveRings && t - s.lastRingTime > ringInterval) {
          spawnWaveRing(0, 0, s.separation * 0.3);
          s.lastRingTime = t;
        }

        // Check merge trigger
        if (s.separation <= MERGE_THRESHOLD) {
          s.phase = PHASE.MERGING;
          s.mergeProgress = 0;
          setPhase(PHASE.MERGING);
        }
      }

      // ── MERGING PHASE ─────────────────────────────────────────────────────
      if (s.phase === PHASE.MERGING) {
        s.mergeProgress = Math.min(1, s.mergeProgress + 0.025);
        const mp = s.mergeProgress;

        // Converge both BHs to center
        bh1.position.lerp(new THREE.Vector3(0, 0, 0), 0.06);
        bh2.position.lerp(new THREE.Vector3(0, 0, 0), 0.06);

        // Scale down as they converge
        const shrink = 1 - mp * 0.4;
        bh1.scale.setScalar(shrink);
        bh2.scale.setScalar(shrink);

        // Flash
        s.flashOpacity = Math.sin(mp * Math.PI) * 0.7;
        refs.flash.material.opacity = s.flashOpacity;

        // Grid still animates
        refs.grid.material.uniforms.time.value = t * 1.8;
        refs.grid.material.uniforms.source1.value.set(bh1.position.x, bh1.position.z);
        refs.grid.material.uniforms.source2.value.set(bh2.position.x, bh2.position.z);
        refs.grid.material.uniforms.separation.value = bh1.position.distanceTo(bh2.position);
        refs.grid.material.uniforms.amplitude.value = pr.waveAmplitude * (1 + mp * 2);

        // Burst wave rings on merge
        if (mp > 0.5 && t - s.lastRingTime > 0.05) {
          spawnWaveRing(0, 0, mp * 2);
          s.lastRingTime = t;
        }

        if (mp >= 1) {
          s.phase = PHASE.MERGED;
          bh1.visible = false;
          bh2.visible = false;
          refs.mergedBH.visible = true;
          refs.mergedBH.position.set(0, 0, 0);
          setPhase(PHASE.MERGED);
        }
      }

      // ── MERGED PHASE ──────────────────────────────────────────────────────
      if (s.phase === PHASE.MERGED) {
        refs.flash.material.opacity = Math.max(0, refs.flash.material.opacity - 0.02);
        refs.mergedBH.userData.diskGroup.rotation.y = t * 0.2;
        refs.mergedBH.userData.glowMat.uniforms.viewVector.value.copy(camera.position);
        refs.mergedBH.userData.haloMat.uniforms.viewVector.value.copy(camera.position);

        // Ringdown — grid dampens
        refs.grid.material.uniforms.amplitude.value = Math.max(0, refs.grid.material.uniforms.amplitude.value - 0.005);
        refs.grid.material.uniforms.time.value = t * 1.8;
        refs.grid.material.uniforms.source1.value.set(0, 0);
        refs.grid.material.uniforms.source2.value.set(0, 0);

        // Auto loop
        if (pr.autoLoop && refs.grid.material.uniforms.amplitude.value <= 0.02) {
          resetScene();
        }
      }

      // ── WAVE RINGS ────────────────────────────────────────────────────────
      const toRemove = [];
      s.waveRings.forEach(({ mesh }) => {
        if (!mesh.parent) return;
        const age = t - (mesh.userData.born / 1000 || 0);
        mesh.scale.x += 0.06;
        mesh.scale.y += 0.06;
        mesh.scale.z += 0.06;
        mesh.material.opacity = Math.max(0, mesh.userData.baseOpacity - mesh.scale.x * 0.07);
        if (mesh.material.opacity <= 0) toRemove.push(mesh);
      });
      toRemove.forEach((m) => {
        scene.remove(m);
        m.geometry.dispose();
        m.material.dispose();
        s.waveRings = s.waveRings.filter((r) => r.mesh !== m);
        const idx = refs.waveRingMeshes.indexOf(m);
        if (idx > -1) refs.waveRingMeshes.splice(idx, 1);
      });

      renderer.render(scene, camera);
    }

    animate();

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
  }, [resetScene]);

  // ── React to mass changes (rebuild BH units) ──────────────────────────────
  useEffect(() => {
    const refs = sceneRef.current;
    if (!refs || phase !== PHASE.ORBIT) return;
    const s = refs.bh1.userData.baseScale;
    const newS = Math.cbrt(params.mass1 / 20) * 0.7;
    refs.bh1.userData.bhMesh.scale.setScalar(newS);
    refs.bh1.userData.glowMesh.scale.setScalar(newS);
    refs.bh1.userData.haloMesh.scale.setScalar(newS);
  }, [params.mass1, phase]);

  useEffect(() => {
    const refs = sceneRef.current;
    if (!refs || phase !== PHASE.ORBIT) return;
    const newS = Math.cbrt(params.mass2 / 20) * 0.7;
    refs.bh2.userData.bhMesh.scale.setScalar(newS);
    refs.bh2.userData.glowMesh.scale.setScalar(newS);
    refs.bh2.userData.haloMesh.scale.setScalar(newS);
  }, [params.mass2, phase]);

  // ── Sliders & toggles ─────────────────────────────────────────────────────
  const totalMass = params.mass1 + params.mass2;
  const rs1 = schwarzschildRadius(params.mass1);
  const rs2 = schwarzschildRadius(params.mass2);
  const chirpMass = Math.pow(params.mass1 * params.mass2, 3 / 5) / Math.pow(totalMass, 1 / 5);

  const sliders = [
    {
      id: 'mass1',
      label: 'MASS 1',
      value: params.mass1,
      min: 1,
      max: 50,
      step: 0.5,
      format: (v) => `${v.toFixed(1)} M☉`,
      tooltip:
        'Mass of the first black hole. Larger mass = bigger event horizon and stronger gravitational wave emission.',
      onChange: (v) => set('mass1', v),
    },
    {
      id: 'mass2',
      label: 'MASS 2',
      value: params.mass2,
      min: 1,
      max: 50,
      step: 0.5,
      format: (v) => `${v.toFixed(1)} M☉`,
      tooltip: 'Mass of the second black hole. Unequal masses produce orbital asymmetry and stronger waves.',
      onChange: (v) => set('mass2', v),
    },
    {
      id: 'waveAmplitude',
      label: 'WAVE AMP',
      value: params.waveAmplitude,
      min: 0,
      max: 2,
      step: 0.05,
      format: (v) => v.toFixed(2),
      tooltip:
        'Spacetime grid deformation intensity. Real gravitational waves distort space by less than a proton width — amplified here for visibility.',
      onChange: (v) => set('waveAmplitude', v),
    },
  ];

  const toggles = [
    { id: 'grid', label: 'SPACETIME GRID', active: params.showGrid, onClick: () => set('showGrid', !params.showGrid) },
    {
      id: 'rings',
      label: 'WAVE RINGS',
      active: params.showWaveRings,
      onClick: () => set('showWaveRings', !params.showWaveRings),
    },
    {
      id: 'disks',
      label: 'ACCRETION DISKS',
      active: params.showDisks,
      onClick: () => set('showDisks', !params.showDisks),
    },
    { id: 'loop', label: 'AUTO LOOP', active: params.autoLoop, onClick: () => set('autoLoop', !params.autoLoop) },
  ];

  const inspiralOptions = ['slow', 'medium', 'fast'];

  const statsItems = useMemo(() => {
    return [
      { label: 'M1', value: params.mass1.toFixed(1), unit: 'M☉' },
      { label: 'M2', value: params.mass2.toFixed(1), unit: 'M☉' },
      { label: 'Total', value: totalMass.toFixed(1), unit: 'M☉' },
      { label: 'Chirp', value: chirpMass.toFixed(1), unit: 'M☉' },
      { label: 'Phase', value: phase.toUpperCase() },
    ];
  }, [params.mass1, params.mass2, totalMass, chirpMass, phase]);

  return (
    <div className={styles.root}>
      <canvas ref={canvasRef} className={styles.canvas} />

      <Scanlines />

      <Hud>
        <TopBar
          title={'Binary Merger'}
          subtitle={'GRAVITATIONAL WAVES · INSPIRAL · LIGO GW150914'}
          statsItems={statsItems}
          glossaryItems={GLOSSARY_ITEMS}
        />

        {/* Controls */}
        <div className={styles.controlsWrap}>
          <div className={styles.panel}>
            <div className={styles.panelTitle}>PARAMETERS</div>

            <SliderGroup items={sliders} />

            {/* Inspiral rate selector */}
            <div className={styles.param}>
              <div className={styles.paramHeader}>
                <span
                  className={styles.paramLabel}
                  data-tip="How fast the orbit decays. Real inspiral takes millions of years — compressed here."
                >
                  INSPIRAL
                </span>
              </div>
              <div className={styles.rateButtons}>
                {inspiralOptions.map((opt) => (
                  <button
                    key={opt}
                    className={`${styles.rateBtn} ${params.inspiralRate === opt ? styles.rateActive : ''}`}
                    onClick={() => set('inspiralRate', opt)}
                  >
                    {opt.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>

            <ToggleGroup items={toggles} />

            {/* Reset */}
            <button className={styles.resetBtn} onClick={resetScene}>
              ↺ RESET
            </button>
          </div>
        </div>

        {/* Phase indicator */}
        <div className={styles.phaseBlock}>
          {phase === PHASE.ORBIT && <span className={styles.phaseOrbit}>● INSPIRAL IN PROGRESS</span>}
          {phase === PHASE.MERGING && <span className={styles.phaseMerge}>◉ MERGER EVENT</span>}
          {phase === PHASE.MERGED && <span className={styles.phaseDone}>◎ RINGDOWN</span>}
        </div>

        <Hint items={HINT_ITEMS} />
      </Hud>
    </div>
  );
}
