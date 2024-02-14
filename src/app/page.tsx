'use client';

import { useEffect, useState } from 'react';
import { Button, Heading, List, ListItem, useToast } from '@chakra-ui/react';
import clsx from 'clsx';
import isEqual from 'lodash.isequal';
import { EditableLabel } from '~/components/EditableLabel';
import { Map } from '~/components/Map';
import { ActionType, useAppContext } from '~/context/useContext';
import { deleteFeature, getAllFeatures, setFeature } from '~/firebase/api';
import { Feature } from '~/types';
import styles from './page.module.css';

export default function Home() {
  const [isSavingFeatures, setIsSavingFeatures] = useState(false);
  const toast = useToast();
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
    toast({
      duration: 3000,
      isClosable: true,
      status: 'success',
      title: 'Features saved',
    });
  };

  const handleUpdateFeatureName = (id: Feature['id'], name: string) =>
    dispatch({
      payload: { id, name },
      type: ActionType.UpdateFeature,
    });

  return (
    <main className={styles.main}>
      <div className={styles.controls}>
        <div className={styles.points}>
          <Heading as="h2" size="xl">
            Points
          </Heading>
          <List spacing={1}>
            {points.map((point) => (
              <ListItem
                key={point.id}
                className={clsx(
                  styles.feature,
                  selectedFeatureIds.includes(String(point.id)) &&
                    styles.selectedFeature,
                )}
                onClick={() => handleClickFeature(point.id)}>
                <EditableLabel
                  placeholder="No name"
                  defaultValue={point?.name || ''}
                  onChange={(newValue) =>
                    handleUpdateFeatureName(point.id, newValue)
                  }
                />
              </ListItem>
            ))}
          </List>
        </div>
        <div className={styles.lines}>
          <Heading as="h2" size="xl">
            Routes
          </Heading>
          <List spacing={1}>
            {lines.map((line) => (
              <ListItem
                key={line.id}
                className={clsx(
                  styles.feature,
                  selectedFeatureIds.includes(String(line.id)) &&
                    styles.selectedFeature,
                )}
                onClick={() => handleClickFeature(line.id)}>
                <EditableLabel
                  placeholder="No name"
                  defaultValue={line?.name || ''}
                  onChange={(newValue) =>
                    handleUpdateFeatureName(line.id, newValue)
                  }
                />
              </ListItem>
            ))}
          </List>
        </div>
        <Button
          colorScheme="green"
          onClick={handleSave}
          isLoading={isSavingFeatures}
          isDisabled={isEqual(features, storedFeatures)}>
          Save
        </Button>
      </div>
      <div className={styles.mapContainer}>
        <Map />
      </div>
    </main>
  );
}
