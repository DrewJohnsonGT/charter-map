import React, { useState, useCallback } from 'react';
import ReactMapGL, {
  ViewState,
  Marker,
  MapLayerMouseEvent,
  NavigationControl,
  useMap,
} from 'react-map-gl';
import MapboxDraw from '@mapbox/mapbox-gl-draw';
import { booleanPointInPolygon, circle } from '@turf/turf';
import MapBoxGL from 'mapbox-gl';
import { DrawControl } from '~/components/Map/DrawControl';

const LATITUDE = 21.7703;
const LONGITUDE = -71.9041;
const GEOFENCE = circle([LONGITUDE, LATITUDE], 50, { units: 'miles' });

const MapControl = () => {
  const map = useMap();
  console.log(map);
  return null;
};

export const Map = () => {
  const draw = new MapboxDraw();

  const [features, setFeatures] = useState({});
  const onUpdate = useCallback((e) => {}, []);

  const onDelete = useCallback((e) => {}, []);
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
  const handleClick = (event: MapLayerMouseEvent) => {
    console.log(event.lngLat);
  };
  console.log(features);
  return (
    <ReactMapGL
      {...viewState}
      mapLib={MapBoxGL}
      onMove={onMove}
      mapStyle="mapbox://styles/mapbox/standard"
      mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_PUBLIC_TOKEN}
      attributionControl={false}
      minZoom={8}
      reuseMaps
      onClick={handleClick}>
      <MapControl />
      <NavigationControl />
      <DrawControl
        draw={draw}
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
      <Marker longitude={LONGITUDE} latitude={LATITUDE}>
        <div>📍</div>
      </Marker>
    </ReactMapGL>
  );
};
