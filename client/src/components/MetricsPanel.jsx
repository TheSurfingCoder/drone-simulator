import { calculateDistance, estimateDuration } from '../utils/distanceUtils'
import { downloadGeoJSON } from '../utils/exportUtils';

export default function MetricsPanel({ waypoints }) {

    const distanceKm = calculateDistance(waypoints);
    const durationSec = estimateDuration(distanceKm);


    return (
        <div style={{
            position: 'absolute',
            top: 20,
            right: 20,
            background: 'white',
            padding: '10px',
            borderRadius: '8px',
            fontSize: '0.85rem',
            fontFamily: 'monospace',
            zIndex: 1000
        }}>
            <p>📏 Distance: {distanceKm.toFixed(2)} km</p>
            <p>⏱️ Duration: {(durationSec / 60).toFixed(1)} min</p>
            <button
                onClick={() => downloadGeoJSON(waypoints)}
                style={{
                    marginTop: '0.5em',
                    padding: '6px 10px',
                    fontSize: '0.8rem',
                    cursor: 'pointer',
                    borderRadius: '6px',
                    backgroundColor: '#e0e0e0',
                    border: 'none'
                }}
            >
                📁 Download Flight Plan (.geojson)
            </button>
        </div>
    )
}


