import { useState } from 'react'
import './components/Map.jsx'
import MapComponent from './components/Map.jsx'
import 'leaflet/dist/leaflet.css';
import MissionPlannerWrapper from './components/MissionPlannerWrapper.jsx';

function App() {
  console.log("hello form app.jsx")
  return (
    <>
      <MissionPlannerWrapper />

    </>
  )
}

export default App
