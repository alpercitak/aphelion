import { useEffect } from 'react';
import { BackSide, FrontSide, Material, type Color, type Vector3 } from 'three';
import type { SceneRefType, UniformValue } from '@/types';
import { DESTINATION_COLOR_MAP } from '../constants';
import type { SceneParams, SceneRef } from '../types';
import { createDestinationStars } from '../utils/destination-stars';
import { createExoticHalo } from '../utils/exotic-halo';
import { createFresnelGlow } from '../utils/fresnel-glow';
import { createLensingRings } from '../utils/lensing-rings';
import { createPortalDisc } from '../utils/portal-disc';
import { createThroatRim } from '../utils/throat-rim';

export const useUpdate = (sceneRef: SceneRefType<SceneRef>, params: SceneParams) => {
  // rebuild geometry when throat radius changes
  useEffect(() => {
    const refs = sceneRef.current;
    if (!refs) {
      return;
    }
    const { core, entities } = refs;
    const { scene, camera } = core;

    const { throatRadius } = params;

    // rebuild rim
    scene.remove(entities.rim);
    entities.rim.geometry.dispose();
    entities.rim.material.dispose();
    const newRim = createThroatRim(throatRadius);

    scene.add(newRim);
    entities.rim = newRim;
    entities.rimUniforms = newRim.material.uniforms as {
      viewVector: UniformValue<Vector3>;
      glowColor: UniformValue<Color>;
    };

    // rebuild portal disc
    scene.remove(entities.portalDisc);
    entities.portalDisc.geometry.dispose();
    entities.portalDisc.material.dispose();
    const newDisc = createPortalDisc(throatRadius, entities.renderTarget);
    newDisc.rotation.x = Math.PI * 0.5;
    scene.add(newDisc);
    entities.portalDisc = newDisc;
    entities.portalUniforms = newDisc.material.uniforms as { time: { value: number }; distortion: { value: number } };

    // rebuild glow
    scene.remove(entities.innerGlow, entities.outerGlow);
    entities.innerGlow.geometry.dispose();
    entities.innerGlow.material.dispose();
    entities.outerGlow.geometry.dispose();
    entities.outerGlow.material.dispose();
    const newInner = createFresnelGlow(camera.position, 0xbbddff, throatRadius * 1.3, FrontSide, 3.0);
    const newOuter = createFresnelGlow(camera.position, 0x6699ff, throatRadius * 2.0, BackSide, 4.5);
    scene.add(newInner, newOuter);
    entities.innerGlow = newInner;
    entities.outerGlow = newOuter;
    entities.innerGlowUniforms = newInner.material.uniforms as { viewVector: UniformValue<Vector3> };
    entities.outerGlowUniforms = newOuter.material.uniforms as { viewVector: UniformValue<Vector3> };

    // rebuild lensing rings
    entities.lensingRings.forEach((ring) => {
      scene.remove(ring);
      ring.geometry.dispose();
      (ring.material as Material).dispose();
    });
    const newRings = createLensingRings(throatRadius, params.lensingStrength);
    newRings.forEach((ring) => {
      ring.rotation.x = Math.PI * 0.5;
      scene.add(ring);
    });
    entities.lensingRings = newRings;

    // rebuild exotic halo
    scene.remove(entities.exoticHalo);
    entities.exoticHalo.geometry.dispose();
    const newHalo = createExoticHalo(throatRadius, params.exoticDensity);
    newHalo.visible = params.showExoticHalo;
    scene.add(newHalo);
    entities.exoticHalo = newHalo;
  }, [params.throatRadius]);

  // destination star field color
  useEffect(() => {
    const refs = sceneRef.current;
    if (!refs) {
      return;
    }
    const { entities } = refs;
    entities.portalScene.remove(entities.destinationStars);
    entities.destinationStars.geometry.dispose();
    const newStars = createDestinationStars(DESTINATION_COLOR_MAP[params.destination]);
    entities.portalScene.add(newStars);
    entities.destinationStars = newStars;
  }, [params.destination]);

  // exotic halo density
  useEffect(() => {
    const refs = sceneRef.current;
    if (!refs) {
      return;
    }
    const { core, entities } = refs;
    core.scene.remove(entities.exoticHalo);
    entities.exoticHalo.geometry.dispose();
    const newHalo = createExoticHalo(params.throatRadius, params.exoticDensity);
    newHalo.visible = params.showExoticHalo;
    core.scene.add(newHalo);
    entities.exoticHalo = newHalo;
  }, [params.exoticDensity, params.throatRadius]);

  useEffect(() => {
    const refs = sceneRef.current;
    if (!refs) {
      return;
    }
    const { core, entities } = refs;
    entities.exoticHalo.visible = params.showExoticHalo;
    entities.lensingRings.forEach((ring) => {
      ring.visible = params.showLensingRings;
    });
    core.stars!.visible = params.showStars;
  }, [params.showExoticHalo, params.showLensingRings, params.showStars]);
};
