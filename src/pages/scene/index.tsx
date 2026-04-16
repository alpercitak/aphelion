import { Suspense } from 'react';
import { useParams } from 'react-router-dom';
import { getScene } from '@/utils/scene';
import SceneAlert from './components/scene-alert';
import styles from './index.module.css';

export default function ScenePage() {
  const { sceneId } = useParams();

  if (!sceneId) {
    return <SceneAlert text="Not found" />;
  }

  const scene = getScene(sceneId);
  if (!scene || !scene.component) {
    return <SceneAlert text="Not found" />;
  }

  const SceneComponent = scene.component;

  return (
    <div className={styles['scene']}>
      <Suspense fallback={<SceneAlert text="Initializing" />}>
        <SceneComponent />
      </Suspense>
    </div>
  );
}
