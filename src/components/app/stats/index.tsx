import styles from './index.module.css';

interface Props {
  mass: number; // Solar masses (M☉)
  spin: number; // Dimensionless spin parameter (a*)
  hawkingTemp: number; // Kelvin (K)
  schwarzschildKm: number; // Radius in Kilometers (km)
}

const THERMAL_THRESHOLD = 1e10;

export default function Stats({ mass, spin, hawkingTemp, schwarzschildKm }: Props) {
  const tempDisplay = hawkingTemp > THERMAL_THRESHOLD ? (hawkingTemp / THERMAL_THRESHOLD).toExponential(1) : '~0';

  return (
    <div className={styles.stats}>
      MASS <span>{mass.toFixed(1)}</span> M☉
      <br />
      SPIN <span>{spin.toFixed(2)}</span> a<br />
      TEMP <span>{tempDisplay}</span> K<br />R<sub>s</sub> <span>{schwarzschildKm.toFixed(1)}</span> km
    </div>
  );
}
