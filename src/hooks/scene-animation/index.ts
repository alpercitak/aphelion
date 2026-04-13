import { useEffect, useRef } from 'react';
import { Timer } from 'three';

export const useSceneAnimation = (callback: (time: number, delta: number) => void) => {
  const callbackRef = useRef(callback);

  useEffect(() => {
    callbackRef.current = callback;
  });

  useEffect(() => {
    let raf: number;
    const timer = new Timer();

    const loop = (timestamp: number) => {
      timer.update(timestamp);

      const delta = timer.getDelta();
      const elapsed = timer.getElapsed();

      callbackRef.current(elapsed, delta);
      raf = requestAnimationFrame(loop);
    };

    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, []);
};
