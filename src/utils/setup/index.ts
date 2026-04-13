import { ACESFilmicToneMapping, PerspectiveCamera, Scene, WebGLRenderer } from 'three';
import { createOrbitControls, type OrbitOptions } from '../camera';
import { createStarField } from '../starfield';

interface SetupSceneProps {
  canvas: HTMLCanvasElement;
  cameraPosition: [number, number, number];
  orbitOptions?: OrbitOptions;
  toneMappingExposure?: number;
}

export const setupScene = ({
  canvas,
  cameraPosition,
  orbitOptions = {},
  toneMappingExposure = 1.2,
}: SetupSceneProps) => {
  const renderer = new WebGLRenderer({ canvas, antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.toneMapping = ACESFilmicToneMapping;
  renderer.toneMappingExposure = toneMappingExposure;

  const scene = new Scene();

  const camera = new PerspectiveCamera(55, window.innerWidth / window.innerHeight, 0.01, 1000);
  camera.position.set(...cameraPosition);
  camera.lookAt(0, 0, 0);

  const orbit = createOrbitControls(canvas, orbitOptions);

  const stars = createStarField();
  scene.add(stars);

  const onResize = () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  };
  window.addEventListener('resize', onResize);

  const dispose = () => {
    window.removeEventListener('resize', onResize);
    orbit.dispose();
    renderer.setAnimationLoop(null);
    scene.traverse((object: any) => {
      // dispose geometries
      if (object.geometry) {
        object.geometry.dispose();
      }
      // dispose materials
      if (object.material) {
        const materials = Array.isArray(object.material) ? object.material : [object.material];
        for (const mat of materials) {
          // dispose any textures assigned to the material
          for (const key of Object.keys(mat)) {
            if (mat[key] && mat[key].isTexture) {
              mat[key].dispose();
            }
          }
          mat.dispose();
        }
      }
    });
    renderer.dispose();
  };

  return { renderer, scene, camera, orbit, stars, dispose };
};
