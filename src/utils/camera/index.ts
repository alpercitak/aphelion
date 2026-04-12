import { Camera } from 'three';

// --- Control Constants ---
const ROTATION_SENSITIVITY = 0.005;
const ZOOM_SENSITIVITY = 0.01;
const PHI_LIMIT_MIN = 0.1;
const PHI_LIMIT_MAX = Math.PI - 0.1;

export interface OrbitState {
  theta: number;
  phi: number;
  radius: number;
  minRadius: number;
  maxRadius: number;
}

export interface OrbitOptions {
  theta?: number;
  phi?: number;
  radius?: number;
  minRadius?: number;
  maxRadius?: number;
}

export const createOrbitControls = (canvas: HTMLCanvasElement, initial: OrbitOptions = {}) => {
  const state: OrbitState = {
    theta: initial.theta ?? 0.3,
    phi: initial.phi ?? Math.PI / 3,
    radius: initial.radius ?? 8,
    minRadius: initial.minRadius ?? 2.5,
    maxRadius: initial.maxRadius ?? 30,
  };

  let isDragging = false;
  let prevMouse = { x: 0, y: 0 };
  let lastTouch: Touch | null = null;

  // --- Mouse Handlers ---
  const onMouseDown = (e: MouseEvent) => {
    isDragging = true;
    prevMouse = { x: e.clientX, y: e.clientY };
  };

  const onMouseUp = () => {
    isDragging = false;
  };

  const onMouseMove = (e: MouseEvent) => {
    if (!isDragging) {
      return;
    }

    const dx = e.clientX - prevMouse.x;
    const dy = e.clientY - prevMouse.y;

    state.theta -= dx * ROTATION_SENSITIVITY;
    state.phi = Math.max(PHI_LIMIT_MIN, Math.min(PHI_LIMIT_MAX, state.phi + dy * ROTATION_SENSITIVITY));

    prevMouse = { x: e.clientX, y: e.clientY };
  };

  const onWheel = (e: WheelEvent) => {
    state.radius = Math.max(state.minRadius, Math.min(state.maxRadius, state.radius + e.deltaY * ZOOM_SENSITIVITY));
  };

  // --- Touch Handlers ---
  const onTouchStart = (e: TouchEvent) => {
    lastTouch = e.touches[0] || null;
  };

  const onTouchEnd = () => {
    lastTouch = null;
  };

  const onTouchMove = (e: TouchEvent) => {
    const t = e.touches[0];
    if (!lastTouch || !t) {
      return;
    }

    const dx = t.clientX - lastTouch.clientX;
    const dy = t.clientY - lastTouch.clientY;

    state.theta -= dx * ROTATION_SENSITIVITY;
    state.phi = Math.max(PHI_LIMIT_MIN, Math.min(PHI_LIMIT_MAX, state.phi + dy * ROTATION_SENSITIVITY));

    lastTouch = t;
    if (e.cancelable) {
      e.preventDefault();
    }
  };

  // --- Event Lifecycle ---
  canvas.addEventListener('mousedown', onMouseDown);
  window.addEventListener('mouseup', onMouseUp);
  window.addEventListener('mousemove', onMouseMove);
  canvas.addEventListener('wheel', onWheel, { passive: true });
  canvas.addEventListener('touchstart', onTouchStart);
  canvas.addEventListener('touchend', onTouchEnd);
  canvas.addEventListener('touchmove', onTouchMove, { passive: false });

  /**
   * Updates camera position based on current spherical coordinates.
   */
  const updateCamera = (camera: Camera) => {
    const x = state.radius * Math.sin(state.phi) * Math.sin(state.theta);
    const y = state.radius * Math.cos(state.phi);
    const z = state.radius * Math.sin(state.phi) * Math.cos(state.theta);

    camera.position.set(x, y, z);
    camera.lookAt(0, 0, 0);
  };

  /**
   * Cleanup listeners to prevent memory leaks.
   */
  const dispose = () => {
    canvas.removeEventListener('mousedown', onMouseDown);
    window.removeEventListener('mouseup', onMouseUp);
    window.removeEventListener('mousemove', onMouseMove);
    canvas.removeEventListener('wheel', onWheel);
    canvas.removeEventListener('touchstart', onTouchStart);
    canvas.removeEventListener('touchend', onTouchEnd);
    canvas.removeEventListener('touchmove', onTouchMove);
  };

  return { state, updateCamera, dispose };
};
