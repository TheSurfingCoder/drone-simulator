// drone component with logic from droneMovement.js
//drone component is receiving props from map
import { moveToward } from "../utils/droneMovement";

export default function DroneController({ waypoints, setDronePosition }) {
    function handleStartMission() {
        console.log("Starting mission...");
        console.log("Waypoints:", waypoints);

        if (waypoints.length === 0) return; //this will ensure nothing happens if we click start and the waypoints array is empty

        let currentIndex = 0;
        let currentTarget = [waypoints[0].lat, waypoints[0].lng]

        const interval = setInterval(() => {
            setDronePosition(prev => {
                const nextPos = moveToward(prev, currentTarget)

                // Check if drone has arrived at the current target
                if (nextPos[0] === currentTarget[0] &&
                    nextPos[1] === currentTarget[1]
                ) {
                    currentIndex++;

                    if (currentIndex >= waypoints.length) {
                        clearInterval(interval);
                        console.log("Mission complete")
                        return nextPos;
                    }

                    currentTarget = [waypoints[currentIndex].lat, waypoints[currentIndex].lng];
                }
                return nextPos;

            })
        }, 30)

    }
/*
    1. checks waypoints length. if it's 0 then return and do nothing
    2. setDroneposition is actually changing the drone's positon and it's running every 30 milliseconds
    3. so every 30 milliseconds we're reutrning an array from nextPos which is setting the drone position and moving it
*/


    return (
        <div style={{ position: 'absolute', top: 20, left: 200, zIndex: 1000 }}>
            <button onClick={handleStartMission}>
                Start Mission
            </button>
        </div>
    );

}