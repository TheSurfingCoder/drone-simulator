import { useRef, useState, useEffect } from 'react';
import { Viewer, Entity } from 'resium';
import {
    Cartesian3,
    Cartographic,
    sampleTerrainMostDetailed,
    Color,
    Math as CesiumMath,
    DistanceDisplayCondition,
    CesiumTerrainProvider,
    Ion
} from '@cesium/engine';
import UnitToggle from './UnitToggle';
import CesiumWaypointEntity from './CesiumWaypointEntity';
import useCesiumInit from '../hooks/useCesiumInit';
import WaypointList from './WaypointList';




Ion.defaultAccessToken = import.meta.env.VITE_CESIUM_TOKEN;

export default function CesiumMap({ waypoints, setWaypoints, unitSystem, setUnitSystem }) {
    const viewerRef = useRef();
    const { viewer, terrainProvider } = useCesiumInit(viewerRef);
    

    // ✅ Handle clicks for waypoints
    const handleClick = async (movement) => {
        if (!viewer || !terrainProvider) return;

        const ray = viewer.scene.camera.getPickRay(movement.position);
        const ellipsoidPosition = viewer.scene.globe.pick(ray, viewer.scene);
        if (!ellipsoidPosition) return;

        const cartographic = Cartographic.fromCartesian(ellipsoidPosition);
        const updated = await sampleTerrainMostDetailed(terrainProvider, [cartographic]);
        const result = updated[0];

        const lat = CesiumMath.toDegrees(result.latitude);
        const lng = CesiumMath.toDegrees(result.longitude);
        const alt = result.height;

        setWaypoints((prev) => [...prev, { lat, lng, alt }]);
    };

    if (!terrainProvider) return <div>Loading terrain...</div>;

    return (
        <div className="relative w-full h-full z-0">
          <Viewer
            full
            ref={viewerRef}
            terrainProvider={terrainProvider}
            onClick={handleClick}
           className="z-0"
            sceneModePicker={false}
            timeline={false}
            animation={false}
            view={null}
          >
            {waypoints.map((wp, i) => (
              <CesiumWaypointEntity key={i} wp={wp} unitSystem={unitSystem} index={i} />
            ))}
          </Viewer>
        </div>
      );
      
}
