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
const droneIcon = new L.Icon({
  iconUrl: droneIconSvg,  // or use default Leaflet icon
  iconSize: [30, 30],
});


export default function MapComponent({ waypoints, setWaypoints, unitSystem, setUnitSystem }) {
  const startPosition = [37.7749, -122.4194]; // SF coordinates
  const [dronePosition, setDronePosition] = useState([37.7749, -122.4194]);  // home base
  const [logs, setLogs] = useState([]);
  


  //function to clear log panel
  function clearLogs() {
    setLogs([])
  }

  //function to clearwaypoints. This gets passed down to dronecontroller.jsx
  function clearWaypoints() {
    setWaypoints([]);
    setDronePosition([37.7749, -122.4194]); // Optional: reset to home base
    clearLogs();                          // Optional: clear log
  }



  return (
    <div style={{ height: '100vh', width: '100%' }}>
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
          waypoints={waypoints} setWaypoints={setWaypoints} unitSystem={unitSystem}
        />

        <Marker position={dronePosition} icon={droneIcon}>
          <Popup>Drone</Popup>
        </Marker>



      </MapContainer>
      <LogPanel logs={logs} clearLogs={clearLogs} />
      <DroneController waypoints={waypoints} setDronePosition={setDronePosition} dronePosition={dronePosition} logs={logs} setLogs={setLogs} handleClearWaypoints={clearWaypoints} />
      <MetricsPanel waypoints={waypoints} setWaypoints={setWaypoints} setLogs={setLogs} />
      <div
        style={{
          position: 'absolute',
          top: '12px',
          left: '12px',
          backgroundColor: 'white',
          padding: '6px 10px',
          borderRadius: '4px',
          boxShadow: '0 1px 6px rgba(0, 0, 0, 0.2)',
          zIndex: 999,
        }}
      >
        <UnitToggle unitSystem={unitSystem} onChange={setUnitSystem} />
      </div>




    </div>
  );
}
