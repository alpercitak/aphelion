import { useEffect } from 'react';
import type { CanvasRefType, SceneRefType } from '@/types';
import { setupScene } from '@/utils/setup';
import { SCENE_PARAMS } from '../constants';
import type { NebulaUniforms, SceneRef, ShockUniforms, StarUniforms } from '../types';
import { createEjectaParticles } from '../utils/ejecta-particles';
import { createEjectaShell } from '../utils/ejecta-shell';
import { createFlash } from '../utils/flash';
import { createNebula } from '../utils/nebula';
import { createNeutrinoParticles } from '../utils/neutrino-particles';
import { createProgenitorStar } from '../utils/progenitor-star';
import { createRemnant, getRemnantType } from '../utils/remnant';
import { createShockwave } from '../utils/shockwave';

export const useInit = (canvasRef: CanvasRefType, sceneRef: SceneRefType<SceneRef>) => {
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      return;
    }

    const { renderer, scene, camera, orbit, stars, dispose } = setupScene({
      canvas,
      cameraPosition: [0, 2, 7],
      orbitOptions: { radius: 7, minRadius: 2, maxRadius: 25 },
      toneMappingExposure: 1.3,
    });

    // Build all objects — visibility driven by timeline
    const star = createProgenitorStar(SCENE_PARAMS.progenitorMass);
    const flash = createFlash();
    const shockwave = createShockwave(1.0);
    const ejectaShell = createEjectaShell(1.5, 15000);
    const ejectaParticles = createEjectaParticles();
    const neutrinoParticles = createNeutrinoParticles();
    const nebula = createNebula(2.0);

    const remnantType = getRemnantType(SCENE_PARAMS.progenitorMass);
    const remnant = remnantType !== 'none' ? createRemnant(remnantType) : null;

    // All hidden initially except star
    shockwave.visible = false;
    ejectaShell.visible = false;
    ejectaParticles.visible = false;
    neutrinoParticles.visible = false;
    nebula.visible = false;
    if (remnant) {
      remnant.visible = false;
      scene.add(remnant);
    }

    scene.add(star, shockwave, ejectaShell, ejectaParticles, neutrinoParticles, nebula);

    camera.add(flash);
    flash.position.z = -1;
    scene.add(camera);

    // Typed uniform refs
    const starUniforms = star.material.uniforms as StarUniforms;
    const shockUniforms = shockwave.material.uniforms as ShockUniforms;
    const nebulaUniforms = nebula.material.uniforms as NebulaUniforms;

    sceneRef.current = {
      core: { renderer, scene, camera, orbit, stars },
      entities: {
        star,
        flash,
        shockwave,
        ejectaShell,
        ejectaParticles,
        neutrinoParticles,
        nebula,
        remnant,
        starUniforms,
        shockUniforms,
        nebulaUniforms,
      },
    };

    return () => dispose();
  }, [canvasRef, sceneRef]);
};
