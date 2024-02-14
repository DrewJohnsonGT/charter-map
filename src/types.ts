import type { Feature as GEOJsonFeature, LineString, Point } from 'geojson';

export type { ViewState } from 'react-map-gl';

export type Feature = GEOJsonFeature<Point | LineString> & {
  name?: string;
};
