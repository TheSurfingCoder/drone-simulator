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
        <div style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>

            <div style={{ flex: 1 }}>
                <Viewer
                    full
                    ref={viewerRef}
                    terrainProvider={terrainProvider}
                    onClick={handleClick}
                    sceneModePicker={false}
                    timeline={false}
                    animation={false}
                    view={null}
                >
                    {waypoints.map((wp, i) => {
                        return (
                            <CesiumWaypointEntity key={i} wp={wp} unitSystem={unitSystem} index={i} />
                        )
                    })}
                </Viewer>
                <div style={{
                    position: 'absolute',
                    top: '12px',
                    left: '12px',
                    backgroundColor: 'white',
                    padding: '6px 10px',
                    borderRadius: '4px',
                    boxShadow: '0 1px 6px rgba(0, 0, 0, 0.2)',
                    zIndex: 999
                }}>
                    <UnitToggle unitSystem={unitSystem} onChange={setUnitSystem} />
                </div>
                <WaypointList waypoints={waypoints} setWaypoints={setWaypoints} />


            </div>
        </div>
    );
}
