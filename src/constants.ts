import { circle } from '@turf/turf';

export const LATITUDE = 21.7703;
export const LONGITUDE = -71.9041;
export const GEOFENCE = circle([LONGITUDE, LATITUDE], 150, { units: 'miles' });
export const FLY_TO_CURVE = 1.42;
