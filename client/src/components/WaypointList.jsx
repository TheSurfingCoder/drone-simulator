export default function WaypointList({ waypoints, setWaypoints }) {
    const handleDelete = (indexToDelete) => {
      setWaypoints((prev) => prev.filter((_, i) => i !== indexToDelete));
    };
  
    return (
      <div
        style={{
          position: 'absolute',
          top: '12px',
          right: '12px',
          backgroundColor: 'white',
          padding: '10px',
          borderRadius: '6px',
          boxShadow: '0 2px 6px rgba(0,0,0,0.2)',
          maxHeight: '80vh',
          overflowY: 'auto',
          zIndex: 1000,
          fontSize: '14px',
        }}
      >
        <h4>Waypoints</h4>
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {waypoints.map((wp, i) => (
            <li key={i} style={{ marginBottom: '6px' }}>
              #{i + 1}: {wp.lat.toFixed(2)}, {wp.lng.toFixed(2)}
              <button
                onClick={() => handleDelete(i)}
                style={{
                  marginLeft: '8px',
                  backgroundColor: '#e74c3c',
                  color: 'white',
                  border: 'none',
                  borderRadius: '3px',
                  padding: '2px 6px',
                  cursor: 'pointer',
                }}
              >
                🗑
              </button>
            </li>
          ))}
        </ul>
      </div>
    );
  }
  