import type { BeamWidth, Params, SliderItem, ToggleItem } from '../types';

export const TITLE = 'Neutron Star';

export const SUBTITLE = 'PULSAR · LIGHTHOUSE EFFECT · DIPOLE RADIATION';

export const PARAMS = {
  mass: 1.4,
  rpm: 30,
  fieldStrength: 1.0,
  beamWidth: 'narrow',
  showBeams: true,
  showFieldLines: true,
  showBeamFlash: true,
  showAccretionDisk: false,
} satisfies Params;

export const GLOSSARY_ITEMS = [
  {
    title: 'THE OBJECT',
    items: [
      {
        term: 'NEUTRON STAR',
        def: 'The collapsed core of a massive star after a supernova. Packs <em>1.4 M☉</em> into a radius of ~10 km — a teaspoon of neutron star matter weighs about a billion tonnes. Supported against further collapse by <em>neutron degeneracy pressure</em>.',
      },
      {
        term: 'PULSAR',
        formula: 'P = 1/f',
        def: 'A rapidly rotating neutron star emitting beams of electromagnetic radiation from its magnetic poles. As it spins, the beam sweeps space like a lighthouse. Detected as regular pulses — some rival atomic clocks in precision.',
      },
      {
        term: 'MILLISECOND PULSAR',
        def: 'A pulsar spun up to hundreds of rotations per second by accreting matter from a binary companion. The record holder, PSR J1748-2446ad, spins at <em>716 Hz</em> — 43,000 RPM. Its equator moves at ~24% the speed of light.',
      },
      {
        term: 'TOV LIMIT',
        formula: '~2.1–2.5 M☉',
        def: 'The Tolman–Oppenheimer–Volkoff limit — maximum mass a neutron star can have before neutron degeneracy pressure fails and it collapses into a black hole. The exact value depends on the nuclear <em>equation of state</em>, which is still uncertain.',
      },
    ],
  },
  {
    title: 'PARAMETERS',
    items: [
      {
        term: 'ROTATION SPEED',
        def: 'Controls the spin rate in RPM. Newly formed neutron stars rotate tens of times per second. Millisecond pulsars reach thousands of RPM via spin-up accretion. Isolated pulsars gradually <em>spin down</em> as they radiate energy.',
      },
      {
        term: 'MAGNETIC FIELD',
        def: "Neutron stars have the strongest magnetic fields known — <em>10⁸–10¹⁵ Gauss</em> (Earth's field is ~0.5 G). The field channels accreting plasma onto the poles, creating X-ray hot spots. Field decay over millions of years slows and eventually silences a pulsar.",
      },
      {
        term: 'BEAM WIDTH',
        def: 'The opening angle of the pulsar beam cone. Narrower beams are more concentrated and produce sharper, brighter pulses. We only detect pulsars whose beams sweep past Earth — most neutron stars are invisible to us.',
      },
    ],
  },
  {
    title: 'PHENOMENA',
    items: [
      {
        term: 'DIPOLE RADIATION',
        def: "The dominant emission mechanism — a rotating magnetic dipole radiates energy and gradually slows the pulsar. The rate of spin-down directly encodes the <em>magnetic field strength</em> and the pulsar's age.",
      },
      {
        term: 'LIGHTHOUSE EFFECT',
        def: 'The beam sweeps space as the star rotates. An observer in the beam path detects a pulse once per rotation. The extreme regularity of these pulses made the first discovery (CP 1919, 1967) seem so artificial that astronomers briefly dubbed it <em>LGM-1</em> (Little Green Men).',
      },
      {
        term: 'SURFACE GRAVITY',
        def: "About <em>2 × 10¹¹ m/s²</em> — 200 billion times Earth's gravity. A marshmallow dropped from 1 metre would hit the surface with the energy of an atomic bomb. The escape velocity is roughly <em>half the speed of light</em>.",
      },
      {
        term: 'ACCRETION DISK',
        def: 'In binary systems, a neutron star can strip matter from a companion star. This material forms an accretion disk, heating to millions of degrees and emitting X-rays. The process also spins up the neutron star into a millisecond pulsar.',
      },
    ],
  },
];

export const HINT_ITEMS = [
  { title: 'PULSAR PERIOD', values: ['P = 1/f'] },
  { title: 'TOV LIMIT', values: ['~2.3 M☉'] },
];

export const SLIDER_ITEMS = [
  {
    id: 'mass',
    label: 'MASS',
    min: 1.1,
    max: 2.5,
    step: 0.01,
    format: (v) => `${v.toFixed(2)} M☉`,
    tooltip: 'Neutron star mass. The TOV limit is ~2.1–2.5 M☉ — above this, collapse to a black hole is inevitable.',
  },
  {
    id: 'rpm',
    label: 'ROTATION',
    min: 0.1,
    max: 600,
    step: 0.1,
    format: (v) => `${v.toFixed(1)} RPM`,
    tooltip: 'Rotation speed. Millisecond pulsars spin up to 716 Hz (43,000 RPM) via accretion from a companion star.',
  },
  {
    id: 'fieldStrength',
    label: 'FIELD',
    min: 0,
    max: 2,
    step: 0.05,
    format: (v) => v.toFixed(2),
    tooltip: 'Magnetic field strength. Controls field line opacity and arc spread. Pulsars: ~10¹² G.',
  },
] as const satisfies Array<SliderItem>;

export const TOGGLE_ITEMS = [
  { id: 'showBeams', label: 'PULSAR BEAMS' },
  { id: 'showFieldLines', label: 'MAGNETIC FIELD LINES' },
  { id: 'showBeamFlash', label: 'BEAM FLASH EFFECT' },
  { id: 'showAccretionDisk', label: 'ACCRETION DISK' },
] as const satisfies Array<ToggleItem>;

export const BEAM_FLASH_THRESHOLD = 0.92;
export const NS_RADIUS = 0.35; // visual radius — neutron stars are tiny
export const BEAM_WIDTH_OPTIONS = ['narrow', 'wide'] as const satisfies ReadonlyArray<BeamWidth>;
