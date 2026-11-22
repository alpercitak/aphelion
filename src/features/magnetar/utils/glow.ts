import { AdditiveBlending, Color, Mesh, type Side, SphereGeometry, type Vector3 } from 'three';
import type { TypedShaderMaterial } from '@/types';
import { createShaderMaterial } from '@/utils/shader';
import type { GlowUniforms } from '../types';

const VERTEX_SHADER = `
  uniform vec3 viewVector;
  varying float intensity;
  void main() {
    vec3 vNormal = normalize(normalMatrix * normal);
    vec3 vNormel = normalize(normalMatrix * viewVector);
    intensity = pow(max(0.0, 0.68 - dot(vNormal, vNormel)), 3.0);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const FRAGMENT_SHADER = `
  uniform vec3 glowColor;
  varying float intensity;
  void main() {
    gl_FragColor = vec4(glowColor * intensity, intensity * 0.9);
  }
`;

export const createGlow = (
  cameraPos: Vector3,
  color: number,
  radius: number,
  side: Side,
): Mesh<SphereGeometry, TypedShaderMaterial<GlowUniforms>> =>
  new Mesh(
    new SphereGeometry(radius, 48, 48),
    createShaderMaterial({
      uniforms: {
        glowColor: { value: new Color(color) },
        viewVector: { value: cameraPos.clone() },
      },
      vertexShader: VERTEX_SHADER,
      fragmentShader: FRAGMENT_SHADER,
      side,
      blending: AdditiveBlending,
      transparent: true,
      depthWrite: false,
    }),
  );
