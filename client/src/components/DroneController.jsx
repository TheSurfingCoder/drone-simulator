// src/components/DroneController.jsx

export default function DroneController({ waypoints, setDronePosition }) {
    function handleStartMission() {
      console.log("Starting mission...");
      console.log("Waypoints:", waypoints);
      // We'll add logic here next to simulate drone movement
    }
  
    return (
      <div style={{ position: 'absolute', top: 20, left: 20, zIndex: 1000 }}>
        <button onClick={handleStartMission}>
          Start Mission
        </button>
      </div>
    );
  }
  