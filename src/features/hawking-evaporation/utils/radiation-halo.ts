import { AdditiveBlending, BackSide, Mesh, ShaderMaterial, SphereGeometry, type Color } from 'three';

const VERTEX_SHADER = `
  varying float vY;
  void main() {
    vY = position.y;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const FRAGMENT_SHADER = `
  uniform vec3 innerColor;
  uniform vec3 outerColor;
  uniform float opacity;
  varying float vY;
  void main() {
    gl_FragColor = vec4(mix(innerColor, outerColor, abs(vY)), opacity);
  }
`;

// Radiation halo — expanding sphere shell, driven by temp color
export const createRadiationHalo = (
  innerColor: Color,
  outerColor: Color,
  intensity: number,
): Mesh<SphereGeometry, ShaderMaterial> =>
  new Mesh(
    new SphereGeometry(3.5, 48, 48),
    new ShaderMaterial({
      uniforms: {
        innerColor: { value: innerColor.clone() },
        outerColor: { value: outerColor.clone() },
        opacity: { value: intensity * 0.07 },
      },
      vertexShader: VERTEX_SHADER,
      fragmentShader: FRAGMENT_SHADER,
      side: BackSide,
      blending: AdditiveBlending,
      transparent: true,
      depthWrite: false,
    }),
  );
