//leaflet map and parent component for waypointmanager and dronecontroller

//importing react leaflet compoentnts
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import droneIconSvg from '../assets/react.svg'
import 'leaflet/dist/leaflet.css'; // Leaflet needs this for icons to display correctly
import WaypointManager from './WaypointManager';
import { useState } from 'react';
import DroneController from './DroneController.jsx';
import LogPanel from './LogPanel.jsx';
import { GeoJSON } from 'react-leaflet';
import MetricsPanel from './MetricsPanel.jsx';
import UnitToggle from './UnitToggle.jsx';



// Optional: custom drone icon (replace path if needed)



export default function MapComponent({ waypoints, setWaypoints, unitSystem, setUnitSystem, dronePosition }) {
  // home base
  const startPosition = [37.7749, -122.4194]; // SF coordinates

  const droneIcon = new L.Icon({
    iconUrl: droneIconSvg, // or use default Leaflet icon
    iconSize: [30, 30],
  });


  return (
    <div className="relative h-full w-full">
      <MapContainer
        center={startPosition}
        zoom={13}
        scrollWheelZoom={true}
        className="fullscreen-map z-0"
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; OpenStreetMap contributors'
        />
        <WaypointManager
          waypoints={waypoints} setWaypoints={setWaypoints} unitSystem={unitSystem}
        />
        <Marker position={dronePosition} icon={droneIcon}>
          <Popup>Drone</Popup>
        </Marker>
      </MapContainer>

    </div>
  );
}
