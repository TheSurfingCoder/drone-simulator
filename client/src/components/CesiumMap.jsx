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


Ion.defaultAccessToken = import.meta.env.VITE_CESIUM_TOKEN;

export default function CesiumMap() {
    const viewerRef = useRef();
    const [terrainProvider, setTerrainProvider] = useState(null);
    const [waypoints, setWaypoints] = useState([]);
    const viewer = viewerRef.current?.cesiumElement;



    useEffect(() => {
        const loadTerrain = async () => {
            try {
                if (!import.meta.env.VITE_CESIUM_TOKEN) {
                    console.error("❌ Cesium Ion token not found in env vars");
                    return;
                } else if(import.meta.env.VITE_CESIUM_TOKEN){
                    console.log("Ion token is valid")
                }

                const terrain = await CesiumTerrainProvider.fromIonAssetId(1);
                await terrain.readyPromise;

                console.log("✅ Terrain is ready");
                console.log("Terrain provider:", terrain);

                setTerrainProvider(terrain);
            } catch (err) {
                console.error("❌ Failed to load Cesium terrain:", err);
            }
        };

        loadTerrain();
    }, []);



    // ✅ Set default camera angle
  // ✅ Consolidated into a single useEffect
useEffect(() => {
    const init = async () => {
        if (!viewerRef.current) return;

        if (!import.meta.env.VITE_CESIUM_TOKEN) {
            console.error("❌ Cesium Ion token not found in env vars");
            return;
        }

        try {
            const terrain = await CesiumTerrainProvider.fromIonAssetId(1);
            await terrain.readyPromise;

            const viewer = viewerRef.current.cesiumElement;
            if (!viewer) return;

            console.log("✅ Terrain is ready. Setting terrain + default camera.");

            setTerrainProvider(terrain);

            // ✅ Set default camera after everything is ready
            viewer.camera.setView({
                destination: Cartesian3.fromDegrees(
                    -122.44547431638014,
                    37.611176246617994,
                    17363.451336429982
                ),
                orientation: {
                    heading: CesiumMath.toRadians(0.0),
                    pitch: CesiumMath.toRadians(-45.0),
                    roll: 0.0,
                },
            });
        } catch (err) {
            console.error("❌ Failed to load terrain or set camera:", err);
        }
    };

    init();
}, []);



    const handleClick = async (movement) => {
        const viewer = viewerRef.current?.cesiumElement;
        if (!viewer || !terrainProvider) return;

        const scene = viewer.scene;
        const camera = scene.camera;

        const ray = camera.getPickRay(movement.position);
        const ellipsoidPosition = scene.globe.pick(ray, scene);
        if (!ellipsoidPosition) return;

        const cartographic = Cartographic.fromCartesian(ellipsoidPosition);
        const updated = await sampleTerrainMostDetailed(terrainProvider, [cartographic]);
        const result = updated[0];

        const lat = CesiumMath.toDegrees(result.latitude);
        const lng = CesiumMath.toDegrees(result.longitude);
        const alt = result.height;

        const newWaypoint = { lat, lng, alt };
        setWaypoints((prev) => [...prev, newWaypoint]);
    };
    console.log("Terrain state:", terrainProvider);
    console.log("Is ready:", terrainProvider?.ready);

    if (!terrainProvider) return <div>Loading terrain...</div>;

    console.log("Rendering CesiumMap component...");
    
    return (
        <div style={{ height: '100vh' }}>
            <Viewer
                full
                ref={viewerRef}
                terrainProvider={terrainProvider}
                onClick={handleClick}
            >
                {waypoints.map((wp, i) => (
                    <Entity
                        key={i}
                        name={`Waypoint ${i + 1}`}
                        position={Cartesian3.fromDegrees(wp.lng, wp.lat, wp.alt)}
                        point={{
                            pixelSize: 14,
                            color: Color.RED.withAlpha(0.95),
                            outlineColor: Color.WHITE,
                            outlineWidth: 2,
                            disableDepthTestDistance: Number.POSITIVE_INFINITY,
                        }}
                        label={{
                            text: `${wp.alt.toFixed(1)}m`,
                            font: 'bold 16px sans-serif',
                            fillColor: Color.WHITE,
                            outlineColor: Color.BLACK,
                            outlineWidth: 4,
                            showBackground: true,
                            backgroundColor: Color.BLACK.withAlpha(0.6),
                            verticalOrigin: 1,
                            pixelOffset: new Cartesian3(0, -35, 0),
                            scale: 1.2,
                            distanceDisplayCondition: new DistanceDisplayCondition(0.0, 10000.0),
                            disableDepthTestDistance: Number.POSITIVE_INFINITY,
                        }}
                        description={`Lat: ${wp.lat.toFixed(5)}, Lng: ${wp.lng.toFixed(5)}, Alt: ${wp.alt.toFixed(2)}m`}
                    />
                ))}
            </Viewer>
        </div>
    );
}
