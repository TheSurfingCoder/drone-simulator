//leaflet map and parent component for waypointmanager and dronecontroller

//importing react leaflet compoentnts
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import droneIconSvg from '/Users/mbp/Codingprojects/Portfolio-Projects/virtual-drone/client/src/assets/react.svg'
import 'leaflet/dist/leaflet.css'; // Leaflet needs this for icons to display correctly
import WaypointManager from './WaypointManager';
import { useState } from 'react';
import DroneController from './DroneController.jsx';


// Optional: custom drone icon (replace path if needed)
const droneIcon = new L.Icon({
  iconUrl: droneIconSvg,  // or use default Leaflet icon
  iconSize: [30, 30],
});


//Creating state for Waypoints


export default function MapComponent() {
  const startPosition = [37.7749, -122.4194]; // SF coordinates
  const [waypoints, setWaypoints] = useState([]);
  const [dronePosition, setDronePosition] = useState([37.7749, -122.4194]);  // home base


  return (
    <div className="fullscreen-map">
      <MapContainer
        center={startPosition}
        zoom={13}
        scrollWheelZoom={true}
        className="fullscreen-map"
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; OpenStreetMap contributors'
        />
        <WaypointManager
          waypoints={waypoints} setWaypoints={setWaypoints}
        />
        <DroneController waypoints={waypoints} setDronePosition={setDronePosition} />
        <Marker position={dronePosition} icon={droneIcon}>
          <Popup>Drone</Popup>
        </Marker>

      </MapContainer>

    </div>
  );
}
