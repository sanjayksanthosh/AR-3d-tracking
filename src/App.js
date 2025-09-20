import React, { useState, useEffect } from "react";

// --- ARView Component ---
const ARView = ({ item, onClose }) => {
  useEffect(() => {
    console.log("Loading model:", item?.model);

    // Prevent page zooming on mobile while in AR
    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";
    document.body.style.height = "100vh";
    document.documentElement.style.height = "100vh";

    return () => {
      document.body.style.overflow = "auto";
      document.documentElement.style.overflow = "auto";
      document.body.style.height = "auto";
      document.documentElement.style.height = "auto";
    };
  }, [item]);

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        width: "100vw",
        height: "100vh",
        zIndex: 1000,
        background: "black",
      }}
    >
      <button
        onClick={onClose}
        style={{
          position: "absolute",
          top: "12px",
          right: "12px",
          zIndex: 1100,
          background: "rgba(0,0,0,0.6)",
          color: "#fff",
          border: "none",
          padding: "10px 14px",
          borderRadius: "8px",
          fontSize: "16px",
        }}
      >
        ✕
      </button>

      <a-scene
        embedded
        arjs="sourceType: webcam; debugUIEnabled: false;"
        renderer="logarithmicDepthBuffer: true; precision: medium; antialias: true; physicallyCorrectLights: true;"
        vr-mode-ui="enabled: false"
        style={{ width: "100%", height: "100%" }}
      >
        {/* Lights */}
        <a-entity light="type: ambient; intensity: 0.8"></a-entity>
        <a-entity
          light="type: directional; intensity: 1"
          position="1 1 1"
        ></a-entity>

        {/* Marker + Model */}
        <a-marker preset="hiro">
          <a-entity
            gltf-model={`url(${item.model})`}
            scale="2 2 2"
            position="0 0 0"
            rotation="0 0 0"
          ></a-entity>
        </a-marker>

        <a-entity camera></a-entity>
      </a-scene>
    </div>
  );
};

// --- CardList Component ---
const CardList = ({ items, onSelect }) => {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "14px",
        padding: "14px",
        maxWidth: "800px",
        margin: "0 auto",
      }}
    >
      {items.map((item, idx) => (
        <div
          key={idx}
          onClick={() => onSelect(item)}
          style={{
            display: "flex",
            alignItems: "center",
            background: "#fff",
            borderRadius: "14px",
            boxShadow: "0 4px 10px rgba(0,0,0,0.08)",
            overflow: "hidden",
            cursor: "pointer",
            transition: "transform 0.2s",
          }}
        >
          <img
            src={item.image}
            alt={item.name}
            style={{
              width: "100px",
              height: "100px",
              objectFit: "cover",
              flexShrink: 0,
            }}
          />
          <div style={{ padding: "10px", flex: 1 }}>
            <h3 style={{ margin: "0 0 4px", fontSize: "18px" }}>{item.name}</h3>
            <p style={{ margin: 0, fontSize: "14px", color: "#666" }}>
              {item.description}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

// --- Main App ---
export default function App() {
  const [selectedItem, setSelectedItem] = useState(null);

  const items = [
    {
      name: "Ribs from Joia",
      description: "Delicious ribs with sauce.",
      image: "/images/ribs.jpg",
      model: "/models/ribs_from_joia.glb",
    },
    {
      name: "Pizza",
      description: "Cheesy pizza slice.",
      image: "/images/pizza.jpg",
      model: "/models/pizza.glb",
    },
  ];

  return (
    <div style={{ fontFamily: "Arial, sans-serif", background: "#f9f9f9" }}>
      <h2 style={{ textAlign: "center", padding: "16px" }}>AR Menu</h2>
      <CardList items={items} onSelect={setSelectedItem} />
      {selectedItem && (
        <ARView item={selectedItem} onClose={() => setSelectedItem(null)} />
      )}
    </div>
  );
}
