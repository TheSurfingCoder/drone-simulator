//click handling + waypoint storage + polyline

import { useState } from 'react';
import { Marker, Popup, useMapEvents, Polyline } from 'react-leaflet';
import WaypointMarker from './WaypointMarker.jsx';



export default function WaypointManager({waypoints, setWaypoints}) {

 

  useMapEvents({
    click(e) {
      const { lat, lng } = e.latlng;
      setWaypoints((prev) => [...prev, { lat, lng }]);
    },
  });
  console.log(waypoints);
  return (
    <>
      {
        waypoints.map((point, index) => {
          return (
            <WaypointMarker
              key={index}
              lat={point.lat}
              lng={point.lng}
              index={index}
            />
          )
        })
      }
      {waypoints.length > 1 && (
        <Polyline
          positions={waypoints.map(wp => [wp.lat, wp.lng])}
          pathOptions={{ color: 'blue', weight: 3 }}
        />
      )}

    </>
  )
}