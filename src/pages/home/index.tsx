import { useNavigate } from 'react-router-dom';
import Hud from '@/components/app/hud';
import Scanlines from '@/components/app/scanlines';
import { SCENES } from '@/utils/scene';
import styles from './index.module.css';

export default function Home() {
  const navigate = useNavigate();

  return (
    <Hud className={styles.root}>
      <Scanlines />

      <header className={styles.header}>
        <div className={styles.logo}>APHELION</div>
        <p className={styles.tagline}>DEEP-SPACE PHYSICS RENDERER</p>
      </header>

      <main className={styles.grid}>
        {SCENES.map((scene, i) => (
          <button
            key={scene.id}
            className={`${styles.card} ${scene.status === 'coming-soon' ? styles.locked : ''}`}
            onClick={() => scene.status === 'available' && navigate(`/${scene.id}`)}
            disabled={scene.status !== 'available'}
          >
            <div className={styles.cardIndex}>0{i + 1}</div>
            <div className={styles.cardBody}>
              <div className={styles.cardTitle}>{scene.title}</div>
              <div className={styles.cardSubtitle}>{scene.subtitle}</div>
              <div className={styles.cardDesc}>{scene.description}</div>
            </div>
            <div className={styles.cardStatus}>
              {scene.status === 'available' ? (
                <span className={styles.available}>ENTER →</span>
              ) : (
                <span className={styles.soon}>SOON</span>
              )}
            </div>
          </button>
        ))}
      </main>

      <footer className={styles.footer}>
        <span>SCHWARZSCHILD · KERR · PENROSE · HAWKING</span>
      </footer>
    </Hud>
  );
}
