import { useEffect } from 'react';
import type { SceneRefType } from '@/types';
import type { SceneParams, SceneRef } from '../types';
import { updateExoticMatter } from '../utils/exotic-matter';
import { updateYorkGrid } from '../utils/york-grid';

export const useUpdate = (sceneRef: SceneRefType<SceneRef>, params: SceneParams) => {
  const { velocity, radius, sigma, yorkGrid, exoticMatter, starField } = params;

  useEffect(() => {
    const refs = sceneRef.current;
    if (!refs) {
      return;
    }
    const bubble = { velocity, radius, sigma };
    const { yorkGrid: grid, exoticMatter: ring, bubbleWall } = refs.entities;
    updateYorkGrid(grid, bubble);
    updateExoticMatter(ring, bubble);
    bubbleWall.scale.setScalar(radius);
  }, [velocity, radius, sigma, sceneRef]);

  useEffect(() => {
    const refs = sceneRef.current;
    if (!refs) {
      return;
    }
    const { yorkGrid: grid, exoticMatter: ring, bubbleWall } = refs.entities;
    grid.line.visible = yorkGrid;
    bubbleWall.visible = yorkGrid;
    ring.visible = exoticMatter;
    refs.core.stars.visible = starField;
  }, [yorkGrid, exoticMatter, starField, sceneRef]);
};
