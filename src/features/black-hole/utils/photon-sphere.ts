import { AdditiveBlending, Color, FrontSide, ShaderMaterial, SphereGeometry, Vector3, Mesh } from 'three';

const FRESNEL_VERT = `
  uniform vec3 viewVector;
  varying float intensity;
  void main() {
    vec3 vNormal = normalize(normalMatrix * normal);
    vec3 vNormel = normalize(normalMatrix * viewVector);
    intensity = pow(0.65 - dot(vNormal, vNormel), 3.0);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const FRESNEL_FRAG = `
  uniform vec3 glowColor;
  varying float intensity;
  void main() {
    vec3 glow = glowColor * intensity;
    gl_FragColor = vec4(glow, intensity * 0.9);
  }
`;

export const createPhotonSphere = (cameraPos: Vector3) => {
  const geo = new SphereGeometry(1.5, 64, 64);
  const mat = new ShaderMaterial({
    uniforms: {
      glowColor: { value: new Color(0xffaa44) },
      viewVector: { value: cameraPos.clone() },
    },
    vertexShader: FRESNEL_VERT,
    fragmentShader: FRESNEL_FRAG,
    side: FrontSide,
    blending: AdditiveBlending,
    transparent: true,
    depthWrite: false,
  });
  return new Mesh(geo, mat);
};
