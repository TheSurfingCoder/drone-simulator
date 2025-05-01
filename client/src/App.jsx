import { useState } from 'react'
import './components/Map.jsx'
import MapComponent from './components/Map.jsx'
import 'leaflet/dist/leaflet.css';

function App() {
  console.log("hello form app.jsx")
  return (
    <>
      <MapComponent />
    </>
  )
}

export default App
