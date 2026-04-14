import { useMemo } from 'react';
import type { SceneLayoutHudProps } from '@/components/app/scene-layout';
import { hawkingTemperatureKelvin, schwarzschildRadius } from '@/utils/physics';
import type { Params } from '../types';

const BASE_HUD_PROPS = {
  title: 'Black Hole',
  subtitle: 'SCHWARZSCHILD METRIC · GRAVITATIONAL LENSING',
  glossary: [
    {
      title: 'THE OBJECT',
      items: [
        {
          term: 'EVENT HORIZON',
          formula: 'r = rₛ',
          def: "The point of <em>no return</em>. Once matter or light crosses this boundary, escape is impossible — not even light travels fast enough to overcome the gravitational pull. It's not a physical surface, just a mathematical threshold in spacetime.",
        },
        {
          term: 'SCHWARZSCHILD RADIUS',
          formula: 'rₛ = 2GM/c²',
          def: 'The radius at which the escape velocity equals the speed of light. For our Sun, this would be <em>~3 km</em>. For Earth, just <em>9 mm</em>. Any mass compressed inside its own Schwarzschild radius becomes a black hole.',
        },
        {
          term: 'PHOTON SPHERE',
          formula: 'r = 1.5 rₛ',
          def: 'A region where gravity is strong enough that photons travel in circles. Light here is in unstable orbit — the bright glowing ring you see. Any photon slightly too close spirals inward; slightly too far, it escapes.',
        },
        {
          term: 'SINGULARITY',
          def: 'The theoretical center where density becomes <em>infinite</em> and our current physics breaks down. General relativity predicts it but cannot describe it. Quantum gravity may eventually resolve this.',
        },
      ],
    },
    {
      title: 'PARAMETERS',
      items: [
        {
          term: 'MASS (M☉)',
          def: 'Measured in solar masses (M☉ = 1.989 × 10³⁰ kg). Stellar black holes are <em>3–20 M☉</em>. Supermassive ones like M87* reach <em>6.5 billion M☉</em>. Mass directly sets the Schwarzschild radius.',
        },
        {
          term: 'SPIN (a)',
          def: 'Dimensionless spin parameter, 0 (non-rotating) to 0.99 (near-maximal). A spinning black hole follows the <em>Kerr metric</em>. Spin drags spacetime itself — <em>frame dragging</em> — and flattens the event horizon at the poles.',
        },
        {
          term: 'DISK TEMPERATURE',
          def: "The inner accretion disk reaches <em>10,000–100,000 K</em>, radiating as a near-blackbody. Color follows Wien's law — hotter = bluer. Orange/white inner glow and red outer fade reflect real temperature gradients.",
        },
        {
          term: 'LENSING STRENGTH',
          def: "Controls gravitational lensing — the bending of light around the black hole. At maximum, light from behind wraps around and forms the <em>Einstein ring</em>. The Interstellar film used this effect based on Kip Thorne's equations.",
        },
      ],
    },
    {
      title: 'PHENOMENA',
      items: [
        {
          term: 'ACCRETION DISK',
          def: 'Infalling matter forms a flattened spiral disk due to angular momentum. Friction heats gas to millions of degrees. This disk can be <em>brighter than entire galaxies</em> — the primary radiation source of quasars and AGN.',
        },
        {
          term: 'DOPPLER SHIFT',
          def: 'The disk rotates at a significant fraction of the speed of light. The approaching side is shifted toward <em>blue</em>, the receding side toward <em>red</em>. Clearly visible in the EHT radio telescope image of M87*.',
        },
        {
          term: 'RELATIVISTIC JETS',
          def: "Magnetic fields launch plasma jets at <em>near light speed</em> perpendicular to the disk. The Blandford-Znajek process extracts rotational energy from the spinning black hole itself. M87's jet extends <em>5,000 light-years</em>.",
        },
        {
          term: 'HAWKING RADIATION',
          def: 'A quantum effect where virtual particle pairs near the horizon split — one falls in, one escapes — causing the black hole to <em>slowly lose mass</em>. A 10 M☉ black hole takes 10⁷⁴ years to evaporate. Never observed, but theoretically solid.',
        },
      ],
    },
    {
      title: 'KNOWN BLACK HOLES',
      items: [
        {
          term: 'SGR A*',
          def: 'The supermassive black hole at the center of our Milky Way. Mass: <em>4 million M☉</em>. Distance: <em>26,000 light-years</em>. Imaged by the Event Horizon Telescope in 2022.',
        },
        {
          term: 'M87*',
          def: 'First black hole ever directly imaged (2019, EHT). Mass: <em>6.5 billion M☉</em>. Located in galaxy Messier 87, <em>55 million light-years</em> away. Its Schwarzschild radius exceeds our entire solar system.',
        },
        {
          term: 'TON 618',
          def: 'One of the most massive known black holes. Mass: <em>66 billion M☉</em>. A hyperluminous quasar <em>10.4 billion light-years</em> away. Its event horizon diameter exceeds 1,300 AU.',
        },
      ],
    },
  ],
  hints: [
    { title: 'SCHWARZSCHILD RADIUS', values: ['rₛ = 2GM/c²'] },
    { title: 'PHOTON SPHERE', values: ['r = 1.5 rₛ'] },
  ],
} satisfies Partial<SceneLayoutHudProps>;

export const useHud = (params: Params) =>
  useMemo(() => {
    const rs = schwarzschildRadius(params.mass);
    const hTemp = hawkingTemperatureKelvin(params.mass);

    const stats = [
      { label: 'mass', value: params.mass.toFixed(1), unit: 'M☉' },
      { label: 'spin', value: params.spin.toFixed(2), unit: 'a' },
      { label: 'temp', value: hTemp < 1 ? hTemp.toExponential(4) : Math.round(hTemp).toLocaleString(), unit: 'K' },
      { label: 'Rₛ', value: rs.toFixed(1), unit: 'km' },
    ];

    return {
      ...BASE_HUD_PROPS,
      stats,
    };
  }, [params.mass, params.spin]);
