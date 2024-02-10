import React, { useState, useCallback } from 'react';
import ReactMapGL, {
  ViewState,
  MapLayerMouseEvent,
  NavigationControl,
} from 'react-map-gl';
import { booleanPointInPolygon } from '@turf/turf';
import MapBoxGL from 'mapbox-gl';
import { DrawControl } from '~/components/Map/DrawControl';
import { GEOFENCE, LONGITUDE, LATITUDE } from '~/constants';
import { useAppContext, ActionType } from '~/context/useContext';
import { Feature } from '~/types';

export const Map = () => {
  const { dispatch } = useAppContext();
  const onUpdate = useCallback(
    ({ features: newFeatures }: { features: Feature[] }) => {
      dispatch({
        type: ActionType.DrawUpdate,
        payload: newFeatures,
      });
    },
    [dispatch],
  );

  const onDelete = useCallback(
    ({ features: deletedFeatures }: { features: Feature[] }) => {
      dispatch({
        type: ActionType.DrawDelete,
        payload: deletedFeatures,
      });
    },
    [dispatch],
  );
  const [viewState, setViewState] = useState<Partial<ViewState>>({
    longitude: LONGITUDE,
    latitude: LATITUDE,
    zoom: 10,
  });

  const onMove = useCallback(({ viewState }: { viewState: ViewState }) => {
    const newCenter = [viewState.longitude, viewState.latitude];
    if (booleanPointInPolygon(newCenter, GEOFENCE)) {
      setViewState(viewState);
    }
  }, []);

  const handleClick = (_event: MapLayerMouseEvent) => {};
  return (
    <ReactMapGL
      mapLib={MapBoxGL}
      mapStyle="mapbox://styles/mapbox/standard"
      mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_PUBLIC_TOKEN}
      attributionControl={false}
      minZoom={8}
      longitude={viewState.longitude}
      latitude={viewState.latitude}
      zoom={viewState.zoom}
      onClick={handleClick}
      onMove={onMove}
      reuseMaps>
      <NavigationControl />
      <DrawControl
        position="top-left"
        displayControlsDefault={false}
        controls={{
          point: true,
          line_string: true,
          trash: true,
        }}
        defaultMode="simple_select"
        onCreate={onUpdate}
        onUpdate={onUpdate}
        onDelete={onDelete}
      />
    </ReactMapGL>
  );
};
