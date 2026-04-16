import { useNavigate } from 'react-router-dom';
import Hud from '@/components/app/hud';
import Scanlines from '@/components/app/scanlines';
import { SCENES } from '@/utils/scene';
import styles from './index.module.css';

const TITLE = 'APHELION';
const SUBTITLE = 'DEEP-SPACE PHYSICS RENDERER';

export default function Home() {
  const navigate = useNavigate();

  return (
    <Hud className={styles['home']}>
      <Scanlines />

      <header className={styles['home__header']}>
        <div className={styles['home__header-title']}>{TITLE}</div>
        <p className={styles['home__header-subtitle']}>{SUBTITLE}</p>
      </header>

      <main className={styles['home__main']}>
        {SCENES.map((scene, i) => (
          <button key={scene.id} className={styles['home__card']} onClick={() => navigate(`/${scene.id}`)}>
            <div className={styles['home__card-index']}>0{i + 1}</div>
            <div className={styles['home__card-body']}>
              <div className={styles['home__card-title']}>{scene.title}</div>
              <div className={styles['home__card-subtitle']}>{scene.subtitle}</div>
              <div className={styles['home__card-description']}>{scene.description}</div>
            </div>
            <div className={styles['home__card-action']}>ENTER →</div>
          </button>
        ))}
      </main>

      <footer className={styles['home__footer']}>
        <span>SCHWARZSCHILD · KERR · PENROSE · HAWKING</span>
      </footer>
    </Hud>
  );
}
