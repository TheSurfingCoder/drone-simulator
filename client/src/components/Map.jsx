import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import WaypointManager from './WaypointManager';
import { forwardRef, useImperativeHandle, useRef, useEffect, useState } from 'react';
import droneIconSvg from '../assets/react.svg';
import { Ion, createWorldTerrainAsync } from '@cesium/engine';
import AltitudeSlider from './AltitudeSlider'; // adjust path if needed


Ion.defaultAccessToken = import.meta.env.VITE_CESIUM_TOKEN;



const MapComponent = forwardRef(({ waypoints, setWaypoints, unitSystem, setUnitSystem, dronePosition }, ref) => {
  const mapInstance = useRef(null);
  const startPosition = [37.7749, -122.4194]; // SF
  const [terrainProvider, setTerrainProvider] = useState(null);

  const droneIcon = new L.Icon({
    iconUrl: droneIconSvg,
    iconSize: [30, 30],
  });

  // Expose a setView method to the parent via ref
  useImperativeHandle(ref, () => ({
    setView: (lat, lng, zoom = 15) => {
      mapInstance.current?.setView([lat, lng], zoom);
    }
  }));

  useEffect(() => {
    const loadTerrain = async () => {
      try {
        const terrain = await createWorldTerrainAsync();
        setTerrainProvider(terrain);
      } catch (err) {
        console.error("Failed to load Cesium terrain provider:", err);
      }
    };

    loadTerrain();
  }, []);

  


  return (
    <div className="relative h-full w-full">
      <MapContainer
        ref={ref}
        center={startPosition}
        zoom={13}
        scrollWheelZoom={true}
        whenCreated={(map) => 
          console.log("Leaflet map created:", map) // ✅ Add this
          (mapInstance.current = map)} // bind map ref on creation
        className="fullscreen-map z-0"
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; OpenStreetMap contributors'
        />
        <WaypointManager
          waypoints={waypoints}
          setWaypoints={setWaypoints}
          unitSystem={unitSystem}
          terrainProvider={terrainProvider}
        />
        <Marker position={dronePosition} icon={droneIcon}>
          <Popup>Drone</Popup>
        </Marker>
      </MapContainer>
    </div>
  );
});

export default MapComponent;
