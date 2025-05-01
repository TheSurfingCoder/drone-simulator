//use this to create the WaypointMarker. This is then called from waypoint manager

import { Marker, Popup } from 'react-leaflet';

export default function WaypointMarker({ lat, lng, index }) {
  return (
    <Marker position={[lat, lng]}>
      <Popup>Waypoint {index + 1}</Popup>
    </Marker>
  );
}
