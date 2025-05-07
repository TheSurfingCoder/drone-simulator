import { useState, useRef } from 'react';
import MapComponent from './Map';
import CesiumMap from './CesiumMap';
import UnitToggle from './UnitToggle';
import DroneController from './DroneController';
import LogPanel from './LogPanel';
import WaypointList from './WaypointList';
import MetricsPanel from './MetricsPanel';
import CurrentLocationButton from './currentLocationButton';
import { Cartesian3 } from '@cesium/engine';

export default function MissionPlannerWrapper() {
  const [viewMode, setViewMode] = useState('2d');
  const [waypoints, setWaypoints] = useState([]);
  const [unitSystem, setUnitSystem] = useState('metric');
  const [dronePosition, setDronePosition] = useState([37.7749, -122.4194]); // SF default
  const [logs, setLogs] = useState([]);
  const mapRef = useRef(null);
  const viewerRef = useRef(null);


  const handleLocateMe = (lat, lng) => {
    console.log(`📍 Handling locate for ${viewMode.toUpperCase()}:`, lat, lng);

    if (viewMode === '2d') {
      const map = mapRef.current;
      let retries = 0;

      const attemptToMove2D = () => {
        const size = map?.getSize?.();
        if (!size || size.x === 0 || size.y === 0) {
          if (retries++ < 10) {
            setTimeout(attemptToMove2D, 100);
          } else {
            console.warn("2D map never became ready.");
          }
          return;
        }
        map.setView([lat, lng], 15);
        map.invalidateSize();
      };

      if (map) {
        attemptToMove2D();
      } else {
        console.warn("2D map not ready yet.");
      }
    }

    if (viewMode === '3d') {
      const viewer = viewerRef.current?.cesiumElement;
      if (viewer) {
        viewer.camera.flyTo({
          destination: Cartesian3.fromDegrees(lng, lat, 1500),
        });
      } else {
        console.warn("3D viewer not ready.");
      }
    }
  };


  const clearWaypoints = () => {
    setWaypoints([]);
  };

  const clearLogs = () => {
    setLogs([]);
  };




  return (
    <div className="h-screen w-screen relative">
      {/* 🧭 Top Bar */}
      <div className="absolute top-0 left-0 w-full h-14 bg-white shadow-md px-4 py-2 flex justify-between items-center z-[999]">
        <div className="flex items-center gap-3">
          <UnitToggle unitSystem={unitSystem} onChange={setUnitSystem} />
          <DroneController
            className="bg-green-600 text-white px-3 py-1 rounded"
            waypoints={waypoints}
            setDronePosition={setDronePosition}
            dronePosition={dronePosition}
            logs={logs}
            setLogs={setLogs}
            handleClearWaypoints={clearWaypoints}
          />
          <CurrentLocationButton onLocate={handleLocateMe} />
        </div>
        <div>
          <button
            className="bg-blue-600 text-white px-3 py-1 rounded"
            onClick={() => setViewMode(viewMode === '2d' ? '3d' : '2d')}
          >
            Switch to {viewMode === '2d' ? '3D' : '2D'}
          </button>
        </div>
      </div>

      {/* 🗺 Map View (with top bar padding) */}
      <div className="h-full w-full pt-14">
        {viewMode === '2d' ? (
          <MapComponent
            waypoints={waypoints}
            setWaypoints={setWaypoints}
            unitSystem={unitSystem}
            setUnitSystem={setUnitSystem}
            dronePosition={dronePosition}
            ref={mapRef}
          />
        ) : (
          <CesiumMap
            waypoints={waypoints}
            setWaypoints={setWaypoints}
            unitSystem={unitSystem}
            setUnitSystem={setUnitSystem}
            ref={viewerRef}
          />
        )}
      </div>

      {/* 📍 Floating Panels */}

      <div className="absolute bottom-4 right-4 z-30 w-80">
        <LogPanel logs={logs} clearLogs={clearLogs} />
      </div>

      <div className="absolute top-[4.5rem] right-4 z-30 w-80">
        <WaypointList waypoints={waypoints} setWaypoints={setWaypoints} unitSystem={unitSystem} />
      </div>

      <div className="absolute top-[4.5rem] left-4 z-30 w-72">
        <MetricsPanel waypoints={waypoints} setWaypoints={setWaypoints} setLogs={setLogs} />
      </div>
    </div>
  );
}
