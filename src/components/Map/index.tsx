import React, { useState, useCallback } from 'react';
import ReactMapGL, { ViewState, Source, Layer } from 'react-map-gl';
import type { CircleLayer } from 'react-map-gl';
import { booleanPointInPolygon, circle } from '@turf/turf';
import type { FeatureCollection } from 'geojson';
import MapBoxGL from 'mapbox-gl';

const LATITUDE = 21.7703;
const LONGITUDE = -71.9041;
const GEOFENCE = circle([LONGITUDE, LATITUDE], 50, { units: 'miles' });

const geojson: FeatureCollection = {
  type: 'FeatureCollection',
  features: [
    {
      type: 'Feature',
      geometry: { type: 'Point', coordinates: [LATITUDE, LONGITUDE] },
      properties: { name: 'TESTING' },
    },
  ],
};

const layerStyle: CircleLayer = {
  id: 'point',
  type: 'circle',
  paint: {
    'circle-radius': 10,
    'circle-color': '#007cbf',
  },
};

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
      {JSON.stringify(viewState)}
      <ReactMapGL
        {...viewState}
        mapLib={MapBoxGL}
        onMove={onMove}
        style={{ maxHeight: '100%', maxWidth: '90%' }}
        mapStyle="mapbox://styles/mapbox/streets-v9"
        mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_PUBLIC_TOKEN}
        attributionControl={false}
        minZoom={8}
        reuseMaps>
        <Source id="my-data" type="geojson" data={geojson}>
          <Layer {...layerStyle} />
        </Source>
      </ReactMapGL>
    </>
  );
};
