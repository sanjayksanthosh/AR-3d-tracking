import React, { useState, useEffect } from 'react';

// --- Helper Components ---

// ARView Component: Handles the camera and 3D model display
const ARView = ({ item, onClose }) => {
  useEffect(() => {
    console.log("ARView mounted for:", item.name);
  }, [item]);

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', zIndex: 100 }}>
      {/* A-Frame Scene for AR */}
      <a-scene
        embedded
        arjs="sourceType: webcam; debugUIEnabled: false; sourceWidth: 1280; sourceHeight: 720; displayWidth: 1280; displayHeight: 720;"
        renderer="logarithmicDepthBuffer: true; precision: medium; antialias: true; physicallyCorrectLights: true;"
        vr-mode-ui="enabled: false"
        style={{ width: '100%', height: '100%' }}
      >
        {/* Lights added */}
        <a-entity light="type: ambient; intensity: 0.7"></a-entity>
        <a-entity light="type: directional; intensity: 1; castShadow: true" position="1 2 2"></a-entity>
        <a-entity light="type: directional; intensity: 0.8" position="-2 2 1"></a-entity>

        {/* Optional: environment (needs aframe-environment-component) */}
        {/* <a-entity environment="preset: forest; lighting: point"></a-entity> */}

        <a-marker preset="hiro">
          <a-entity
            gltf-model={`url(${item.model})`}
            scale={item.scale}
            position={item.position}
            rotation={item.rotation}
          ></a-entity>
        </a-marker>
        <a-entity camera></a-entity>
      </a-scene>

      {/* UI Overlay */}
      <div style={{
        position: 'absolute',
        top: '0',
        left: '0',
        width: '100%',
        padding: '1rem',
        boxSizing: 'border-box',
        zIndex: 10,
        color: 'white',
        textShadow: '0 1px 3px rgba(0,0,0,0.5)',
        background: 'linear-gradient(to bottom, rgba(0,0,0,0.6), transparent)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <button 
            onClick={onClose}
            style={{ padding: '0.5rem 1rem', fontSize: '1rem', backgroundColor: 'rgba(255, 255, 255, 0.9)', color: '#333', border: 'none', borderRadius: '0.5rem', cursor: 'pointer', boxShadow: '0 2px 5px rgba(0,0,0,0.2)', fontWeight: 'bold' }}
          >
            &larr; Back to Menu
          </button>
          <h2 style={{ margin: 0, fontSize: '1.25rem' }}>Viewing: {item.name}</h2>
        </div>
        <div style={{ marginTop: '1.5rem', padding: '1rem', backgroundColor: 'rgba(0, 0, 0, 0.6)', borderRadius: '0.5rem', textAlign: 'center' }}>
          <p style={{ margin: '0 0 0.5rem 0' }}>Point your camera at the Hiro marker to see the 3D model.</p>
          <a href="https://raw.githubusercontent.com/AR-js-org/AR.js/master/data/images/HIRO.jpg" target="_blank" rel="noopener noreferrer" style={{ display: 'inline-block', padding: '0.5rem 1rem', fontSize: '0.875rem', backgroundColor: '#3B82F6', borderRadius: '0.375rem', textDecoration: 'none', color: 'white', fontWeight: '500' }}>
            Show Hiro Marker
          </a>
        </div>
      </div>
    </div>
  );
};

// --- Tag Component ---
const Tag = ({ label }) => (
  <div style={{
    display: 'flex',
    alignItems: 'center',
    color: '#6B7280',
    fontSize: '0.875rem',
    marginRight: '1rem'
  }}>
    <span style={{ marginRight: '0.25rem' }}>✓</span> 
    {label}
  </div>
);

// --- MenuItem Component ---
const MenuItem = ({ item, onViewInAR }) => (
  <div style={{
    backgroundColor: 'white',
    borderRadius: '0.5rem',
    display: 'flex',
    padding: '1rem',
    gap: '1rem',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
    border: '1px solid #E5E7EB'
  }}>
    <img 
      src={item.image} 
      alt={item.name} 
      style={{
        width: '120px',
        height: '120px',
        objectFit: 'cover',
        borderRadius: '0.375rem',
        flexShrink: 0
      }}
      onError={(e) => { e.target.onerror = null; e.target.src='https://placehold.co/120x120/EEE/333?text=Error'; }}
    />
    <div style={{ display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <h3 style={{ margin: 0, fontSize: '1.125rem', color: '#1a1a1a', fontWeight: '600' }}>{item.name}</h3>
        <p style={{ margin: 0, fontSize: '1.125rem', fontWeight: 'bold', color: '#1a1a1a', whiteSpace: 'nowrap', paddingLeft: '1rem' }}>{item.price}</p>
      </div>
      <p style={{ color: '#555', margin: '0.25rem 0 0.75rem 0', flexGrow: 1, fontSize: '0.9rem', lineHeight: '1.5' }}>{item.description}</p>
      <div style={{ display: 'flex', marginBottom: '0.75rem' }}>
        {item.isVegan && <Tag label="Vegan" />}
        {item.isSpicy && <Tag label="Spicy" />}
        {item.isGlutenFree && <Tag label="Gluten-Free" />}
      </div>
      <button 
        onClick={() => onViewInAR(item)}
        style={{
          padding: '0.5rem 1rem',
          fontSize: '0.875rem',
          fontWeight: '600',
          color: '#4F46E5',
          backgroundColor: '#EEF2FF',
          border: '1px solid #C7D2FE',
          borderRadius: '0.375rem',
          cursor: 'pointer',
          transition: 'background-color 0.2s, color 0.2s',
          alignSelf: 'flex-start'
        }}
        onMouseOver={e => e.currentTarget.style.backgroundColor = '#C7D2FE'}
        onMouseOut={e => e.currentTarget.style.backgroundColor = '#EEF2FF'}
      >
        View in AR
      </button>
    </div>
  </div>
);

// --- Main App Component ---
function App() {
  const [arItem, setArItem] = useState(null);

  const menuData = [
    {
      id: 1,
      name: "Classic Burger",
      description: "A juicy beef patty with fresh lettuce, tomato, onion, and our secret sauce.",
      price: "$12.99 USD",
      image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=1998&auto=format&fit=crop",
      category: "Main Dishes",
      isSpicy: true,
      model: "/models/ribs_from_joia.glb",
      scale: "8 8 8",
      position: "0 0 0",
      rotation: "0 0 0",
    },
    {
      id: 2,
      name: "French Fries",
      description: "Crispy, golden-brown fries salted to perfection.",
      price: "$4.99 USD",
      image: "https://images.unsplash.com/photo-1576107232684-c7be35d0859a?q=80&w=1887&auto=format&fit=crop",
      category: "Main Dishes",
      isVegan: true,
      isGlutenFree: true,
      model: "/models/ribs_from_joia.glb",
      scale: "2 2 2",
      position: "0 0 0",
      rotation: "0 0 0",
    },
    {
      id: 3,
      name: "Pancakes with Berries",
      description: "Fluffy buttermilk pancakes topped with fresh berries.",
      price: "$10.99 USD",
      image: "https://images.unsplash.com/photo-1528207776546-365bb710ee93?q=80&w=2070&auto=format&fit=crop",
      category: "Breakfast",
      model: "/models/cheese_pastry.glb",
      scale: "0.1 0.1 0.1",
      position: "0 0 0",
      rotation: "0 0 0",
    },
    {
      id: 4,
      name: "Regular Soda",
      description: "Choose from a selection of classic soft drinks.",
      price: "$2.99 USD",
      image: "https://images.unsplash.com/photo-1554866585-cd94860890b7?q=80&w=1964&auto=format&fit=crop",
      category: "Drinks",
      isVegan: true,
      model: "/models/pizza_ballerina.glb",
      scale: "2 2 2",
      position: "0 0.2 0",
      rotation: "-90 0 0",
    },
    {
      id: 5,
      name: "Chocolate Cake",
      description: "A decadent slice of rich chocolate cake.",
      price: "$6.00 USD",
      image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?q=80&w=1987&auto=format&fit=crop",
      category: "Desserts",
      model: "/models/cake_slice.glb",
      scale: "0.3 0.3 0.3",
      position: "0 0.1 0",
      rotation: "0 0 0",
    }
  ];

  const categories = ["All", ...new Set(menuData.map(item => item.category))];
  const [activeCategory, setActiveCategory] = useState(categories[0]);

  const filteredItems = activeCategory === "All"
    ? menuData
    : menuData.filter(item => item.category === activeCategory);

  useEffect(() => {
    document.body.style.overflow = arItem ? 'hidden' : 'auto';
    return () => { document.body.style.overflow = 'auto'; };
  }, [arItem]);

  if (arItem) {
    return <ARView item={arItem} onClose={() => setArItem(null)} />;
  }

  return (
    <div style={{
      fontFamily: `'Inter', sans-serif`,
      backgroundColor: '#F9FAFB',
      minHeight: '100vh',
    }}>
      <main style={{
        maxWidth: '800px',
        margin: '0 auto',
        padding: '2rem 1rem',
      }}>
        <header style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <h1 style={{ fontSize: '2.25rem', fontWeight: 'bold', color: '#111827' }}>Browse our menu</h1>
          <p style={{ fontSize: '1.125rem', color: '#4B5563', marginTop: '0.5rem' }}>
            Explore delicious food and view them in AR!
          </p>
        </header>

        {/* Category Filter */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '0.75rem', marginBottom: '2.5rem' }}>
          {categories.map(category => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              style={{
                padding: '0.5rem 1.25rem',
                fontSize: '1rem',
                fontWeight: '600',
                border: '1px solid transparent',
                borderRadius: '0.375rem',
                cursor: 'pointer',
                transition: 'all 0.2s',
                backgroundColor: activeCategory === category ? '#FF7A59' : '#FFFFFF',
                color: activeCategory === category ? '#FFFFFF' : '#374151',
                boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
              }}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Menu Items */}
        <div style={{ display: 'grid', gap: '1.5rem' }}>
          {filteredItems.map(item => (
            <MenuItem key={item.id} item={item} onViewInAR={setArItem} />
          ))}
        </div>
      </main>
    </div>
  );
}

export default App;
