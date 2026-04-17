import { Mesh, PlaneGeometry, ShaderMaterial } from 'three';
import type { LensUniforms } from '../types';

// Conical lensing — lateral displacement based on signed distance to string projection
// Stars on the left of the string shift left; stars on right shift right (double image)
const VERTEX_SHADER = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position.xy, 0.0, 1.0);
  }
`;

const FRAGMENT_SHADER = `
  varying vec2 vUv;
  uniform sampler2D backgroundTex;
  uniform vec2  resolution;
  uniform float linearDensity; // 0-1 visual scale
  uniform bool  showDoubleImage;

  // String projected onto screen as a line segment (NDC)
  uniform vec2  stringA;   // one end
  uniform vec2  stringB;   // other end

  // Signed distance from point to infinite line through A,B
  float lineSignedDist(vec2 p, vec2 a, vec2 b) {
    vec2 ab = b - a;
    vec2 ap = p - a;
    return (ab.x * ap.y - ab.y * ap.x) / length(ab);
  }

  // Closest point on segment to p, parameterised
  float segmentParam(vec2 p, vec2 a, vec2 b) {
    vec2 ab = b - a;
    return clamp(dot(p - a, ab) / dot(ab, ab), 0.0, 1.0);
  }

  void main() {
    vec2 uv     = vUv;
    float aspect = resolution.x / resolution.y;

    if (!showDoubleImage) {
      gl_FragColor = texture2D(backgroundTex, uv);
      return;
    }

    // Map uv to NDC with aspect correction
    vec2 ndcUv  = (uv - 0.5) * vec2(aspect * 2.0, 2.0);
    vec2 ndcA   = stringA * vec2(aspect, 1.0);
    vec2 ndcB   = stringB * vec2(aspect, 1.0);

    float sd    = lineSignedDist(ndcUv, ndcA, ndcB);
    float dist  = abs(sd);

    // Deflection angle: δ = 4πGµ (conical, not 1/b like point mass)
    // Applied laterally — toward the string from both sides
    float strength = linearDensity * 0.018;
    float falloff  = exp(-dist * dist * 8.0); // localised near string
    // Lateral direction perpendicular to string
    vec2 ab       = normalize(ndcB - ndcA);
    vec2 perp     = vec2(-ab.y, ab.x);
    // Sign determines which side — both sides deflect TOWARD string
    float side    = sign(sd);
    vec2 deflect  = -perp * side * strength * falloff;

    // Back to uv space
    vec2 sampledUv = clamp(uv + deflect / vec2(aspect * 2.0, 2.0), 0.001, 0.999);
    gl_FragColor   = texture2D(backgroundTex, sampledUv);
  }
`;

export const createLensQuad = (uniforms: LensUniforms) =>
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
