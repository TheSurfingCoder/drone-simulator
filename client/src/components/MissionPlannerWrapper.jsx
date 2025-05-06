import { useState } from 'react';
import MapComponent from './Map.jsx';
import CesiumMap from './CesiumMap';
import 'leaflet/dist/leaflet.css';

export default function MissionPlannerWrapper() {
  const [viewMode, setViewMode] = useState("2d");

  // ✅ Shared state (lifted)
  const [waypoints, setWaypoints] = useState([]);
  const [unitSystem, setUnitSystem] = useState("metric");

  console.log("🔁 Rendering view:", viewMode);
console.log("📌 Waypoints count:", waypoints.length);



  return (
    <div>
      <div style={{ position: 'absolute', top: 100, right: 10, zIndex: 2000 }}>
        <button onClick={() => setViewMode("2d")}>2D View</button>
        <button onClick={() => setViewMode("3d")}>3D View</button>
      </div>

      {viewMode === "2d" ? (
        <MapComponent
          waypoints={waypoints}
          setWaypoints={setWaypoints}
          unitSystem={unitSystem}
          setUnitSystem={setUnitSystem}
        />
      ) : (
        <CesiumMap
          waypoints={waypoints}
          setWaypoints={setWaypoints}
          unitSystem={unitSystem}
          setUnitSystem={setUnitSystem}
        />
      )}
    </div>
  );
}
