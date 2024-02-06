import React, { useState, useCallback } from 'react';
import ReactMapGL, { ViewState, Marker } from 'react-map-gl';
import { booleanPointInPolygon, circle } from '@turf/turf';
import MapBoxGL from 'mapbox-gl';

const LATITUDE = 21.7703;
const LONGITUDE = -71.9041;
const GEOFENCE = circle([LONGITUDE, LATITUDE], 50, { units: 'miles' });

export const Map = () => {
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
  return (
    <>
      <ReactMapGL
        {...viewState}
        mapLib={MapBoxGL}
        onMove={onMove}
        style={{ maxHeight: '100%', maxWidth: '100%' }}
        mapStyle="mapbox://styles/mapbox/streets-v9"
        mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_PUBLIC_TOKEN}
        attributionControl={false}
        minZoom={8}
        reuseMaps>
        <Marker longitude={LONGITUDE} latitude={LATITUDE} anchor="bottom">
          <div>📍</div>
        </Marker>
      </ReactMapGL>
    </>
  );
};
