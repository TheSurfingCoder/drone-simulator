//use this to create the WaypointMarker. Props are passed down from waypoint manager

import { Marker, Popup } from 'react-leaflet';

export default function WaypointMarker({ lat, lng, index }) {
  return (
    <Marker position={[lat, lng]}>
      <Popup>Waypoint {index + 1}</Popup>
    </Marker>
  );
}
