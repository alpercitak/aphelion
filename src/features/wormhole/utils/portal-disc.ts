import { DoubleSide, Mesh, ShaderMaterial, SphereGeometry, WebGLRenderTarget } from 'three';

// Interior portal — samples the render target texture
const VERTEX_SHADER = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const FRAGMENT_SHADER = `
  uniform sampler2D portalTexture;
  uniform float time;
  uniform float distortion;
  varying vec2 vUv;

  void main() {
    vec2 uv = vUv;
    // Radial distortion from center — simulates spacetime curvature at throat
    vec2 centered = uv - 0.5;
    float r = length(centered);
    float distortAmount = distortion * 0.06 * (1.0 - smoothstep(0.0, 0.5, r));
    uv += centered * distortAmount;
    // Subtle time-based shimmer at the edge
    float edge = smoothstep(0.3, 0.5, r);
    uv += vec2(sin(time * 0.8 + uv.y * 4.0), cos(time * 0.6 + uv.x * 4.0)) * 0.004 * edge;
    gl_FragColor = texture2D(portalTexture, clamp(uv, 0.0, 1.0));
  }
`;

// Portal disc — hemisphere showing the render target (other side view)
export const createPortalDisc = (
  radius: number,
  renderTarget: WebGLRenderTarget,
): Mesh<SphereGeometry, ShaderMaterial> => {
  // Use a flat disc (SphereGeometry with small height segments gives good UVs)
  const geo = new SphereGeometry(radius * 0.98, 64, 32, 0, Math.PI * 2, 0, Math.PI * 0.5);
  const mat = new ShaderMaterial({
    uniforms: {
      portalTexture: { value: renderTarget.texture },
      time: { value: 0 },
      distortion: { value: 1.0 },
    },
    vertexShader: VERTEX_SHADER,
    fragmentShader: FRAGMENT_SHADER,
    side: DoubleSide,
    depthWrite: false,
  });
  return new Mesh(geo, mat);
};
