'use client';

import { Map } from '~/components/Map';
import { useAppContext } from '~/context/useContext';
import styles from './page.module.css';

export default function Home() {
  const {
    state: { viewState, features },
  } = useAppContext();
  const points = features.filter((feature) => {
    return feature.geometry.type === 'Point';
  });
  return (
    <main className={styles.main}>
      <div className={styles.controls}>
        <h2>Number of Points: {points.length}</h2>
        <h2>View State</h2>
        <pre>{JSON.stringify(viewState, null, 2)}</pre>
      </div>
      <div className={styles.mapContainer}>
        <Map />
      </div>
    </main>
  );
}
