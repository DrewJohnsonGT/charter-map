'use client';

import { useEffect, useState } from 'react';
import { FiMapPin } from 'react-icons/fi';
import { Button, Heading, List, ListIcon, ListItem } from '@chakra-ui/react';
import clsx from 'clsx';
import { Map } from '~/components/Map';
import { ActionType, useAppContext } from '~/context/useContext';
import { deleteFeature, getAllFeatures, setFeature } from '~/firebase/api';
import styles from './page.module.css';

export default function Home() {
  const [isSavingFeatures, setIsSavingFeatures] = useState(false);
  const {
    dispatch,
    state: {
      features,
      loading: { drawReference: drawReferenceLoading },
      selectedFeatureIds,
      storedFeatures,
    },
  } = useAppContext();

  useEffect(() => {
    if (drawReferenceLoading) return;
    getAllFeatures().then((features) => {
      dispatch({
        payload: features,
        type: ActionType.LoadFeatures,
      });
    });
  }, [dispatch, drawReferenceLoading]);
  const points = features.filter((feature) => {
    return feature.geometry.type === 'Point';
  });
  const lines = features.filter((feature) => {
    return feature.geometry.type === 'LineString';
  });
  const handleClickFeature = (id?: string | number) => {
    if (!id) return;
    dispatch({
      payload: [String(id)],
      type: ActionType.FeatureSelected,
    });
  };
  const handleSave = async () => {
    setIsSavingFeatures(true);
    const featuresToBeDeleted = storedFeatures
      .filter((feature) => !features.some((f) => f.id === feature.id))
      .map((feature) => feature.id);
    await Promise.all(featuresToBeDeleted.map((id) => deleteFeature(id)));
    await Promise.all(features.map((feature) => setFeature(feature)));
    setIsSavingFeatures(false);
  };
  return (
    <main className={styles.main}>
      <div className={styles.controls}>
        <Button
          colorScheme="green"
          onClick={handleSave}
          isLoading={isSavingFeatures}>
          Save
        </Button>
        <div className={styles.points}>
          <Heading as="h2" size="xl">
            Points
          </Heading>
          <List spacing={3}>
            {points.map((point, index) => (
              <ListItem
                key={point.id}
                className={clsx(
                  styles.feature,
                  selectedFeatureIds.includes(String(point.id)) &&
                    styles.selectedFeature,
                )}
                onClick={() => handleClickFeature(point.id)}>
                <ListIcon as={FiMapPin} />
                {point?.properties?.name || index}
              </ListItem>
            ))}
          </List>
        </div>
        <div className={styles.lines}>
          <Heading as="h2" size="xl">
            Paths
          </Heading>
          <List spacing={3}>
            {lines.map((line, index) => (
              <ListItem
                key={line.id}
                className={clsx(
                  styles.feature,
                  selectedFeatureIds.includes(String(line.id)) &&
                    styles.selectedFeature,
                )}
                onClick={() => handleClickFeature(line.id)}>
                <ListIcon as={FiMapPin} />
                {line?.properties?.name || index}
              </ListItem>
            ))}
          </List>
        </div>
      </div>
      <div className={styles.mapContainer}>
        <Map />
      </div>
    </main>
  );
}
