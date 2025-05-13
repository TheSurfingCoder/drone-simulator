import { useRef, forwardRef, useImperativeHandle, useEffect, useState } from 'react';
import { Viewer, Cesium3DTileset } from 'resium';
import {
  Cartesian3,
  Cartographic,
  sampleTerrainMostDetailed,
  Math as CesiumMath,
  Ion,
  IonResource
} from '@cesium/engine';
import WaypointBillboardOverlay from './WaypointBillboardOverlay';
import useCesiumInit from '../hooks/useCesiumInit';
import Layers from './Layers';

Ion.defaultAccessToken = import.meta.env.VITE_CESIUM_TOKEN;

const CesiumMap = forwardRef(({ waypoints, setWaypoints }, ref) => {
  const viewerRef = useRef(null);
  console.log("initial viewRef.current: ", viewerRef.current)
  const { viewer, terrainProvider } = useCesiumInit(viewerRef);
  const [showOSM, setShowOSM] = useState(true);
  const [showGoogle, setShowGoogle] = useState(true);


  useEffect(() => {
    const interval = setInterval(() => {
      console.log("viewRef.current in cesiumMap", viewerRef.current);
      if (viewerRef.current?.cesiumElement) {
        console.log("✅  Cesium viewer is available on CesiumMap", viewerRef.current.cesiumElement)
        clearInterval(interval)
      }
    }, 200)
  }, [])

  // 📡 Expose the underlying Cesium Viewer instance to the parent
  useImperativeHandle(ref, () => ({
    get cesiumElement() {
      return viewerRef.current?.cesiumElement;
    }
  }));

  const handleToggle = (layer) => {
    if (layer === 'osm') setShowOSM((prev) => !prev)
    if (layer === 'google') setShowGoogle((prev) => !prev)
  }

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

    setWaypoints((prev) => [...prev, { lat, lng, alt, groundAlt: alt }]);
  };

  if (!terrainProvider) return <div>Loading terrain...</div>;

  return (
    <div className="relative w-full h-full z-0">
      <Layers
        showOSM={showOSM}
        showGoogle={showGoogle}
        onToggle={handleToggle}
      />
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
      >{showOSM && (
        <Cesium3DTileset url={IonResource.fromAssetId(96188)} 
        onError={e => { console.error("OSM Tileset error", e); }}
        onReady={e => {console.log("Tileset loaded!", e)}}
        />

      )}
        {showGoogle && (<Cesium3DTileset
          url={IonResource.fromAssetId(2275207)} 
          onError={e => { console.error("OSM Tileset error", e); }}
          onReady={e => {console.log("Tileset loaded!", e)}}
        />)}
        {waypoints.map((wp, i) => (
          <div key={i}>
            <WaypointBillboardOverlay waypoints={waypoints} />
          </div>
        ))}
      </Viewer>
    </div>
  );
});

export default CesiumMap;

