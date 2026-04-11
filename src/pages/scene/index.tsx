import { Suspense } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getScene } from '@/utils/scene';
import styles from './index.module.css';

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
      <button className={styles.back} onClick={() => navigate('/')}>
        ← APHELION
      </button>
      <Suspense fallback={<Loading />}>
        <SceneComponent />
      </Suspense>
    </div>
  );
}
