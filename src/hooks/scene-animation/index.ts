import { useEffect, useRef } from 'react';
import { Timer } from 'three';

type SceneAnimationCallback = (time: number, delta: number) => void;

export const useSceneAnimation = (callback: SceneAnimationCallback) => {
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
