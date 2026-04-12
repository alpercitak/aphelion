import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  Clock,
  Mesh,
  MeshBasicMaterial,
  Object3D,
  PerspectiveCamera,
  Points,
  Scene,
  Vector3,
  WebGLRenderer,
} from 'three';

import Button from '@/components/ui/button';
import SliderGroup from '@/components/ui/slider-group';
import ToggleGroup from '@/components/ui/toggle-group';
import SceneLayout from '@/layouts/scene';
import { createOrbitControls } from '@/utils/camera';
import { schwarzschildRadius } from '@/utils/physics';
import { createStarField } from '@/utils/starfield';

import {
  BEAM_FLASH_THRESHOLD,
  BEAM_WIDTH_OPTIONS,
  GLOSSARY_ITEMS,
  HINT_ITEMS,
  PARAMS,
  SLIDER_ITEMS,
  SUBTITLE,
  TITLE,
  TOGGLE_ITEMS,
} from './constants';
import type { Params, SceneRef } from './types';
import { createAccretionDisk } from './utils/accretion-disk';
import { createBeamFlash } from './utils/beam-flash';
import { createFieldLines } from './utils/field-lines';
import { createGlow, createOuterGlow } from './utils/glow';
import { createNeutronStarBody } from './utils/neutron-star';
import { createPulsarBeams } from './utils/pulsar-beams';

export default function NeutronStar() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sceneRef = useRef<SceneRef | null>(null);

  const [params, setParams] = useState<Params>(PARAMS);
  const paramsRef = useRef(params);

  useEffect(() => {
    paramsRef.current = params;
  });

  const set = useCallback(<K extends keyof Params>(key: K, value: Params[K]) => {
    setParams((prev) => ({ ...prev, [key]: value }));
  }, []);

  // ── Three.js setup ──────────────────────────────────────────────────────────
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      return;
    }

    const renderer = new WebGLRenderer({ canvas, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);

    const scene = new Scene();
    const camera = new PerspectiveCamera(55, window.innerWidth / window.innerHeight, 0.01, 1000);
    camera.position.set(0, 2, 5);
    camera.lookAt(0, 0, 0);

    const orbit = createOrbitControls(canvas, { radius: 5, minRadius: 1.5, maxRadius: 20 });

    // Star field — slightly blue-tinted for X-ray environment
    const stars = createStarField(4000);
    scene.add(stars);

    // Neutron star body
    const starBody = createNeutronStarBody(PARAMS.mass);
    scene.add(starBody);

    // Glow layers
    const glow = createGlow(camera.position);
    const outerGlow = createOuterGlow(camera.position);
    scene.add(glow, outerGlow);

    // Rotator — beams rotate with the star's spin axis
    const rotator = new Object3D();
    scene.add(rotator);

    // Magnetic tilt object — field lines tilt ~25° from rotation axis
    const fieldTiltObj = new Object3D();
    fieldTiltObj.rotation.z = 0.25;
    rotator.add(fieldTiltObj);

    const beams = createPulsarBeams(PARAMS.beamWidth);
    fieldTiltObj.add(beams);

    const fieldLines = createFieldLines(PARAMS.fieldStrength);
    fieldTiltObj.add(fieldLines);

    // Accretion disk — flat, not tilted
    const accretionDisk = createAccretionDisk();
    accretionDisk.visible = PARAMS.showAccretionDisk;
    scene.add(accretionDisk);

    // Beam flash overlay — attached to camera so it always faces viewer
    const flash = createBeamFlash();
    camera.add(flash);
    flash.position.z = -1;
    scene.add(camera);

    sceneRef.current = {
      renderer,
      scene,
      camera,
      orbit,
      starBody,
      glow,
      outerGlow,
      rotator,
      beams,
      fieldLines,
      accretionDisk,
      flash,
    };

    // ── Animation loop ────────────────────────────────────────────────────────
    const clock = new Clock();
    let raf: number;

    function animate() {
      raf = requestAnimationFrame(animate);
      const t = clock.getElapsedTime();
      const p = paramsRef.current;

      orbit.updateCamera(camera);
      stars.rotation.y = t * 0.002;

      // Rotate star + beams + field lines
      const radsPerSec = (p.rpm / 60) * Math.PI * 2;
      rotator.rotation.y = t * radsPerSec;
      starBody.rotation.y = t * radsPerSec;

      // Surface shader uniforms
      starBody.material.uniforms.time.value = t;
      starBody.material.uniforms.rpm.value = p.rpm;
      starBody.material.uniforms.mass.value = p.mass;

      // Glow view vectors
      glow.material.uniforms.viewVector.value.copy(camera.position);
      outerGlow.material.uniforms.viewVector.value.copy(camera.position);

      // Beam flash — check alignment of beam axis with camera direction
      if (p.showBeamFlash) {
        // Beam axis in world space (rotated with rotator + tilt)
        const beamAxisWorld = new Vector3(0, 1, 0).applyEuler(rotator.rotation);
        const camDir = camera.position.clone().normalize();
        const alignment = Math.abs(beamAxisWorld.dot(camDir));

        const prevOpacity = flash.material.opacity;
        if (alignment > BEAM_FLASH_THRESHOLD) {
          // Ramp up flash
          flash.material.opacity = Math.min(0.35, prevOpacity + 0.06);
        } else {
          // Decay flash
          flash.material.opacity = Math.max(0, prevOpacity - 0.04);
        }
      } else {
        flash.material.opacity = 0;
      }

      // Field line opacity driven by fieldStrength
      fieldLines.children.forEach((child) => {
        if (child instanceof Mesh && child.material instanceof MeshBasicMaterial) {
          child.material.opacity = p.fieldStrength * 0.3;
        }
      });

      // Accretion disk slow rotation
      if (p.showAccretionDisk) {
        accretionDisk.rotation.y = t * 0.15;
      }

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
  }, []);

  // ── Param effects ─────────────────────────────────────────────────────────

  // Rebuild beams when width changes
  useEffect(() => {
    const refs = sceneRef.current;
    if (!refs) return;
    const { rotator, fieldLines } = refs;
    // Find and replace beams in the tilt object
    const tiltObj = rotator.children[0];
    const oldBeams = refs.beams;
    tiltObj.remove(oldBeams);
    oldBeams.traverse((o) => {
      if (o instanceof Mesh || o instanceof Points) {
        o.geometry.dispose();
        if (Array.isArray(o.material)) o.material.forEach((m) => m.dispose());
        else o.material.dispose();
      }
    });
    const newBeams = createPulsarBeams(params.beamWidth);
    newBeams.visible = params.showBeams;
    tiltObj.add(newBeams);
    refs.beams = newBeams;
  }, [params.beamWidth]);

  useEffect(() => {
    const refs = sceneRef.current;
    if (!refs) {
      return;
    }
    refs.beams.visible = params.showBeams;
  }, [params.showBeams]);

  useEffect(() => {
    const refs = sceneRef.current;
    if (!refs) {
      return;
    }
    refs.fieldLines.visible = params.showFieldLines;
  }, [params.showFieldLines]);

  useEffect(() => {
    const refs = sceneRef.current;
    if (!refs) {
      return;
    }
    refs.accretionDisk.visible = params.showAccretionDisk;
  }, [params.showAccretionDisk]);

  // ── Stats ─────────────────────────────────────────────────────────────────
  const statsItems = useMemo(() => {
    const rs = schwarzschildRadius(params.mass);
    const hz = params.rpm / 60;
    // Surface gravity: g = GM/R² for NS (R ~ 10km)
    const G = 6.674e-11;
    const Msun = 1.989e30;
    const R_NS = 1e4;
    const g = (G * params.mass * Msun) / (R_NS * R_NS);
    const gExponent = Math.floor(Math.log10(g));

    return [
      { label: 'MASS', value: params.mass.toFixed(2), unit: 'M☉' },
      { label: 'FREQ', value: hz.toFixed(1), unit: 'Hz' },
      { label: 'PERIOD', value: hz > 0 ? (1 / hz).toFixed(3) : '—', unit: 's' },
      { label: 'g', value: `~10^${gExponent}`, unit: 'm/s²' },
      { label: 'Rₛ', value: rs.toFixed(1), unit: 'km' },
    ];
  }, [params.mass, params.rpm]);

  // ── Sliders / toggles ─────────────────────────────────────────────────────
  const sliders = SLIDER_ITEMS.map((config) => ({
    ...config,
    value: params[config.id],
    onChange: (v: number) => set(config.id, v),
  }));

  const toggles = TOGGLE_ITEMS.map(({ id, label }) => ({
    id,
    label,
    active: params[id],
    onClick: () => set(id, !params[id]),
  }));

  return (
    <SceneLayout
      title={TITLE}
      subtitle={SUBTITLE}
      statsItems={statsItems}
      glossaryItems={GLOSSARY_ITEMS}
      hintItems={HINT_ITEMS}
    >
      <canvas ref={canvasRef} style={{ display: 'block', width: '100%', height: '100%' }} />

      {/* Controls panel — inline, split into own file later */}
      <div
        style={{
          position: 'fixed',
          bottom: 28,
          left: 28,
          zIndex: 10,
          pointerEvents: 'all',
          width: 240,
          background: 'var(--panel)',
          border: '1px solid var(--border)',
          padding: '18px 20px',
          backdropFilter: 'blur(8px)',
          fontFamily: 'var(--font-mono)',
        }}
      >
        <div
          style={{
            fontSize: 9,
            letterSpacing: '0.35em',
            color: 'var(--accent)',
            marginBottom: 16,
            paddingBottom: 10,
            borderBottom: '1px solid var(--border)',
          }}
        >
          PARAMETERS
        </div>

        <SliderGroup items={sliders} />

        {/* Beam width selector */}
        <div style={{ marginBottom: 14, marginTop: 14 }}>
          <div
            style={{
              fontSize: 10,
              letterSpacing: '0.2em',
              color: 'rgba(255,255,255,0.5)',
              textTransform: 'uppercase',
              marginBottom: 6,
            }}
          >
            BEAM WIDTH
          </div>
          <div style={{ display: 'flex', gap: 4 }}>
            {BEAM_WIDTH_OPTIONS.map((opt) => (
              <Button
                key={opt}
                onClick={() => set('beamWidth', opt)}
                variant={opt === params.beamWidth ? 'primary' : 'secondary'}
                style={{ flex: 1, justifyContent: 'center' }}
              >
                {opt}
              </Button>
            ))}
          </div>
        </div>

        <ToggleGroup items={toggles} />
      </div>
    </SceneLayout>
  );
}
