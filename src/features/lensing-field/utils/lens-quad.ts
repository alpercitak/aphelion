import { Mesh, PlaneGeometry, ShaderMaterial } from 'three';
import type { LensUniforms } from '../types';

// Full-screen lensing pass — UV displacement based on Schwarzschild deflection
// For each lens: compute displacement δuv ∝ mass / (b² + softening)
// Multiple lenses: sum displacements
const VERTEX_SHADER = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position.xy, 0.0, 1.0);
  }
`;

const FRAGMENT_SHADER = `
  varying vec2 vUv; // must be declared in fragment if passed from vertex
  uniform sampler2D backgroundTex;
  uniform vec2  resolution;

  uniform int   lensCount;
  uniform vec2  lensPos[5];       
  uniform float lensMass[5];      
  uniform bool  showMarkers;

  uniform bool  darkMatterMode;
  uniform vec2  dmPos[40];
  uniform float dmMass[40];

  vec2 lensDeflect(vec2 uv, vec2 lensNDC, float mass) {
    float aspect = resolution.x / resolution.y;
    vec2 uvNDC = (uv - 0.5) * vec2(aspect * 2.0, 2.0);
    vec2 lensAspect = lensNDC * vec2(aspect, 1.0);

    vec2  delta     = uvNDC - lensAspect;
    float b2        = dot(delta, delta);
    float softening = 0.002; 
    float strength  = mass * 0.00012;

    vec2 deflect = -normalize(delta) * strength / (b2 + softening);
    return deflect / vec2(aspect * 2.0, 2.0);
  }

  void main() {
    vec2 uv = vUv;
    vec2 totalDeflect = vec2(0.0);

    for (int i = 0; i < 5; i++) {
      float isActive = i < lensCount ? 1.0 : 0.0;
      totalDeflect += lensDeflect(uv, lensPos[i], lensMass[i]) * isActive;
    }

    if (darkMatterMode) {
      for (int i = 0; i < 40; i++) {
        totalDeflect += lensDeflect(uv, dmPos[i], dmMass[i]);
      }
    }

    vec2 sampledUv = clamp(uv + totalDeflect, 0.001, 0.999);
    vec4 col = texture2D(backgroundTex, sampledUv);

    if (showMarkers) {
      float aspect = resolution.x / resolution.y;
      for (int i = 0; i < 5; i++) {
        // apply the same 'isActive' logic for the markers
        if (i < lensCount) {
          vec2 uvNDC    = (uv - 0.5) * vec2(aspect * 2.0, 2.0);
          vec2 lensAsp  = lensPos[i] * vec2(aspect, 1.0);
          float dist    = length(uvNDC - lensAsp);
          float eRadius = sqrt(lensMass[i] * 0.001) * 0.08;
          float ring    = smoothstep(eRadius - 0.008, eRadius, dist)
                        * smoothstep(eRadius + 0.008, eRadius, dist);
          col.rgb += vec3(0.2, 0.4, 0.8) * ring * 0.5;
        }
      }
    }

    gl_FragColor = col;
  }
`;

export const createLensQuad = (uniforms: Omit<LensUniforms, 'dmLenses'>) =>
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
