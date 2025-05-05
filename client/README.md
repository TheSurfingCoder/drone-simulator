✅ Prioritized Roadmap (with notes)
🔹 Phase 1 – Core Usability + Launch Readiness
Deploy on Vercel
‣ Get it live so you can show, test, and iterate.

Set up a public repo + write a good README
‣ Include a short video/GIF demo, project purpose, stack, and usage instructions.

Set default terrain + camera angle
‣ Tilted, terrain-aware planning feels 10x better than top-down.

Get rid of Cesium logo + bottom credits
‣ Makes it feel polished and branded. Easy win.

Switch between metric and imperial units
‣ Essential for broader user appeal. Can be a dropdown or toggle.

set up API key rate limiting in Cesium account

Allow for current location

🔹 Phase 2 – Mission Planning System
Add MissionPlanner UI (Create / Import / Export buttons)
‣ This becomes your app’s core CTA. Clean and approachable.

Export flight plans (as GeoJSON or custom JSON)
‣ Critical for saving, sharing, or flying later.

Import mission support
‣ Rehydrate waypoints and view them instantly.

Change drone icon
‣ Improves visual identity and demo quality. Find or design a realistic top-down drone SVG.

🔹 Phase 3 – Advanced Interaction
Search by lat/lng or address to jump to location
‣ Improves utility for real pilots. Use a geocoding API like Mapbox or OpenCage.

Waypoint metadata UI (display lat/lng/alt at marker)
‣ Hover/click a point to see full info.

Support vertical altitude adjustments (drag handle or manual input)
‣ Big leap forward. Requires 3D interaction UI — not trivial, but awesome.

Clicking the air for altitude estimation
‣ Experimental UX. If Cesium can raycast to atmosphere or just use camera pitch + mouse, this could work. But may require a fallback.

Flatten buttons to look like UI on terrain (billboarding)
‣ Low priority polish. Cool, but can do after core features.