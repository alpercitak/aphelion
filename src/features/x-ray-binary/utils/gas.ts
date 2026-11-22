import { AdditiveBlending, BufferAttribute, BufferGeometry, Color, Points, PointsMaterial } from 'three';
import { tempToColor } from '@/utils/physics';
import {
  DISK_DIFFUSION,
  DISK_DRIFT_TIME,
  DISK_INNER_FRACTION,
  DISK_LUT_SIZE,
  DISK_MAX_ANGULAR_RATE,
  DISK_SETTLE_RATE,
  DISK_T_IN_DISPLAY,
  DISK_TEMP_EXPONENT,
  GAS_BRIGHTNESS,
  GAS_ESCAPE_RANGE,
  GAS_MAX_SUBSTEP,
  GAS_PARTICLES,
  GAS_POINT_SIZE,
  MDOT_REF_LOG,
  SEPARATION,
  STREAM_COLOR,
  STREAM_JITTER,
  STREAM_RATE_MAX,
  STREAM_RATE_REF,
  STREAM_V0,
  STREAM_VELOCITY_JITTER,
} from '../constants';
import type { Binary, Gas, StateRef } from '../types';

const MODE_FREE = 0;
const MODE_STREAM = 1;
const MODE_DISK = 2;

const STREAM_RGB = new Color(STREAM_COLOR).multiplyScalar(GAS_BRIGHTNESS);

const vec3Attribute = () => new BufferAttribute(new Float32Array(GAS_PARTICLES * 3), 3);

export const createGas = (): Gas => {
  const positions = vec3Attribute();
  const colors = vec3Attribute();
  const geometry = new BufferGeometry();
  geometry.setAttribute('position', positions);
  geometry.setAttribute('color', colors);
  const material = new PointsMaterial({
    size: GAS_POINT_SIZE,
    vertexColors: true,
    transparent: true,
    blending: AdditiveBlending,
    depthWrite: false,
  });
  const points = new Points(geometry, material);
  // Positions change every frame, but the bounding sphere is fixed at creation.
  points.frustumCulled = false;

  const lut = new BufferAttribute(new Float32Array(DISK_LUT_SIZE * 3), 3);
  for (let k = 0; k < DISK_LUT_SIZE; k++) {
    const u = DISK_INNER_FRACTION + ((1 - DISK_INNER_FRACTION) * k) / (DISK_LUT_SIZE - 1);
    const c = tempToColor(DISK_T_IN_DISPLAY * (u / DISK_INNER_FRACTION) ** DISK_TEMP_EXPONENT).multiplyScalar(
      GAS_BRIGHTNESS,
    );
    lut.setXYZ(k, c.r, c.g, c.b);
  }

  return {
    points,
    mode: new Uint8Array(GAS_PARTICLES),
    positions,
    velocities: vec3Attribute(),
    disk: vec3Attribute(),
    colors,
    lut,
  };
};

/** Frees every particle and blacks out its colour. */
export const clearGas = (gas: Gas) => {
  gas.mode.fill(MODE_FREE);
  for (let i = 0; i < GAS_PARTICLES; i++) {
    gas.colors.setXYZ(i, 0, 0, 0);
  }
  gas.colors.needsUpdate = true;
};

const jitter = (amplitude: number) => (Math.random() * 2 - 1) * amplitude;

const freeParticle = (gas: Gas, i: number) => {
  gas.mode[i] = MODE_FREE;
  gas.colors.setXYZ(i, 0, 0, 0);
};

const spawnStream = (gas: Gas, i: number, binary: Binary) => {
  gas.mode[i] = MODE_STREAM;
  gas.positions.setXYZ(i, binary.l1x + jitter(STREAM_JITTER), jitter(STREAM_JITTER), jitter(STREAM_JITTER));
  gas.velocities.setXYZ(i, -STREAM_V0 + jitter(STREAM_VELOCITY_JITTER), 0, jitter(STREAM_VELOCITY_JITTER));
  gas.colors.setXYZ(i, STREAM_RGB.r, STREAM_RGB.g, STREAM_RGB.b);
};

const spawnParticles = (gas: Gas, state: StateRef, mdotLog: number, dt: number) => {
  const rate = Math.min(STREAM_RATE_MAX, STREAM_RATE_REF * 10 ** (mdotLog - MDOT_REF_LOG));
  state.spawnCarry += rate * dt;
  let count = Math.floor(state.spawnCarry);
  state.spawnCarry -= count;
  for (let i = 0; i < GAS_PARTICLES && count > 0; i++) {
    if (gas.mode[i] === MODE_FREE) {
      spawnStream(gas, i, state.binary);
      count--;
    }
  }
};

/** Integrates a stream parcel in the corotating frame until it reaches the disk or escapes. */
const stepStream = (gas: Gas, i: number, binary: Binary, substeps: number, h: number) => {
  const { positions, velocities } = gas;
  const { x1, x2, gm1, gm2, omega, diskOuter } = binary;
  for (let s = 0; s < substeps && gas.mode[i] === MODE_STREAM; s++) {
    const x = positions.getX(i);
    const y = positions.getY(i);
    const z = positions.getZ(i);
    const vx = velocities.getX(i);
    const vy = velocities.getY(i);
    const vz = velocities.getZ(i);

    const dx1 = x - x1;
    const dx2 = x - x2;
    const r1 = Math.hypot(dx1, y, z);
    const r2 = Math.hypot(dx2, y, z);
    const g1 = gm1 / (r1 * r1 * r1);
    const g2 = gm2 / (r2 * r2 * r2);
    const ax = -g1 * dx1 - g2 * dx2 + omega * omega * x - 2 * omega * vz;
    const ay = -(g1 + g2) * y;
    const az = -(g1 + g2) * z + omega * omega * z + 2 * omega * vx;

    const nvx = vx + ax * h;
    const nvy = vy + ay * h;
    const nvz = vz + az * h;
    const nx = x + nvx * h;
    const ny = y + nvy * h;
    const nz = z + nvz * h;
    velocities.setXYZ(i, nvx, nvy, nvz);
    positions.setXYZ(i, nx, ny, nz);

    const dxa = nx - x1;
    const ra = Math.hypot(dxa, nz);
    if (ra < diskOuter) {
      gas.mode[i] = MODE_DISK;
      gas.disk.setXYZ(i, ra, Math.atan2(-nz, dxa), ny);
    } else if (Math.hypot(nx, ny, nz) > GAS_ESCAPE_RANGE * SEPARATION) {
      freeParticle(gas, i);
    }
  }
};

/** Advances a disk parcel: Keplerian motion relative to the corotating frame, viscous drift inward. */
const stepDisk = (gas: Gas, i: number, binary: Binary, dt: number) => {
  const { x1, gm1, omega, diskOuter } = binary;
  const r = gas.disk.getX(i);
  const phi = gas.disk.getY(i) + (Math.min(Math.sqrt(gm1 / (r * r * r)), DISK_MAX_ANGULAR_RATE) - omega) * dt;
  const nr = r * (1 - dt / DISK_DRIFT_TIME + jitter(DISK_DIFFUSION) * Math.sqrt(dt));
  if (nr < diskOuter * DISK_INNER_FRACTION) {
    freeParticle(gas, i);
    return;
  }
  const y = gas.disk.getZ(i) * (1 - DISK_SETTLE_RATE * dt);
  gas.disk.setXYZ(i, nr, phi, y);
  gas.positions.setXYZ(i, x1 + nr * Math.cos(phi), y, -nr * Math.sin(phi));

  const u = nr / diskOuter;
  const k = Math.round(((u - DISK_INNER_FRACTION) / (1 - DISK_INNER_FRACTION)) * (DISK_LUT_SIZE - 1));
  gas.colors.setXYZ(i, gas.lut.getX(k), gas.lut.getY(k), gas.lut.getZ(k));
};

export const stepGas = (gas: Gas, state: StateRef, mdotLog: number, dt: number) => {
  spawnParticles(gas, state, mdotLog, dt);
  const { binary } = state;

  const substeps = Math.max(1, Math.ceil(dt / GAS_MAX_SUBSTEP));
  const h = dt / substeps;
  for (let i = 0; i < GAS_PARTICLES; i++) {
    const mode = gas.mode[i];
    if (mode === MODE_STREAM) {
      stepStream(gas, i, binary, substeps, h);
    } else if (mode === MODE_DISK) {
      stepDisk(gas, i, binary, dt);
    }
  }

  gas.positions.needsUpdate = true;
  gas.colors.needsUpdate = true;
};
