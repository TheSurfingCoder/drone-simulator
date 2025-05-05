import { useState } from 'react';
import MapComponent from './Map.jsx';         // your Leaflet map
import CesiumMap from './CesiumMap'; // your 3D globe
import 'leaflet/dist/leaflet.css';

export default function MissionPlannerWrapper() {
  const [viewMode, setViewMode] = useState("2d");
    console.log(viewMode);


  return (
    <div>
      <div style={{ position: 'absolute', top: 100, right: 10, zIndex: 2000 }}>
        <button onClick={() => setViewMode("2d")}>2D View</button>
        <button onClick={() => setViewMode("3d")}>3D View</button>
      </div>

      {viewMode === "2d" ? <MapComponent /> : <CesiumMap />}
    </div>
  );
}
