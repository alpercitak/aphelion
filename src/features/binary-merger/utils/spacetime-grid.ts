import { Mesh, PlaneGeometry, ShaderMaterial, Vector2 } from 'three';

const SIZE = 28 as const;
const SEGMENTS = 90 as const;

// Vertex shader deforms Y with wave equation
const VERTEX_SHADER = `
  uniform float time;
  uniform float amplitude;
  uniform vec2 source1;
  uniform vec2 source2;
  uniform float separation;

  void main() {
    vec3 pos = position;
    float r1 = distance(pos.xz, source1);
    float r2 = distance(pos.xz, source2);

    float k = 1.8;     // spatial frequency (wave tightness)
    float omega = 2.4; // temporal frequency (wave speed)
    float damp = 0.18; // radial damping (wave falloff with distance)

    float w1 = amplitude * sin(k * r1 - omega * time) * exp(-r1 * damp);
    float w2 = amplitude * sin(k * r2 - omega * time) * exp(-r2 * damp);

    // Suppress wave inside the orbital radius
    float suppress = smoothstep(separation * 0.4, separation * 1.2, r1)
                   * smoothstep(separation * 0.4, separation * 1.2, r2);

    pos.y = (w1 + w2) * suppress;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  }
`;

const FRAGMENT_SHADER = `
  uniform float amplitude;
  void main() {
    gl_FragColor = vec4(0.18, 0.55, 0.85, 0.18 + amplitude * 0.12);
  }
`;

export const createSpacetimeGrid = (): Mesh<PlaneGeometry, ShaderMaterial> => {
  const geo = new PlaneGeometry(SIZE, SIZE, SEGMENTS, SEGMENTS);
  geo.rotateX(-Math.PI / 2);
  const mat = new ShaderMaterial({
    uniforms: {
      time: { value: 0 },
      amplitude: { value: 1.0 },
      source1: { value: new Vector2(2, 0) },
      source2: { value: new Vector2(-2, 0) },
      separation: { value: 4.0 },
    },
    vertexShader: VERTEX_SHADER,
    fragmentShader: FRAGMENT_SHADER,
    transparent: true,
    depthWrite: false,
    wireframe: true,
  });
  return new Mesh(geo, mat);
};
