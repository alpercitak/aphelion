import { useCallback, useEffect, useRef, useState } from 'react';

export const useSceneParams = <T>(initial: T) => {
  const [params, setParams] = useState(initial);
  const ref = useRef(params);

  useEffect(() => {
    ref.current = params;
  }, [params]);

  const set = useCallback(<K extends keyof T>(key: K, value: T[K]) => {
    setParams((prev) => {
      if (prev[key] === value) {
        return prev;
      }
      return { ...prev, [key]: value };
    });
  }, []);

  return { params, paramsRef: ref, set };
};
