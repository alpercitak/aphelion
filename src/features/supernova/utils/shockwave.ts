import { AdditiveBlending, Color, DoubleSide, Mesh, ShaderMaterial, SphereGeometry } from 'three';

// Shockwave ring — thin expanding shell
const VERTEX_SHADER = `
  varying vec3 vNormal;
  void main() {
    vNormal = normalize(normalMatrix * normal);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const FRAGMENT_SHADER = `
  uniform vec3  innerColor;
  uniform vec3  outerColor;
  uniform float opacity;
  varying vec3  vNormal;
  void main() {
    float edge = 1.0 - abs(dot(vNormal, vec3(0.0, 0.0, 1.0)));
    vec3  col  = mix(innerColor, outerColor, edge);
    gl_FragColor = vec4(col, opacity * (0.4 + edge * 0.6));
  }
`;

export const createShockwave = (radius: number): Mesh<SphereGeometry, ShaderMaterial> => {
  return new Mesh(
    new SphereGeometry(radius, 64, 32),
    new ShaderMaterial({
      uniforms: {
        innerColor: { value: new Color(0xffeedd) },
        outerColor: { value: new Color(0xff6600) },
        opacity: { value: 0.6 },
      },
      vertexShader: VERTEX_SHADER,
      fragmentShader: FRAGMENT_SHADER,
      transparent: true,
      depthWrite: false,
      side: DoubleSide,
      blending: AdditiveBlending,
    }),
  );
};
