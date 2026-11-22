import { Mesh, PlaneGeometry, ShaderMaterial } from 'three';
import type { LensUniforms } from '../types';

const VERTEX_SHADER = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position.xy, 0.0, 1.0);
  }
`;

// Display approximation, not ray tracing through the metric. The wall's shape
// function f'(s) (bubble radius 1, sharpness sigma) weights a radial offset that is
// antisymmetric in the motion axis, like York time: pulled in ahead of the bubble,
// pushed out behind it. The offset vanishes inside, far outside and across the axis.
// 2f'/sigma peaks near 1 for any wall, so thin walls don't blow up the offset, and
// scaling by the screen radius keeps the effect the same size at any zoom.
const FRAGMENT_SHADER = `
  varying vec2 vUv;
  uniform sampler2D backgroundTex;
  uniform vec2 resolution;
  uniform vec2 bubbleCenter;
  uniform float bubbleRadius;
  uniform vec2 motionDir;
  uniform float strength;
  uniform float sigma;

  float sech2(float u) {
    float t = tanh(u);
    return 1.0 - t * t;
  }

  float shapeDerivative(float s) {
    return sigma * (sech2(sigma * (s + 1.0)) - sech2(sigma * (s - 1.0))) / (2.0 * tanh(sigma));
  }

  void main() {
    float aspect = resolution.x / resolution.y;
    vec2 aspectScale = vec2(aspect, 1.0);
    vec2 p = (vUv * 2.0 - 1.0 - bubbleCenter) * aspectScale;
    float r = length(p);
    vec2 dir = p / max(r, 1e-6);
    float s = r / bubbleRadius;
    float along = dot(dir, motionDir);
    vec2 displacement = dir * strength * bubbleRadius * (2.0 * shapeDerivative(s) / sigma) * along;
    vec2 sampleUv = clamp(vUv + displacement / (2.0 * aspectScale), 0.001, 0.999);
    gl_FragColor = texture2D(backgroundTex, sampleUv);
    // the target holds linear, untone-mapped colour; finish it like a direct render
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
  }
`;

export const createLensQuad = (uniforms: LensUniforms): Mesh<PlaneGeometry, ShaderMaterial> =>
  new Mesh(
    new PlaneGeometry(2, 2),
    new ShaderMaterial({
      uniforms,
      vertexShader: VERTEX_SHADER,
      fragmentShader: FRAGMENT_SHADER,
      depthWrite: false,
      depthTest: false,
    }),
  );
