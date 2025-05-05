import { useRef, useState, useEffect } from 'react';
import { Viewer, Entity } from 'resium';
import {
    Cartesian3,
    Cartographic,
    sampleTerrainMostDetailed,
    CesiumTerrainProvider,
    Color,
    Math as CesiumMath,
    DistanceDisplayCondition
} from 'cesium';

export default function CesiumMap() {
    const viewerRef = useRef();
    const [terrainProvider, setTerrainProvider] = useState(null);
    const [waypoints, setWaypoints] = useState([]);

    // Load terrain once on mount
    useEffect(() => {
        CesiumTerrainProvider.fromIonAssetId(1).then(setTerrainProvider);
    }, []);

    const handleClick = async (movement) => {
        const viewer = viewerRef.current?.cesiumElement;
        if (!viewer || !terrainProvider) return;

        const scene = viewer.scene;
        const camera = scene.camera;

        // Proper Cesium way of getting click position
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


    if (!terrainProvider) return <div>Loading terrain...</div>;

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
                            disableDepthTestDistance: Number.POSITIVE_INFINITY, // always draw on top
                        }}
                        label={{
                            text: `${wp.alt.toFixed(1)}m`,
                            font: "bold 16px sans-serif",
                            fillColor: Color.WHITE,
                            outlineColor: Color.BLACK,
                            outlineWidth: 4,
                            showBackground: true,
                            backgroundColor: Color.BLACK.withAlpha(0.6),
                            verticalOrigin: 1, // ABOVE
                            pixelOffset: new Cartesian3(0, -35, 0),
                            scale: 1.2,
                            distanceDisplayCondition: new DistanceDisplayCondition(0.0, 10000.0), // hide far away
                            disableDepthTestDistance: Number.POSITIVE_INFINITY,
                        }}
                        description={`Lat: ${wp.lat.toFixed(5)}, Lng: ${wp.lng.toFixed(5)}, Alt: ${wp.alt.toFixed(2)}m`}
                    />
                ))}
            </Viewer>

        </div>
    );
}
