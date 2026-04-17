import { useMemo } from 'react';
import type { SceneLayoutHudProps } from '@/components/app/scene-layout';
import type { SceneParams } from '../types';

const BASE_HUD_PROPS = {
  title: 'Lensing Field',
  subtitle: 'GRAVITATIONAL LENSING · EINSTEIN RINGS · DARK MATTER',
  glossary: [
    {
      title: 'THE PHENOMENON',
      items: [
        {
          term: 'GRAVITATIONAL LENSING',
          formula: 'δφ = 4GM/c²b',
          def: "The bending of light paths by massive objects, predicted by general relativity. Light follows the curvature of spacetime — a massive object between us and a distant source bends the source's light toward us, acting like a lens. Einstein predicted this; Eddington confirmed it during the <em>1919 solar eclipse</em>.",
        },
        {
          term: 'EINSTEIN RING',
          def: 'When a source, lens, and observer are perfectly aligned, the lensed image forms a complete ring around the lens. The radius of the ring — the <em>Einstein radius</em> — depends on the lens mass and distances. Einstein rings are now routinely observed by Hubble and JWST.',
        },
        {
          term: 'ARC',
          def: 'When alignment is imperfect, the lensed image forms arcs rather than a complete ring. Galaxy clusters produce dramatic arc systems — multiple distorted images of background galaxies stretched into luminous arcs. These arcs are among the most visually striking phenomena in astronomy.',
        },
        {
          term: 'IMPACT PARAMETER',
          formula: 'b = closest approach distance',
          def: "The perpendicular distance between the light ray's path and the lensing mass. Smaller impact parameter = stronger deflection. When b equals the Einstein radius, a ring forms. When b is much larger than the Einstein radius, deflection is imperceptible.",
        },
      ],
    },
    {
      title: 'APPLICATIONS',
      items: [
        {
          term: 'DARK MATTER MAPPING',
          def: "Dark matter neither emits nor absorbs light — it's only detectable through its gravitational effects. Gravitational lensing is the primary tool for mapping dark matter distribution. The <em>Bullet Cluster</em> (2006) provided direct evidence of dark matter by showing lensing mass offset from visible gas after a cluster collision.",
        },
        {
          term: 'MICROLENSING',
          def: 'Lensing by stellar-mass objects — individual stars, planets, or compact dark objects. When a lens passes in front of a background star, the star briefly brightens as its light is focused toward us. Used to detect <em>exoplanets</em> and constrain the abundance of primordial black holes as dark matter candidates.',
        },
        {
          term: 'STRONG VS WEAK LENSING',
          def: 'Strong lensing produces visible arcs and multiple images near massive clusters. Weak lensing produces subtle shape distortions across millions of background galaxies — detectable only statistically. Weak lensing surveys (DES, Euclid, LSST) map the large-scale dark matter distribution of the universe.',
        },
        {
          term: '1919 ECLIPSE',
          def: "The first confirmation of general relativity. Arthur Eddington photographed stars near the Sun during a total solar eclipse, measuring their apparent positions. Stars near the Sun's limb appeared shifted by 1.75 arcseconds — exactly matching Einstein's prediction and <em>twice the Newtonian value</em>. It made Einstein world-famous overnight.",
        },
      ],
    },
    {
      title: 'DARK MATTER MODE',
      items: [
        {
          term: 'DARK MATTER HALO',
          def: "Galaxies are embedded in vast halos of dark matter extending far beyond the visible disk. The Milky Way's halo extends ~250 kpc and contains roughly <em>10× the mass of visible matter</em>. Its distribution is traced by stellar kinematics and gravitational lensing of background sources.",
        },
        {
          term: 'COMPACT DARK OBJECTS',
          def: 'One dark matter candidate: MACHOs (Massive Compact Halo Objects) — black holes, neutron stars, or other compact objects too faint to detect directly. Microlensing surveys constrain their abundance. Primordial black holes formed in the early universe are a current candidate, though heavily constrained by lensing non-detections.',
        },
      ],
    },
  ],
  hints: [
    { title: 'CONFIRMED', values: ['1919 Eclipse'] },
    { title: 'USE', values: ['Dark matter maps'] },
  ],
} satisfies Partial<SceneLayoutHudProps>;

export const useHud = (params: SceneParams) =>
  useMemo(() => {
    // Einstein radius in arcseconds (rough — assumes cosmological distances)
    const eRadius = Math.sqrt(params.mass / 100) * 1.5;
    const deflection = (4 * 6.674e-11 * params.mass * 1.989e30) / (9e16 * 6.957e8);
    const deflArcsec = (deflection * 206265).toFixed(3);
    const stats = [
      { label: 'MASS', value: params.mass.toFixed(1), unit: 'M☉' },
      { label: 'θ_E', value: eRadius.toFixed(2), unit: 'arcsec' },
      { label: 'DEFLECTION', value: deflArcsec, unit: '″' },
      { label: 'MODE', value: params.darkMatterMode ? 'DARK MATTER' : params.multipleLenses ? 'MULTIPLE' : 'SINGLE' },
    ];

    return {
      ...BASE_HUD_PROPS,
      stats,
    };
  }, [params.mass, params.darkMatterMode, params.multipleLenses]);
