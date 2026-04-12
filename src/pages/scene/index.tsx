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

function NotFound() {
  const navigate = useNavigate();
  return (
    <div className={styles.loading}>
      <span>SCENE NOT FOUND</span>
      <button onClick={() => navigate('/')}>← BACK</button>
    </div>
  );
}

export default function ScenePage() {
  const { sceneId } = useParams();
  if (!sceneId) {
    return <NotFound />;
  }

  const scene = getScene(sceneId);
  if (!scene || !scene.component) {
    return <NotFound />;
  }

  const SceneComponent = scene.component;

  return (
    <div className={styles.root}>
      <Suspense fallback={<Loading />}>
        <SceneComponent />
      </Suspense>
    </div>
  );
}
