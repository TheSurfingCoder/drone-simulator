import { useRef, forwardRef, useImperativeHandle, useEffect } from 'react';
import { Viewer } from 'resium';
import {
  Cartesian3,
  Cartographic,
  sampleTerrainMostDetailed,
  Math as CesiumMath,
  Ion,
} from '@cesium/engine';
import WaypointBillboardOverlay from './WaypointBillboardOverlay';
import useCesiumInit from '../hooks/useCesiumInit';
import FlatWaypointDisc from './FlatWaypointDisc';

Ion.defaultAccessToken = import.meta.env.VITE_CESIUM_TOKEN;

const CesiumMap = forwardRef(({ waypoints, setWaypoints}, ref) => {
  const viewerRef = useRef(null);
  console.log("initial viewRef.current: ", viewerRef.current)
  const { viewer, terrainProvider } = useCesiumInit(viewerRef);


  useEffect(() => {
    const interval = setInterval(()=> {
      console.log("viewRef.current in cesiumMap", viewerRef.current);
      if(viewerRef.current?.cesiumElement){
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
          <div key={i}>
            <FlatWaypointDisc waypoints={waypoints} />
            <WaypointBillboardOverlay waypoints={waypoints} />
          </div>
        ))}
      </Viewer>
    </div>
  );
});

export default CesiumMap;
