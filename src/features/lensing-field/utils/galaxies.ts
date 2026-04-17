import { AdditiveBlending, CanvasTexture, Sprite, SpriteMaterial } from 'three';
import { GALAXY_COUNT_MAP } from '../constants';
import type { BackgroundDensity } from '../types';

export const createGalaxies = (density: BackgroundDensity): Array<Sprite> => {
  const count = GALAXY_COUNT_MAP[density];
  const galaxies: Array<Sprite> = [];

  // create a soft circular texture via canvas
  const canvas = document.createElement('canvas');
  canvas.width = 64;
  canvas.height = 64;
  const ctx = canvas.getContext('2d')!;
  const grad = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
  grad.addColorStop(0, 'rgba(180,200,255,0.9)');
  grad.addColorStop(0.3, 'rgba(140,160,220,0.5)');
  grad.addColorStop(0.7, 'rgba(100,120,180,0.15)');
  grad.addColorStop(1.0, 'rgba(0,0,0,0)');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 64, 64);

  // Elliptical galaxies — stretched
  const ellipseCanvas = document.createElement('canvas');
  ellipseCanvas.width = 96;
  ellipseCanvas.height = 32;
  const ectx = ellipseCanvas.getContext('2d')!;
  const egrad = ectx.createRadialGradient(48, 16, 0, 48, 16, 24);
  egrad.addColorStop(0, 'rgba(255,220,160,0.8)');
  egrad.addColorStop(0.4, 'rgba(220,180,120,0.3)');
  egrad.addColorStop(1.0, 'rgba(0,0,0,0)');
  ectx.fillStyle = egrad;
  ectx.fillRect(0, 0, 96, 32);

  // Import CanvasTexture dynamically to avoid circular import
  //   const { CanvasTexture } = require('three');
  const spiralTex = new CanvasTexture(canvas);
  const ellipseTex = new CanvasTexture(ellipseCanvas);

  for (let i = 0; i < count; i++) {
    const isElliptical = Math.random() > 0.6;
    const mat = new SpriteMaterial({
      map: isElliptical ? ellipseTex : spiralTex,
      transparent: true,
      opacity: 0.15 + Math.random() * 0.25,
      blending: AdditiveBlending,
      depthWrite: false,
    });
    const sprite = new Sprite(mat);
    sprite.position.set((Math.random() - 0.5) * 28, (Math.random() - 0.5) * 18, -5.2 - Math.random() * 0.5);
    const sz = 0.3 + Math.random() * 0.8;
    sprite.scale.set(isElliptical ? sz * 1.8 : sz, isElliptical ? sz * 0.6 : sz, 1);
    sprite.material.rotation = Math.random() * Math.PI;
    galaxies.push(sprite);
  }

  return galaxies;
};
