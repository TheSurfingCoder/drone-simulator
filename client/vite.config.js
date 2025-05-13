import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import cesium from 'vite-plugin-cesium';
import { viteStaticCopy } from 'vite-plugin-static-copy';

export default defineConfig({
  plugins: [
    react(),
    cesium(),
    viteStaticCopy({
      targets: [
        {
          src: 'node_modules/@cesium/engine/Source/Assets',
          dest: 'cesium',
        },
        {
          src: 'node_modules/@cesium/engine/Source/Workers',
          dest: 'cesium',
        },
        {
          src: 'node_modules/@cesium/engine/Source/ThirdParty',
          dest: 'cesium',
        },
        {
          src: 'node_modules/@cesium/engine/Source/Shaders',
          dest: 'cesium',
        },
      ],
    }),
  ],
  define: {
    CESIUM_BASE_URL: JSON.stringify('/cesium'),
  },
});
