import { useCallback, useEffect, useRef, useState } from 'react';
import { PHASE_MAP } from '../constants';
import type { Phase, PhaseValue } from '../types';

const getCurrentPhase = (timeline: number): Phase => {
  for (const [key, range] of Object.entries(PHASE_MAP) as Array<[Phase, PhaseValue]>) {
    if (timeline >= range[0] && timeline <= range[1]) return key;
  }
  return 'NEBULA';
};

export const useTimeline = (
  initialValue: number,
  autoPlay: boolean,
  setParam: (key: 'timeline', v: number) => void,
) => {
  const timelineRef = useRef(initialValue);
  const [phase, setPhase] = useState<Phase>('PROGENITOR');

  const updateTimeline = useCallback(
    (val: number) => {
      timelineRef.current = val;
      const newPhase = getCurrentPhase(val);
      setPhase((prev) => (prev !== newPhase ? newPhase : prev));
      setParam('timeline', val);
    },
    [setParam],
  );

  useEffect(() => {
    if (!autoPlay) {
      timelineRef.current = initialValue;
    }
  }, [initialValue, autoPlay]);

  return {
    timelineRef,
    phase,
    updateTimeline,
  };
};
