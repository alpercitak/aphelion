import { useEffect, useRef } from 'react';
import {
  BackSide,
  Color,
  FrontSide,
  LinearFilter,
  Material,
  PerspectiveCamera,
  PointsMaterial,
  RGBAFormat,
  Scene,
  ShaderMaterial,
  Vector3,
  WebGLRenderTarget,
} from 'three';

import SceneLayout from '@/components/app/scene-layout';
import { useSceneAnimation } from '@/hooks/scene-animation';
import type { UniformValue } from '@/types';
import { setupScene } from '@/utils/setup';

import { DESTINATION_COLOR_MAP, PARAMS } from './constants';
import { useControls } from './hooks/controls';
import { useHud } from './hooks/hud';
import type { SceneRef } from './types';
import { createDestinationStars } from './utils/destination-stars';
import { createExoticHalo } from './utils/exotic-halo';
import { createFresnelGlow } from './utils/fresnel-glow';
import { createLensingRings } from './utils/lensing-rings';
import { createPortalDisc } from './utils/portal-disc';
import { createThroatRim } from './utils/throat-rim';

export default function Wormhole() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sceneRef = useRef<SceneRef | null>(null);

  const { params, paramsRef, controls } = useControls();
  const hud = useHud(params);

  // ── Three.js setup ──────────────────────────────────────────────────────────
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      return;
    }

    const { renderer, scene, camera, orbit, stars, dispose } = setupScene({
      canvas,
      cameraPosition: [0, 1.5, 5],
      orbitOptions: { radius: 5, minRadius: 2, maxRadius: 20 },
    });

    // ── Portal (secondary) scene — rendered to texture ────────────────────────
    const renderTarget = new WebGLRenderTarget(512, 512, {
      minFilter: LinearFilter,
      magFilter: LinearFilter,
      format: RGBAFormat,
    });

    const portalScene = new Scene();
    const portalCamera = new PerspectiveCamera(90, 1, 0.01, 500);
    portalCamera.position.set(0, 0, 0.1);
    portalCamera.lookAt(0, 0, -1);

    const destinationStars = createDestinationStars(DESTINATION_COLOR_MAP[PARAMS.destination]);
    portalScene.add(destinationStars);

    // ── Wormhole objects ──────────────────────────────────────────────────────
    const r = PARAMS.throatRadius;

    const portalDisc = createPortalDisc(r, renderTarget);
    // face portal disc toward camera (opening faces +Z)
    portalDisc.rotation.x = Math.PI * 0.5;
    scene.add(portalDisc);

    const rim = createThroatRim(r);
    scene.add(rim);

    const innerGlow = createFresnelGlow(camera.position, 0xbbddff, r * 1.3, FrontSide, 3.0);
    const outerGlow = createFresnelGlow(camera.position, 0x6699ff, r * 2.0, BackSide, 4.5);
    scene.add(innerGlow, outerGlow);

    const lensingRings = createLensingRings(r, PARAMS.lensingStrength);
    lensingRings.forEach((ring) => {
      ring.rotation.x = Math.PI * 0.5;
      scene.add(ring);
    });

    const exoticHalo = createExoticHalo(r, PARAMS.exoticDensity);
    exoticHalo.visible = PARAMS.showExoticHalo;
    scene.add(exoticHalo);

    // extract typed uniform refs
    const rimUniforms = rim.material.uniforms as {
      viewVector: UniformValue<Vector3>;
      glowColor: UniformValue<Color>;
    };
    const innerGlowUniforms = innerGlow.material.uniforms as {
      viewVector: UniformValue<Vector3>;
    };
    const outerGlowUniforms = outerGlow.material.uniforms as {
      viewVector: UniformValue<Vector3>;
    };
    const portalUniforms = portalDisc.material.uniforms as {
      time: UniformValue<number>;
      distortion: UniformValue<number>;
    };

    sceneRef.current = {
      renderer,
      scene,
      portalScene,
      camera,
      portalCamera,
      orbit,
      renderTarget,
      rim,
      portalDisc,
      innerGlow,
      outerGlow,
      lensingRings,
      exoticHalo,
      destinationStars,
      stars,
      rimUniforms,
      innerGlowUniforms,
      outerGlowUniforms,
      portalUniforms,
    };

    return () => {
      renderTarget.dispose();
      dispose();
    };
  }, []);

  // ── Animation loop ──────────────────────────────────────────────────────
  useSceneAnimation((time) => {
    const refs = sceneRef.current;
    const params = paramsRef.current;
    if (!refs) {
      return;
    }

    const {
      renderer,
      scene,
      portalScene,
      camera,
      portalCamera,
      orbit,
      renderTarget,
      stars,
      destinationStars,
      portalUniforms,
      rimUniforms,
      innerGlowUniforms,
      outerGlowUniforms,
      lensingRings,
      exoticHalo,
    } = refs;

    orbit.updateCamera(camera);

    stars.rotation.y = time * 0.002;
    destinationStars.rotation.y = -time * 0.003;
    destinationStars.rotation.x = time * 0.001;

    portalCamera.rotation.y = time * 0.08;
    portalCamera.rotation.x = Math.sin(time * 0.15) * 0.1;

    portalUniforms.time.value = time;
    portalUniforms.distortion.value = params.lensingStrength;

    rimUniforms.viewVector.value.copy(camera.position);
    innerGlowUniforms.viewVector.value.copy(camera.position);
    outerGlowUniforms.viewVector.value.copy(camera.position);

    if (params.showExoticHalo) {
      exoticHalo.rotation.y = time * 0.12;
      exoticHalo.rotation.z = time * 0.07;
      (exoticHalo.material as PointsMaterial).opacity = 0.3 + Math.sin(time * 1.4) * 0.15 * params.exoticDensity;
    }

    lensingRings.forEach((ring, i) => {
      ring.lookAt(camera.position);
      (ring.material as ShaderMaterial).uniforms['opacity']!.value =
        (1 - (i + 1) / lensingRings.length) * 0.5 * params.lensingStrength;
    });

    renderer.setRenderTarget(renderTarget);
    renderer.render(portalScene, portalCamera);
    renderer.setRenderTarget(null);
    renderer.render(scene, camera);
  });

  // ── Param effects ─────────────────────────────────────────────────────────
  // rebuild geometry when throat radius changes
  useEffect(() => {
    const refs = sceneRef.current;
    if (!refs) return;
    const { scene, camera } = refs;
    const r = params.throatRadius;

    // Rebuild rim
    scene.remove(refs.rim);
    refs.rim.geometry.dispose();
    refs.rim.material.dispose();
    const newRim = createThroatRim(r);
    scene.add(newRim);
    refs.rim = newRim;
    refs.rimUniforms = newRim.material.uniforms as {
      viewVector: UniformValue<Vector3>;
      glowColor: UniformValue<Color>;
    };

    // Rebuild portal disc
    scene.remove(refs.portalDisc);
    refs.portalDisc.geometry.dispose();
    refs.portalDisc.material.dispose();
    const newDisc = createPortalDisc(r, refs.renderTarget);
    newDisc.rotation.x = Math.PI * 0.5;
    scene.add(newDisc);
    refs.portalDisc = newDisc;
    refs.portalUniforms = newDisc.material.uniforms as { time: { value: number }; distortion: { value: number } };

    // Rebuild glow
    scene.remove(refs.innerGlow, refs.outerGlow);
    refs.innerGlow.geometry.dispose();
    refs.innerGlow.material.dispose();
    refs.outerGlow.geometry.dispose();
    refs.outerGlow.material.dispose();
    const newInner = createFresnelGlow(camera.position, 0xbbddff, r * 1.3, FrontSide, 3.0);
    const newOuter = createFresnelGlow(camera.position, 0x6699ff, r * 2.0, BackSide, 4.5);
    scene.add(newInner, newOuter);
    refs.innerGlow = newInner;
    refs.outerGlow = newOuter;
    refs.innerGlowUniforms = newInner.material.uniforms as { viewVector: UniformValue<Vector3> };
    refs.outerGlowUniforms = newOuter.material.uniforms as { viewVector: UniformValue<Vector3> };

    // Rebuild lensing rings
    refs.lensingRings.forEach((ring) => {
      scene.remove(ring);
      ring.geometry.dispose();
      (ring.material as Material).dispose();
    });
    const newRings = createLensingRings(r, params.lensingStrength);
    newRings.forEach((ring) => {
      ring.rotation.x = Math.PI * 0.5;
      scene.add(ring);
    });
    refs.lensingRings = newRings;

    // Rebuild exotic halo
    scene.remove(refs.exoticHalo);
    refs.exoticHalo.geometry.dispose();
    const newHalo = createExoticHalo(r, params.exoticDensity);
    newHalo.visible = params.showExoticHalo;
    scene.add(newHalo);
    refs.exoticHalo = newHalo;
  }, [params.throatRadius]);

  // destination star field color
  useEffect(() => {
    const refs = sceneRef.current;
    if (!refs) return;
    refs.portalScene.remove(refs.destinationStars);
    refs.destinationStars.geometry.dispose();
    const newStars = createDestinationStars(DESTINATION_COLOR_MAP[params.destination]);
    refs.portalScene.add(newStars);
    refs.destinationStars = newStars;
  }, [params.destination]);

  // exotic halo density
  useEffect(() => {
    const refs = sceneRef.current;
    if (!refs) return;
    refs.scene.remove(refs.exoticHalo);
    refs.exoticHalo.geometry.dispose();
    const newHalo = createExoticHalo(params.throatRadius, params.exoticDensity);
    newHalo.visible = params.showExoticHalo;
    refs.scene.add(newHalo);
    refs.exoticHalo = newHalo;
  }, [params.exoticDensity, params.throatRadius]);

  useEffect(() => {
    const refs = sceneRef.current;
    if (!refs) return;
    refs.exoticHalo.visible = params.showExoticHalo;
    refs.lensingRings.forEach((r) => {
      r.visible = params.showLensingRings;
    });
    refs.stars.visible = params.showStars;
  }, [params.showExoticHalo, params.showLensingRings, params.showStars]);

  return <SceneLayout canvasRef={canvasRef} hud={hud} controls={controls} />;
}
