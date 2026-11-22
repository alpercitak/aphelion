import { type RefObject, useEffect } from 'react';
import type { SceneRefType } from '@/types';
import type { SceneParams, SceneRef, StateRef } from '../types';
import { setDiskBrightness, updateAccretionDisk } from '../utils/disk';
import { shapeDonor } from '../utils/donor';
import { updateRocheLobes } from '../utils/lobes';
import { accretorType } from '../utils/physics';
import { computeBinary } from '../utils/roche';

export const useUpdate = (
  sceneRef: SceneRefType<SceneRef>,
  stateRef: RefObject<StateRef | null>,
  params: SceneParams,
) => {
  const { accretorMass, donorMass, mdotLog, rocheLobes, starField } = params;

  useEffect(() => {
    const binary = computeBinary({ accretorMass, donorMass });
    stateRef.current = { binary };

    const refs = sceneRef.current;
    if (!refs) {
      return;
    }
    const { donor, neutronStar, blackHole, lobes, disk } = refs.entities;
    shapeDonor(donor, binary);
    updateRocheLobes(lobes, binary);
    updateAccretionDisk(disk, binary);

    const isNeutronStar = accretorType(accretorMass) === 'neutron-star';
    neutronStar.mesh.position.x = binary.x1;
    neutronStar.mesh.visible = isNeutronStar;
    blackHole.mesh.position.x = binary.x1;
    blackHole.mesh.visible = !isNeutronStar;
  }, [accretorMass, donorMass, sceneRef, stateRef]);

  useEffect(() => {
    const refs = sceneRef.current;
    if (!refs) {
      return;
    }
    setDiskBrightness(refs.entities.disk, mdotLog);
    refs.entities.lobes.group.visible = rocheLobes;
    refs.core.stars.visible = starField;
  }, [mdotLog, rocheLobes, starField, sceneRef]);
};
