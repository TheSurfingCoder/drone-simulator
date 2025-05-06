import { Entity } from 'resium';
import {
  Cartesian3,
  Color,
  DistanceDisplayCondition,
} from '@cesium/engine';

export default function CesiumWaypointEntity({ wp, unitSystem, index }) {
  const altitude = wp.alt ?? 0;

  return (
    <Entity
      name={`Waypoint ${index + 1}`}
      position={Cartesian3.fromDegrees(wp.lng, wp.lat, altitude)}
      point={{
        pixelSize: 14,
        color: Color.RED.withAlpha(0.95),
        outlineColor: Color.WHITE,
        outlineWidth: 2,
        disableDepthTestDistance: Number.POSITIVE_INFINITY,
      }}
      label={{
        text:
          unitSystem === 'metric'
            ? `${altitude.toFixed(1)} m`
            : `${(altitude * 3.28084).toFixed(1)} ft`,
        font: 'bold 16px sans-serif',
        fillColor: Color.WHITE,
        outlineColor: Color.BLACK,
        outlineWidth: 4,
        showBackground: true,
        backgroundColor: Color.BLACK.withAlpha(0.6),
        verticalOrigin: 1,
        pixelOffset: new Cartesian3(0, -35, 0),
        scale: 1.2,
        distanceDisplayCondition: new DistanceDisplayCondition(0.0, 10000.0),
        disableDepthTestDistance: Number.POSITIVE_INFINITY,
      }}
      description={`Lat: ${wp.lat.toFixed(5)}, Lng: ${wp.lng.toFixed(
        5
      )}, Alt: ${
        unitSystem === 'metric'
          ? `${altitude.toFixed(2)}m`
          : `${(altitude * 3.28084).toFixed(2)}ft`
      }`}
    />
  );
}
