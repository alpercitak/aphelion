import type { LiveState, StateRef } from '../types';

export const toLiveState = (state: StateRef): LiveState => ({
  phase: state.phase,
  elapsed: state.elapsed,
  separation: state.separation,
  days: state.days,
  luminosity: 0,
  dominant: 'BLUE',
});
