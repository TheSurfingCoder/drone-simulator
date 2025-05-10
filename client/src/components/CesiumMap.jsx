import { useRef, forwardRef, useImperativeHandle, useEffect, use } from 'react';
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


const supportsVertexTextureFetch = () => {
  try{
    const canvas = document.createElement('canvas');
    const gl = 
      canvas.getContext('webGL') || canvas.getContext('experimental-webGL');

      if(!gl) return false

      const maxVertexTextureImageUnits = gl.getParameter(
        gl.MAX_VERTEX_TEXTURE_IMAGE_UNITS
      );

      return maxVertexTextureImageUnits > 0
  } catch(e){
    return false;
  }
}


const CesiumMap = forwardRef(({ waypoints, setWaypoints}, ref) => {
  const viewerRef = useRef(null);
  const { viewer, terrainProvider } = useCesiumInit(viewerRef);


  console.log('log from line 41 of cesiummap.jsx. We know that cesiummap component has started to render')
  useEffect(()=>{
    console.log('useEffect() from line 43 of cesiummap. we know that cesiummap has been attached to Dom')
  })
  
  useEffect(() => {
    const interval = setInterval(()=> {
      console.log("viewRef.current in cesiumMap", viewerRef.current);
      if(viewerRef.current?.cesiumElement){
        console.log("✅  Cesium viewer is available on CesiumMap", viewerRef.current.cesiumElement)
        console.log("the terrain provider is", terrainProvider)
        clearInterval(interval)
      } else {
        console.log("useEffect from cesiummap.jsx. viewerRef has not been filled yet. line 49 in cesiumMap.jsx.")
      }
      
    }, 200)
  }, [])

  useEffect(()=>{
    if(!supportsVertexTextureFetch()){
      console.warn("🚫 Vertex texture fetch not supported.");
      alert("3D rendering may not work correctly on this device")
    }
  }, [])

  useEffect(() => {
    let retries = 0;
    const maxRetries = 20;
  
    const interval = setInterval(() => {
      const viewer = viewerRef.current?.cesiumElement;
      const scene = viewer?.scene;
      const glLimits = scene?.context?.limits;
  
      if (!scene || !glLimits) {
        if (++retries > maxRetries) {
          console.warn("Timed out waiting for scene/context to become ready");
          clearInterval(interval);
        }
        return;
      }
  
      const vtfSupported = glLimits.maximumVertexTextureImageUnits > 0;
      console.log("✅ Scene ready. VTF supported?", vtfSupported);
  
      if (!vtfSupported) {
        alert("Your device doesn't support features needed for 3D rendering.");
        // optionally trigger fallback rendering
      }
  
      clearInterval(interval); // clean up once we're done
    }, 200);
  
    return () => clearInterval(interval); // safety cleanup
  }, []);
  



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




  if (!terrainProvider){
    console.log("Terrain is not available. Check useCesiumInit() I'm printing from Cesiummap.jsx")
    return <div>Loading terrain...</div>;
  } 

 
 
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
