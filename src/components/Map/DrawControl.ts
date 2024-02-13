import { useEffect } from 'react';
import type { ControlPosition } from 'react-map-gl';
import { useControl } from 'react-map-gl';
import MapboxDraw, { MapboxDrawOptions } from '@mapbox/mapbox-gl-draw';
import { Feature } from '~/types';

interface DrawControlProps {
  position?: ControlPosition;
  drawProps?: MapboxDrawOptions;
  handleSetDrawRef?: (draw: MapboxDraw) => void;
  onCreate: (evt: { features: Feature[] }) => void;
  onUpdate: (evt: { features: Feature[]; action: string }) => void;
  onDelete: (evt: { features: Feature[] }) => void;
}

export const DrawControl = ({
  drawProps,
  handleSetDrawRef,
  onCreate,
  onDelete,
  onUpdate,
  position,
}: DrawControlProps) => {
  const draw = useControl<MapboxDraw>(
    () => new MapboxDraw(drawProps),
    ({ map }) => {
      map.on('draw.create', onCreate);
      map.on('draw.update', onUpdate);
      map.on('draw.delete', onDelete);
    },
    ({ map }) => {
      map.off('draw.create', onCreate);
      map.off('draw.update', onUpdate);
      map.off('draw.delete', onDelete);
    },
    {
      position,
    },
  );

  useEffect(() => {
    if (draw) {
      handleSetDrawRef?.(draw);
    }
  }, [draw, handleSetDrawRef]);

  return null;
};
