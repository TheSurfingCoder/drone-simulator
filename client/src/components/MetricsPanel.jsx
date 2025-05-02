import { calculateDistance, estimateDuration } from '../utils/distanceUtils'

export default function MetricsPanel({waypoints}){

    const distanceKm = calculateDistance(waypoints);
    const durationSec = estimateDuration(distanceKm);


    return(
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
          </div>
    )
}


