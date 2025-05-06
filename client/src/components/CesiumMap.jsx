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

Ion.defaultAccessToken = import.meta.env.VITE_CESIUM_TOKEN;

export default function CesiumMap() {
    const viewerRef = useRef();
    const [viewer, setViewer] = useState(null);
    const [terrainProvider, setTerrainProvider] = useState(null);
    const [waypoints, setWaypoints] = useState([]);
    const [unitSystem, setUnitSystem] = useState('metric');


    // ✅ Load Cesium terrain once
    useEffect(() => {
        const loadTerrain = async () => {
            try {
                if (!Ion.defaultAccessToken) {
                    console.error("❌ Cesium Ion token not found.");
                    return;
                }

                const terrain = await CesiumTerrainProvider.fromIonAssetId(1);
                await terrain.readyPromise;

                console.log("✅ Terrain loaded");
                setTerrainProvider(terrain);
            } catch (err) {
                console.error("❌ Terrain loading failed:", err);
            }
        };

        loadTerrain();
    }, []);

    // ✅ Set default camera view once both viewer + terrain are ready
    useEffect(() => {
        const setCameraView = async () => {
            if (!viewer || !terrainProvider) {
                console.log("⏳ Waiting on viewer or terrain...");
                return;
            }

            await terrainProvider.readyPromise;
            console.log("📍 Setting default camera view...");

            viewer.scene.camera.setView({
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

            viewer.scene.camera.defaultViewFactor = 0;
            viewer.scene.camera.defaultViewRectangle = undefined;
        };

        setCameraView();
    }, [viewer, terrainProvider]);

    // ✅ Fallback if onReady doesn’t fire
    useEffect(() => {
        const tryAttachViewer = () => {
            if (!viewer && viewerRef.current?.cesiumElement) {
                console.log("🛠 Manually attaching viewer");
                setViewer(viewerRef.current.cesiumElement);
            }
        };

        const interval = setInterval(tryAttachViewer, 200);
        return () => clearInterval(interval);
    }, [viewer]);

    // ✅ Optional viewer init hook (may not always fire reliably)
    const handleViewerReady = (cesiumViewer) => {
        console.log("🚀 onReady fired — viewer:", cesiumViewer);
        setViewer(cesiumViewer);
    };

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
                    onReady={handleViewerReady}
                    sceneModePicker={false}
                    timeline={false}
                    animation={false}
                    view={null}
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
                                text:
                                    unitSystem === 'metric'
                                        ? `${wp.alt.toFixed(1)} m`
                                        : `${(wp.alt * 3.28084).toFixed(1)} ft`,
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
                            description={`Lat: ${wp.lat.toFixed(5)}, Lng: ${wp.lng.toFixed(5)}, Alt: ${unitSystem === 'metric'
                                    ? `${wp.alt.toFixed(2)}m`
                                    : `${(wp.alt * 3.28084).toFixed(2)}ft`
                                }`}
                        />
                    ))}
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

            </div>
        </div>
    );
}
