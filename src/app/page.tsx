'use client';

import { Map } from '~/components/Map';
import { useAppContext } from '~/context/useContext';
import styles from './page.module.css';

export default function Home() {
  const {
    state: { features },
  } = useAppContext();
  const points = features.filter((feature) => {
    return feature.geometry.type === 'Point';
  });
  return (
    <main className={styles.main}>
      <div className={styles.controls}>
        <h2>Points</h2>
        <ul>
          {points.map((point) => {
            return (
              <li key={point.id}>
                <span>{point.id}</span>
              </li>
            );
          })}
        </ul>
      </div>
      <div className={styles.mapContainer}>
        <Map />
      </div>
    </main>
  );
}
