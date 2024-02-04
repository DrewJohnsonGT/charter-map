import React, { ComponentType } from 'react';
import dynamic from 'next/dynamic';

export interface MapProps {
  position: [number, number];
  zoom: number;
  width?: number;
  height?: number;
}

const DynamicMap: ComponentType<MapProps> = dynamic(() => import('./Map'), {
  ssr: false,
});

const DEFAULT_WIDTH = 600;
const DEFAULT_HEIGHT = 600;

export const Map = (props: MapProps) => {
  const { width = DEFAULT_WIDTH, height = DEFAULT_HEIGHT } = props;
  return (
    <div style={{ aspectRatio: width / height }}>
      <DynamicMap {...props} />
    </div>
  );
};
