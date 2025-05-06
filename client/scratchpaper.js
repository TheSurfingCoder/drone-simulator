return (
    <div className="h-screen w-screen flex flex-col">
      {/* Top Bar */}
      <div className="w-full bg-white shadow-md px-4 py-2 flex justify-between items-center z-50">
        <div className="flex items-center gap-3">
          <UnitToggle unitSystem={unitSystem} onChange={setUnitSystem} />
          <button className="bg-green-600 text-white px-3 py-1 rounded" onClick={handleStartMission}>
            Start Mission
          </button>
          <button className="bg-gray-300 text-black px-3 py-1 rounded" onClick={handleClearWaypoints}>
            Clear Waypoints
          </button>
        </div>
        <div>
          <button
            className="bg-blue-600 text-white px-3 py-1 rounded"
            onClick={() => setViewMode(viewMode === "2d" ? "3d" : "2d")}
          >
            Switch to {viewMode === "2d" ? "3D" : "2D"}
          </button>
        </div>
      </div>
  
      {/* Map View */}
      <div className="flex-1 relative">
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
    </div>
  );
  

   <div className="h-screen w-screen flex flex-col">
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


{/* 🧱 Floating Panels */}
<div className="absolute bottom-4 left-4 z-10">
<DroneController
  onStartMission={handleStartMission}
  onClearWaypoints={handleClearWaypoints}
/>
</div>

<div className="absolute bottom-4 right-4 z-10 w-80">
<LogPanel />
</div>

<div className="absolute top-[4.5rem] right-4 z-10 w-80">
<WaypointList waypoints={waypoints} />
</div>

<div className="absolute top-[4.5rem] left-4 z-10 w-72">
<MetricsPanel waypoints={waypoints} unitSystem={unitSystem} />
</div>