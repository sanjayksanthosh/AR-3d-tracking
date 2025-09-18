import React from 'react';
import './App.css';

function App() {
  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      
      {/* UI Overlay with instructions */}
      <div style={{
        position: 'absolute',
        top: '1rem',
        left: '1rem',
        zIndex: 10,
        padding: '1rem',
        margin: '1rem',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        borderRadius: '0.5rem',
        color: 'white',
        boxShadow: '0 2px 10px rgba(0,0,0,0.2)'
      }}>
        <h1 style={{ fontSize: '1.125rem', fontWeight: 'bold' }}>React AR Hiro Tracker</h1>
        <p style={{ marginTop: '0.5rem' }}>Point your camera at the Hiro marker to see the 3D Pizza 🍕</p>
        <a 
          href="https://raw.githubusercontent.com/AR-js-org/AR.js/master/data/images/HIRO.jpg" 
          target="_blank" 
          rel="noopener noreferrer"
          style={{
            display: 'inline-block',
            marginTop: '0.5rem',
            padding: '0.25rem 0.75rem',
            fontSize: '0.875rem',
            backgroundColor: '#3B82F6',
            borderRadius: '0.375rem',
            textDecoration: 'none',
            color: 'white'
          }}
        >
          Show Hiro Marker
        </a>
      </div>

      {/* A-Frame AR Scene */}
      <a-scene
        embedded
        arjs="sourceType: webcam; debugUIEnabled: false;"
        vr-mode-ui="enabled: false"
      >
        {/* Hiro marker */}
        <a-marker preset="hiro">
          {/* Pizza model */}
          <a-entity
            gltf-model="url(/models/pizza.glb)" 
            scale="5 5 5" 
            position="0 0 0"
            rotation="0 180 0"
          ></a-entity>
        </a-marker>

        {/* Camera */}
        <a-entity camera></a-entity>
      </a-scene>
    </div>
  );
}

export default App;
