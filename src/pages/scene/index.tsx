import { Suspense } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getScene } from '@/utils/scene';
import styles from './index.module.css';
import Crosshair from '@/components/app/crosshair';

function Loading() {
  return (
    <div className={styles.loading}>
      <span>INITIALIZING</span>
    </div>
  );
}

export default function ScenePage() {
  const { sceneId } = useParams();
  const navigate = useNavigate();
  const scene = getScene(sceneId);

  if (!scene || !scene.component) {
    return (
      <div className={styles.loading}>
        <span>SCENE NOT FOUND</span>
        <button onClick={() => navigate('/')}>← BACK</button>
      </div>
    );
  }

  const SceneComponent = scene.component;

  return (
    <div className={styles.root}>
      <Suspense fallback={<Loading />}>
        <SceneComponent />
        <Crosshair />
      </Suspense>
    </div>
  );
}
