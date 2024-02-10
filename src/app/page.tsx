'use client';

import { Button } from '@chakra-ui/react';
import { Map } from '~/components/Map';
import styles from './page.module.css';

export default function Home() {
  return (
    <main className={styles.main}>
      <div className={styles.controls}>
        <Button colorScheme="blue" variant="outline">
          Trips
        </Button>
        <Button colorScheme="blue" variant="outline">
          Draw Path
        </Button>
      </div>
      <div className={styles.mapContainer}>
        <Map />
      </div>
    </main>
  );
}
