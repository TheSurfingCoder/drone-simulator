import AltitudeSlider from './AltitudeSlider'; // adjust path if needed


export default function WaypointList({ waypoints, setWaypoints, unitSystem }) {
  const handleDelete = (indexToDelete) => {
    setWaypoints((prev) => prev.filter((_, i) => i !== indexToDelete));
  };

  const formatAlt = (alt) => {
    const altVal = alt ?? 0;
    return unitSystem === 'metric'
      ? `${altVal.toFixed(1)} m`
      : `${(altVal * 3.28084).toFixed(1)} ft`;
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
          <li key={i} style={{ marginBottom: '12px' }}>
            <strong>#{i + 1}</strong>
            <div>Lat: {wp.lat.toFixed(4)}</div>
            <div>Lng: {wp.lng.toFixed(4)}</div>
            <div>Alt: {formatAlt(wp.alt)}</div>

            <AltitudeSlider
              value={wp.alt ?? 0}
              minAltitude={wp.groundAlt ?? 0}
              unitSystem={unitSystem}
              onChange={(newAlt) => {
                setWaypoints((prev) =>
                  prev.map((w, idx) =>
                    idx === i ? { ...w, alt: newAlt } : w
                  )
                );
              }}
            />


            <button
              onClick={() => handleDelete(i)}
              style={{
                marginTop: '6px',
                backgroundColor: '#e74c3c',
                color: 'white',
                border: 'none',
                borderRadius: '3px',
                padding: '2px 6px',
                cursor: 'pointer',
              }}
            >
              🗑 Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
