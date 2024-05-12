import React, { useCallback } from 'react';
import ReactMapGL, {
  MapLayerMouseEvent,
  NavigationControl,
  ViewState,
} from 'react-map-gl';
import { booleanPointInPolygon } from '@turf/turf';
import MapBoxGL from 'mapbox-gl';
import { DrawControl } from '~/components/Map/DrawControl';
import { FLY_TO_CURVE, GEOFENCE } from '~/constants';
import { ActionType, useAppContext } from '~/context/useContext';
import { Feature } from '~/types';

export const Map = () => {
  const {
    dispatch,
    state: { draw, mapRef, viewState },
  } = useAppContext();
  const onUpdate = useCallback(
    ({ features: newFeatures }: { features: Feature[] }) => {
      dispatch({
        payload: newFeatures,
        type: ActionType.DrawUpdate,
      });
    },
    [dispatch],
  );

  const onDelete = useCallback(
    ({ features: deletedFeatures }: { features: Feature[] }) => {
      dispatch({
        payload: deletedFeatures,
        type: ActionType.DrawDelete,
      });
    },
    [dispatch],
  );

  const onMove = useCallback(
    ({ viewState }: { viewState: ViewState }) => {
      const newCenter = [viewState.longitude, viewState.latitude];
      if (booleanPointInPolygon(newCenter, GEOFENCE)) {
        dispatch({
          payload: viewState,
          type: ActionType.SetViewState,
        });
      }
    },
    [dispatch],
  );

  const handleSetDrawRef = useCallback(
    (draw: MapboxDraw) => {
      dispatch({
        payload: draw,
        type: ActionType.SetDrawReference,
      });
    },
    [dispatch],
  );

  const handleClick = (event: MapLayerMouseEvent) => {
    const featureClicked = draw?.getFeatureIdsAt({
      x: event.point.x,
      y: event.point.y,
    });
    if (featureClicked?.length) {
      dispatch({
        payload: featureClicked,
        type: ActionType.FeatureSelected,
      });
      mapRef?.current?.flyTo({
        center: event.lngLat,
        curve: FLY_TO_CURVE,
        duration: 1000,
      });
    }
  };

  return (
    <ReactMapGL
      ref={mapRef}
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
        drawProps={{
          controls: {
            line_string: true,
            point: true,
            trash: true,
          },
          defaultMode: 'simple_select',
          displayControlsDefault: false,
        }}
        handleSetDrawRef={handleSetDrawRef}
        onCreate={onUpdate}
        onUpdate={onUpdate}
        onDelete={onDelete}
      />
    </ReactMapGL>
  );
};
