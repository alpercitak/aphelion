import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ACESFilmicToneMapping, Clock, Mesh, Object3D, PerspectiveCamera, Scene, Vector3, WebGLRenderer } from 'three';

import SceneLayout, { type SceneLayoutControlsProps, type SceneLayoutHudProps } from '@/components/app/scene-layout';
import { createOrbitControls } from '@/utils/camera';
import { createStarField } from '@/utils/starfield';

import { BASE_HUD_PROPS, PARAMS, PHASE_LABEL_MAP, RADIO_ITEMS, SLIDER_ITEMS, TOGGLE_ITEMS } from './constants';
import type { InspiralOption, Params, Phase, SceneRef, StateRef } from './types';
import { applyBlackHoleScale, createBlackHoleUnit, createMergedBlackHole } from './utils/black-hole';
import { createMergerFlash } from './utils/merger-flash';
import { orbitalOmega } from './utils/orbital-omega';
import { orbitalPositions } from './utils/orbital-positions';
import { createSpacetimeGrid } from './utils/spacetime-grid';
import { createWaveRing } from './utils/wave-ring';

const INSPIRAL_RATES = { slow: 0.008, medium: 0.022, fast: 0.055 } as const satisfies Record<InspiralOption, number>;
const INITIAL_SEPARATION = 7.0 as const;
const MERGE_THRESHOLD = 1.2 as const;

export default function BinaryMerger() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sceneRef = useRef<SceneRef>(null);
  const stateRef = useRef<StateRef>({
    separation: INITIAL_SEPARATION,
    angle: 0,
    phase: 'orbit',
    mergeProgress: 0,
    flashOpacity: 0,
    waveRings: [],
    lastRingTime: 0,
    params: PARAMS,
  });

  const [params, setParams] = useState<Params>(PARAMS);
  const paramsRef = useRef(params);

  const [phase, setPhase] = useState<Phase>('orbit');

  useEffect(() => {
    paramsRef.current = params;
  });

  const set = useCallback(<K extends keyof Params>(key: K, value: Params[K]) => {
    setParams((prev) => ({ ...prev, [key]: value }));
  }, []);

  const resetScene = useCallback(() => {
    const s = stateRef.current;
    s.separation = INITIAL_SEPARATION;
    s.angle = 0;
    s.phase = 'orbit';
    s.mergeProgress = 0;
    s.flashOpacity = 0;
    s.waveRings = [];
    s.lastRingTime = 0;
    setPhase('orbit');

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
    const renderer = new WebGLRenderer({ canvas, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.toneMapping = ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;

    const scene = new Scene();
    const camera = new PerspectiveCamera(55, window.innerWidth / window.innerHeight, 0.01, 1000);
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

    const waveRingMeshes: Array<Mesh> = [];

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
    const clock = new Clock();
    let raf: number;

    const spawnWaveRing = (cx: number, cz: number, radius: number) => {
      const ring = createWaveRing(radius);
      ring.position.set(cx, 0.02, cz);
      scene.add(ring);
      waveRingMeshes.push(ring);
      stateRef.current.waveRings.push({ mesh: ring, born: clock.getElapsedTime() });
    };

    function animate() {
      raf = requestAnimationFrame(animate);
      const t = clock.getElapsedTime();
      const s = stateRef.current;
      const pr = paramsRef.current;
      const refs = sceneRef.current;

      if (!refs) {
        return;
      }

      orbit.updateCamera(camera);
      stars.rotation.y = t * 0.002;

      const totalMass = pr.mass1 + pr.mass2;

      // ── ORBIT PHASE ──────────────────────────────────────────────────────
      if (s.phase === 'orbit') {
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
        refs.grid.material.uniforms['source1']!.value.set(pos.x1, pos.z1);
        refs.grid.material.uniforms['source2']!.value.set(pos.x2, pos.z2);
        refs.grid.material.uniforms['separation']!.value = s.separation;
        refs.grid.material.uniforms['amplitude']!.value = pr.waveAmplitude;
        refs.grid.material.uniforms['time']!.value = t * 1.8;
        refs.grid.visible = pr.showGrid;

        // Glow view vectors
        bh1.userData.glowMat.uniforms.viewVector?.value.copy(camera.position).sub(bh1.position);
        bh2.userData.glowMat.uniforms.viewVector?.value.copy(camera.position).sub(bh2.position);
        bh1.userData.haloMat.uniforms.viewVector?.value.copy(camera.position).sub(bh1.position);
        bh2.userData.haloMat.uniforms.viewVector?.value.copy(camera.position).sub(bh2.position);

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
          s.phase = 'merging';
          s.mergeProgress = 0;
          setPhase('merging');
        }
      }

      // ── MERGING PHASE ─────────────────────────────────────────────────────
      if (s.phase === 'merging') {
        s.mergeProgress = Math.min(1, s.mergeProgress + 0.025);
        const mp = s.mergeProgress;

        // Converge both BHs to center
        bh1.position.lerp(new Vector3(0, 0, 0), 0.06);
        bh2.position.lerp(new Vector3(0, 0, 0), 0.06);

        // Scale down as they converge
        const shrink = 1 - mp * 0.4;
        bh1.scale.setScalar(shrink);
        bh2.scale.setScalar(shrink);

        // Flash
        s.flashOpacity = Math.sin(mp * Math.PI) * 0.7;
        refs.flash.material.opacity = s.flashOpacity;

        // Grid still animates
        refs.grid.material.uniforms['time']!.value = t * 1.8;
        refs.grid.material.uniforms['source1']!.value.set(bh1.position.x, bh1.position.z);
        refs.grid.material.uniforms['source2']!.value.set(bh2.position.x, bh2.position.z);
        refs.grid.material.uniforms['separation']!.value = bh1.position.distanceTo(bh2.position);
        refs.grid.material.uniforms['amplitude']!.value = pr.waveAmplitude * (1 + mp * 2);

        // Burst wave rings on merge
        if (mp > 0.5 && t - s.lastRingTime > 0.05) {
          spawnWaveRing(0, 0, mp * 2);
          s.lastRingTime = t;
        }

        if (mp >= 1) {
          s.phase = 'merged';
          bh1.visible = false;
          bh2.visible = false;
          refs.mergedBH.visible = true;
          refs.mergedBH.position.set(0, 0, 0);
          setPhase('merged');
        }
      }

      // ── MERGED PHASE ──────────────────────────────────────────────────────
      if (s.phase === 'merged') {
        refs.flash.material.opacity = Math.max(0, refs.flash.material.opacity - 0.02);
        refs.mergedBH.userData.diskGroup.rotation.y = t * 0.2;
        refs.mergedBH.userData.glowMat.uniforms.viewVector?.value.copy(camera.position);
        refs.mergedBH.userData.haloMat.uniforms.viewVector?.value.copy(camera.position);

        // Ringdown — grid dampens
        refs.grid.material.uniforms['amplitude']!.value = Math.max(
          0,
          refs.grid.material.uniforms.amplitude?.value - 0.005,
        );
        refs.grid.material.uniforms['time']!.value = t * 1.8;
        refs.grid.material.uniforms['source1']!.value.set(0, 0);
        refs.grid.material.uniforms['source2']!.value.set(0, 0);

        // Auto loop
        if (pr.autoLoop && refs.grid.material.uniforms['amplitude']!.value <= 0.02) {
          resetScene();
        }
      }

      // ── WAVE RINGS ────────────────────────────────────────────────────────
      const toRemove: Array<Object3D> = [];
      s.waveRings.forEach(({ mesh }) => {
        if (!mesh.parent) {
          return;
        }
        mesh.scale.x += 0.06;
        mesh.scale.y += 0.06;
        mesh.scale.z += 0.06;
        mesh.material.opacity = Math.max(0, mesh.userData.baseOpacity - mesh.scale.x * 0.07);
        if (mesh.material.opacity <= 0) {
          toRemove.push(mesh);
        }
      });
      toRemove.forEach((m) => {
        scene.remove(m);

        if (m instanceof Mesh) {
          m.geometry.dispose();
          m.material.dispose();
        }

        s.waveRings = s.waveRings.filter((r) => r.mesh !== m);
        const idx = refs.waveRingMeshes.indexOf(m as Mesh);
        if (idx > -1) {
          refs.waveRingMeshes.splice(idx, 1);
        }
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
    if (!refs || phase !== 'orbit') {
      return;
    }
    applyBlackHoleScale(refs.bh1, params.mass1);
    applyBlackHoleScale(refs.bh2, params.mass2);
  }, [params.mass1, params.mass2, phase]);

  // ── SceneLayout ─────────────────────────────────────────────────────
  const totalMass = params.mass1 + params.mass2;
  const chirpMass = Math.pow(params.mass1 * params.mass2, 3 / 5) / Math.pow(totalMass, 1 / 5);

  const stats = useMemo(
    () => [
      { label: 'M1', value: params.mass1.toFixed(1), unit: 'M☉' },
      { label: 'M2', value: params.mass2.toFixed(1), unit: 'M☉' },
      { label: 'Total', value: totalMass.toFixed(1), unit: 'M☉' },
      { label: 'Chirp', value: chirpMass.toFixed(1), unit: 'M☉' },
      { label: 'Phase', value: phase.toUpperCase() },
    ],
    [params.mass1, params.mass2, totalMass, chirpMass, phase],
  );

  const status = useMemo(() => PHASE_LABEL_MAP[phase], [phase]);

  const hudProps = {
    ...BASE_HUD_PROPS,
    status,
    stats,
  } satisfies SceneLayoutHudProps;

  const controlsProps = {
    radios: RADIO_ITEMS.map((item) => ({
      ...item,
      value: params[item.id],
      onChange: (v: string) => set(item.id, v as InspiralOption),
    })),
    sliders: SLIDER_ITEMS.map((item) => ({
      ...item,
      value: params[item.id],
      onChange: (v: number) => set(item.id, v),
    })),
    toggles: TOGGLE_ITEMS.map((item) => ({
      ...item,
      active: params[item.id],
      onClick: () => set(item.id, !params[item.id]),
    })),
    buttons: [{ variant: 'secondary', onClick: resetScene, children: '↺ RESET' }],
  } satisfies SceneLayoutControlsProps;

  return <SceneLayout canvasRef={canvasRef} hud={hudProps} controls={controlsProps} />;
}
