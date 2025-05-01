//leaflet map + drone marker

//importing react leaflet compoentnts
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import droneIconSvg from '/Users/mbp/Codingprojects/Portfolio-Projects/virtual-drone/client/src/assets/react.svg'

// Leaflet needs this for icons to display correctly
import 'leaflet/dist/leaflet.css';

// Optional: custom drone icon (replace path if needed)
const droneIcon = new L.Icon({
  iconUrl: droneIconSvg,  // or use default Leaflet icon
  iconSize: [30, 30],
});

export default function MapComponent() {
  const startPosition = [37.7749, -122.4194]; // SF coordinates

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
        <Marker position={startPosition} icon={droneIcon}>
          <Popup>Drone Home Base</Popup>
        </Marker>
      </MapContainer>
    </div>
  );
}
