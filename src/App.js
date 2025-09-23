import React, { useState, useEffect } from 'react';
import 'aframe';
import 'ar.js';

// --- Helper Components ---

const ARView = ({ item, onClose }) => {
  const [selectedDeviceId, setSelectedDeviceId] = useState(null);
  const [error, setError] = useState(null);

  const tryCamera = async (deviceId, facingMode) => {
    try {
      const constraints = deviceId
        ? { video: { deviceId: { exact: deviceId } } }
        : { video: { facingMode: facingMode || "environment" } };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      const track = stream.getVideoTracks()[0];
      console.log("✅ Camera working:", track.label);
      setSelectedDeviceId(deviceId || track.getSettings().deviceId);
      setError(null);
      return true;
    } catch (err) {
      console.warn("❌ Camera failed:", deviceId, err.message);
      return false;
    }
  };

  useEffect(() => {
    const initCamera = async () => {
      try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        const videoInputs = devices.filter((d) => d.kind === "videoinput");

        if (videoInputs.length === 0) {
          setError("No cameras found.");
          return;
        }

        // Prefer environment-facing cameras (back cameras)
        const backCams = videoInputs.filter(
          (cam) =>
            cam.label.toLowerCase().includes("back") ||
            cam.label.toLowerCase().includes("rear") ||
            cam.label.toLowerCase().includes("environment")
        );

        let chosenCam = null;

        if (backCams.length > 0) {
          // 👉 pick the LAST back cam (usually not wide angle, but the main one)
          chosenCam = backCams[backCams.length - 1];
        } else {
          // fallback to last available camera
          chosenCam = videoInputs[videoInputs.length - 1];
        }

        console.log("🎯 Chosen Camera:", chosenCam.label);

        const success = await tryCamera(chosenCam.deviceId);
        if (!success) {
          // fallback: try environment
          await tryCamera(null, "environment");
        }
      } catch (err) {
        console.error("Camera init error:", err);
        setError("Camera initialization failed.");
      }
    };

    initCamera();
  }, []);

  if (error) {
    return (
      <div style={{
        position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
        display: 'flex', justifyContent: 'center', alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.8)', color: 'white', zIndex: 100,
        textAlign: 'center', padding: '1rem'
      }}>
        <p>{error}</p>
      </div>
    );
  }

  if (!selectedDeviceId) {
    return (
      <div style={{
        position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
        display: 'flex', justifyContent: 'center', alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.8)', color: 'white', zIndex: 100,
        textAlign: 'center', padding: '1rem'
      }}>
        <p>Initializing Camera...<br />Please grant permission.</p>
      </div>
    );
  }

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', zIndex: 100 }}>
      <a-scene
        key={selectedDeviceId}
        arjs={`sourceType: webcam; deviceId: ${selectedDeviceId}; debugUIEnabled: false;`}
        renderer="logarithmicDepthBuffer: true; precision: medium; antialias: true; physicallyCorrectLights: true;"
        vr-mode-ui="enabled: false"
        style={{ width: '100%', height: '100%' }}
      >
        {/* Lights */}
        <a-entity light="type: ambient; intensity: 0.7"></a-entity>
        <a-entity light="type: directional; intensity: 1; castShadow: true" position="1 2 2"></a-entity>
        <a-entity light="type: directional; intensity: 0.8" position="-2 2 1"></a-entity>

        {/* Marker + 3D Model */}
        <a-marker preset="hiro">
          <a-entity
            gltf-model={`url(${item.model})`}
            scale={item.scale}
            position={item.position}
            rotation={item.rotation}
          ></a-entity>
        </a-marker>

        {/* Camera */}
        <a-entity camera></a-entity>
      </a-scene>

      {/* Top bar */}
      <div style={{
        position: 'absolute', top: 0, left: 0, width: '100%',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        padding: '0.5rem 1rem', backgroundColor: 'rgba(0,0,0,0.6)', color: 'white',
        zIndex: 200, boxSizing: 'border-box'
      }}>
        <h3 style={{ margin: 0 }}>{item.name}</h3>
        <button
          onClick={onClose}
          style={{
            background: 'red', color: 'white', border: 'none',
            padding: '0.4rem 0.8rem', borderRadius: '5px', cursor: 'pointer'
          }}
        >
          Back
        </button>
      </div>
    </div>
  );
};

// --- Main Component ---

const App = () => {
  const [selectedItem, setSelectedItem] = useState(null);

  const items = [
    {
      id: 1,
      name: 'Pizza',
      image: '/images/pizza.png',
      model: '/models/pizza.glb',
      scale: '0.5 0.5 0.5',
      position: '0 0 0',
      rotation: '0 0 0',
    },
    {
      id: 2,
      name: 'Burger',
      image: '/images/burger.png',
      model: '/models/burger.glb',
      scale: '0.5 0.5 0.5',
      position: '0 0 0',
      rotation: '0 0 0',
    },
  ];

  return (
    <div style={{ padding: '1rem' }}>
      {!selectedItem ? (
        <>
          <h1>Menu</h1>
          <div style={{
            display: 'flex', flexWrap: 'wrap', gap: '1rem',
            justifyContent: 'center'
          }}>
            {items.map((item) => (
              <div
                key={item.id}
                style={{
                  border: '1px solid #ccc',
                  borderRadius: '10px',
                  padding: '1rem',
                  width: '150px',
                  textAlign: 'center',
                  cursor: 'pointer',
                  boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
                }}
                onClick={() => setSelectedItem(item)}
              >
                <img src={item.image} alt={item.name} style={{ width: '100%', borderRadius: '8px' }} />
                <p>{item.name}</p>
              </div>
            ))}
          </div>
        </>
      ) : (
        <ARView item={selectedItem} onClose={() => setSelectedItem(null)} />
      )}
    </div>
  );
};

export default App;
