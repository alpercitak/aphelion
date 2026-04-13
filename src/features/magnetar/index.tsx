import { useEffect, useMemo, useRef } from 'react';
import { BackSide, Clock, FrontSide, LineBasicMaterial, Mesh, MeshBasicMaterial, PointsMaterial, Vector3 } from 'three';

import SceneLayout, { type SceneLayoutControlsProps, type SceneLayoutHudProps } from '@/components/app/scene-layout';
import { useParams } from '@/hooks/params';
import { setupScene } from '@/utils/setup';

import {
  BASE_HUD_PROPS,
  NS_RADIUS,
  PARAMS,
  RADIO_ITEMS,
  SLIDER_ITEMS,
  STARQUAKE_DURATION,
  STARQUAKE_RATES,
  TOGGLE_ITEMS,
} from './constants';
import type { ActiveCrack, Params, SceneRef, StarquakeRate } from './types';
import { createFieldHalo } from './utils/field-halo';
import { createFieldLines } from './utils/field-lines';
import { createGammaBurstFlash } from './utils/gamma-burst';
import { createGlow } from './utils/glow';
import { createMagnetarBody } from './utils/magnetar';
import { createStarquakeCrack } from './utils/starquake-crack';

export default function Magnetar() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sceneRef = useRef<SceneRef | null>(null);

  const { params, paramsRef, set } = useParams<Params>(PARAMS);

  // ── Three.js setup ──────────────────────────────────────────────────────────
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      return;
    }

    // ── Setup ──────────────────────────────────────────────────────────────
    const { renderer, scene, camera, orbit, stars, dispose } = setupScene({
      canvas,
      cameraPosition: [0, 1.5, 4.5],
      orbitOptions: { radius: 4.5, minRadius: 1.5, maxRadius: 18 },
    });

    const body = createMagnetarBody();
    const innerGlow = createGlow(camera.position, 0x99bbff, NS_RADIUS * 1.7, FrontSide);
    const outerGlow = createGlow(camera.position, 0x3366ff, NS_RADIUS * 2.8, BackSide);
    const fieldLines = createFieldLines(PARAMS.fieldStrength);
    const fieldHalo = createFieldHalo();
    const flash = createGammaBurstFlash();

    camera.add(flash);
    flash.position.z = -1;
    scene.add(body, innerGlow, outerGlow, fieldLines, fieldHalo, camera);

    sceneRef.current = {
      renderer,
      scene,
      camera,
      orbit,
      body,
      innerGlow,
      outerGlow,
      fieldLines,
      fieldHalo,
      flash,
      activeCracks: [],
      lastQuakeTime: 0,
      lastBurstTime: -999,
      burstOpacity: 0,
    };

    // ── Animation loop ──────────────────────────────────────────────────────
    const clock = new Clock();
    let raf: number;

    function spawnStarquake(t: number) {
      const refs = sceneRef.current;
      if (!refs) {
        return;
      }
      // Random point on sphere surface
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const origin = new Vector3(
        NS_RADIUS * Math.sin(phi) * Math.cos(theta),
        NS_RADIUS * Math.sin(phi) * Math.sin(theta),
        NS_RADIUS * Math.cos(phi),
      );
      const crack = createStarquakeCrack(origin);
      scene.add(crack);
      refs.activeCracks.push({ mesh: crack, born: t });
      refs.lastQuakeTime = t;

      // Trigger gamma burst
      if (paramsRef.current.showGammaBursts) {
        refs.burstOpacity = paramsRef.current.burstIntensity * 0.6;
        refs.lastBurstTime = t;
      }
    }

    function animate() {
      raf = requestAnimationFrame(animate);
      const t = clock.getElapsedTime();
      const p = paramsRef.current;
      const refs = sceneRef.current;
      if (!refs) return;

      orbit.updateCamera(camera);
      stars.rotation.y = t * 0.0015;

      // Surface shader
      body.material.uniforms['time']!.value = t;
      body.material.uniforms['fieldStrength']!.value = p.fieldStrength;
      // Normalise surfaceTemp from [1e6, 1e8] to [0, 1]
      body.material.uniforms['surfaceTemp']!.value = (p.surfaceTemp - 1e6) / (1e8 - 1e6);

      // Slow body rotation — magnetars spin slower than pulsars (~0.1–10 RPM)
      body.rotation.y = t * 0.3;

      // Glow view vectors
      innerGlow.material.uniforms['viewVector']!.value.copy(camera.position);
      outerGlow.material.uniforms['viewVector']!.value.copy(camera.position);

      // Writhing field lines — sine-based phase offset per child
      if (p.showFieldLines) {
        fieldLines.visible = true;
        fieldLines.children.forEach((child, i) => {
          // Rotate each line at a slightly different rate — creates writhing effect
          child.rotation.y = t * (0.04 + i * 0.003) * p.fieldStrength;
          child.rotation.x = Math.sin(t * 0.15 + i * 0.4) * 0.08 * p.fieldStrength;
          if (child instanceof Mesh && child.material instanceof MeshBasicMaterial) {
            child.material.opacity = p.fieldStrength * (0.08 + (i % 3) * 0.06);
          }
        });
      } else {
        fieldLines.visible = false;
      }

      // Field halo pulse
      fieldHalo.visible = p.showFieldDistortion;
      if (p.showFieldDistortion) {
        const haloPulse = 0.4 + Math.sin(t * 1.2) * 0.1;
        (fieldHalo.material as PointsMaterial).opacity = haloPulse * p.fieldStrength * 0.5;
        fieldHalo.rotation.y = t * 0.05;
        fieldHalo.rotation.x = t * 0.03;
      }

      // Starquake spawning
      if (p.showStarquakes && p.starquakeRate !== 'off') {
        const interval = STARQUAKE_RATES[p.starquakeRate];
        if (t - refs.lastQuakeTime > interval) {
          spawnStarquake(t);
        }
      }

      // Animate active cracks — fade out over STARQUAKE_DURATION
      const expiredCracks: Array<ActiveCrack> = [];
      refs.activeCracks.forEach((crack) => {
        const age = t - crack.born;
        const opacity = Math.max(0, 1 - age / STARQUAKE_DURATION);
        (crack.mesh.material as LineBasicMaterial).opacity = opacity;
        // Expand slightly as it fades
        const expand = 1 + age * 0.15;
        crack.mesh.scale.setScalar(expand);
        if (opacity <= 0) expiredCracks.push(crack);
      });
      expiredCracks.forEach(({ mesh }) => {
        scene.remove(mesh);
        mesh.geometry.dispose();
        refs.activeCracks = refs.activeCracks.filter((c) => c.mesh !== mesh);
      });

      // Gamma burst flash decay
      if (refs.burstOpacity > 0) {
        refs.burstOpacity = Math.max(0, refs.burstOpacity - 0.018);
        flash.material.opacity = refs.burstOpacity;
      } else {
        flash.material.opacity = 0;
      }

      renderer.render(scene, camera);
    }

    animate();

    return () => {
      cancelAnimationFrame(raf);
      dispose();
    };
  }, []);

  // Rebuild field lines when strength changes significantly
  useEffect(() => {
    const refs = sceneRef.current;
    if (!refs) {
      return;
    }
    refs.scene.remove(refs.fieldLines);
    refs.fieldLines.traverse((o) => {
      if (o instanceof Mesh) {
        o.geometry.dispose();
        o.material.dispose();
      }
    });
    const newLines = createFieldLines(params.fieldStrength);
    newLines.visible = params.showFieldLines;
    refs.scene.add(newLines);
    refs.fieldLines = newLines;
  }, [params.fieldStrength]);

  useEffect(() => {
    const refs = sceneRef.current;
    if (!refs) {
      return;
    }
    refs.fieldLines.visible = params.showFieldLines;
    refs.fieldHalo.visible = params.showFieldDistortion;
  }, [params.showFieldLines, params.showFieldDistortion]);

  // Manual burst trigger when toggle is turned on
  useEffect(() => {
    const refs = sceneRef.current;
    if (!refs || !params.showGammaBursts) {
      return;
    }
    refs.burstOpacity = params.burstIntensity * 0.4;
  }, [params.showGammaBursts, params.burstIntensity]);

  // ── Stats ─────────────────────────────────────────────────────────────────
  const stats = useMemo(() => {
    const fieldGauss = `10^${(13 + params.fieldStrength).toFixed(1)}`;
    const tempMK = (params.surfaceTemp / 1e6).toFixed(0);
    return [
      { label: 'FIELD', value: fieldGauss, unit: 'G' },
      { label: 'TEMP', value: `${tempMK}`, unit: 'MK' },
      { label: 'RADIUS', value: '~10', unit: 'km' },
      { label: 'SPIN', value: '~0.1–10', unit: 'RPM' },
    ];
  }, [params.fieldStrength, params.surfaceTemp]);

  const hudProps = {
    ...BASE_HUD_PROPS,
    stats,
  } satisfies SceneLayoutHudProps;

  const controlsProps = {
    sliders: SLIDER_ITEMS.map((item) => ({
      ...item,
      value: params[item.id] as number,
      onChange: (v: number) => set(item.id, v),
    })),
    radios: RADIO_ITEMS.map((item) => ({
      ...item,
      value: params[item.id],
      onChange: (v: string) => set(item.id, v as StarquakeRate),
    })),
    toggles: TOGGLE_ITEMS.map((item) => ({
      ...item,
      active: params[item.id],
      onClick: () => set(item.id, !params[item.id]),
    })),
  } satisfies SceneLayoutControlsProps;

  return <SceneLayout canvasRef={canvasRef} hud={hudProps} controls={controlsProps} />;
}
