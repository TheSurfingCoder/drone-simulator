//click handling + waypoint storage

import { useState } from 'react';
import { Marker, Popup, useMapEvents } from 'react-leaflet';
import './WaypointMarker.jsx'
import WaypointMarker from './WaypointMarker.jsx';

export default function WaypointManager() {

    const[waypoints, setWaypoints] = useState([]);

    useMapEvents({
        click(e) {
          const { lat, lng } = e.latlng;
          setWaypoints((prev) => [...prev, { lat, lng }]);
        },
      });
      console.log(waypoints);
      return(
        <>
            {
                waypoints.map((point, index)=>{
                    return(
                    <WaypointMarker
                        key={index}
                        lat={point.lat}
                        lng={point.lng}
                        index={index}
                    />
                    )
                })
            }
        </>
      )
}