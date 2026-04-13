import {
  AdditiveBlending,
  BackSide,
  Color,
  FrontSide,
  Mesh,
  ShaderMaterial,
  SphereGeometry,
  Vector3,
  type Side,
} from 'three';

const VERTEX_SHADER = `
    uniform vec3 viewVector;
    varying float intensity;
    void main() {
      vec3 vNormal = normalize(normalMatrix * normal);
      vec3 vNormel = normalize(normalMatrix * viewVector);
      intensity = pow(max(0.0, 0.65 - dot(vNormal, vNormel)), 3.0);
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

const createGlowMesh = (radius: number, side: Side, cameraPos: Vector3, color: Color) =>
  new Mesh(
    new SphereGeometry(radius, 48, 48),
    new ShaderMaterial({
      uniforms: {
        glowColor: { value: color.clone() },
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

export const createPhotonGlow = (cameraPos: Vector3, color: Color) => createGlowMesh(1.5, FrontSide, cameraPos, color);

export const createOuterGlow = (cameraPos: Vector3, color: Color) => createGlowMesh(2.2, BackSide, cameraPos, color);
