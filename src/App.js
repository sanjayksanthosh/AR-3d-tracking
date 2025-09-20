import React, { useState, useEffect } from 'react';

// --- Helper Components ---

// ARView Component: Handles the camera and 3D model display (No changes here)
const ARView = ({ item, onClose }) => {
  useEffect(() => {
    console.log("ARView mounted for:", item.name);
  }, [item]);

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', zIndex: 100 }}>
      {/* A-Frame Scene for AR */}
      <a-scene
        embedded
        arjs="sourceType: webcam; debugUIEnabled: false;"
        vr-mode-ui="enabled: false"
        style={{ width: '100%', height: '100%' }}
      >
        <a-marker preset="hiro">
          <a-entity
            gltf-model={`url(${item.model})`}
            scale={item.scale}
            position={item.position}
            rotation={item.rotation}
            animation="property: rotation; to: 0 360 0; loop: true; dur: 10000; easing: linear;"
          ></a-entity>
        </a-marker>
        <a-entity camera></a-entity>
      </a-scene>

      {/* UI Overlay for instructions and closing the AR view */}
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
                style={{
                    padding: '0.5rem 1rem',
                    fontSize: '1rem',
                    backgroundColor: 'rgba(255, 255, 255, 0.9)',
                    color: '#333',
                    border: 'none',
                    borderRadius: '0.5rem',
                    cursor: 'pointer',
                    boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
                    fontWeight: 'bold'
                }}
            >
                &larr; Back to Menu
            </button>
            <h2 style={{ margin: 0, fontSize: '1.25rem' }}>Viewing: {item.name}</h2>
        </div>
        <div style={{
            marginTop: '1.5rem',
            padding: '1rem',
            backgroundColor: 'rgba(0, 0, 0, 0.6)',
            borderRadius: '0.5rem',
            textAlign: 'center'
        }}>
            <p style={{ margin: '0 0 0.5rem 0' }}>Point your camera at the Hiro marker to see the 3D model.</p>
            <a 
              href="https://raw.githubusercontent.com/AR-js-org/AR.js/master/data/images/HIRO.jpg" 
              target="_blank" 
              rel="noopener noreferrer"
              style={{
                  display: 'inline-block',
                  padding: '0.5rem 1rem',
                  fontSize: '0.875rem',
                  backgroundColor: '#3B82F6',
                  borderRadius: '0.375rem',
                  textDecoration: 'none',
                  color: 'white',
                  fontWeight: '500'
              }}
            >
              Show Hiro Marker
            </a>
        </div>
      </div>
    </div>
  );
};


// MenuItem Component: Displays a single item card in the menu (UI/UX updated)
// MenuItem Component: Horizontal Content Inside
const MenuItem = ({ item, onViewInAR }) => (
  <div style={{
    backgroundColor: 'white',
    borderRadius: '0.75rem',
    overflow: 'hidden',
    boxShadow: '0 4px 15px rgba(0, 0, 0, 0.08)',
    display: 'flex',
    flexDirection: 'column', // Card stays vertical in grid
    height: '100%',
    transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
  }}
   onMouseOver={e => {
     e.currentTarget.style.transform = 'translateY(-4px)';
     e.currentTarget.style.boxShadow = '0 8px 25px rgba(0, 0, 0, 0.12)';
   }}
   onMouseOut={e => {
     e.currentTarget.style.transform = 'translateY(0)';
     e.currentTarget.style.boxShadow = '0 4px 15px rgba(0, 0, 0, 0.08)';
   }}
  >
    {/* Inner content row layout */}
    <div style={{ display: 'flex', flexDirection: 'row', height: '200px' }}>
      {/* Image on left */}
      <img 
        src={item.image} 
        alt={item.name} 
        style={{ width: '50%', height: '100%', objectFit: 'cover' }}
        onError={(e) => { e.target.onerror = null; e.target.src='https://placehold.co/400x400/EEE/333?text=Image+Missing'; }}
      />

      {/* Text + button on right */}
      <div style={{ padding: '1rem', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <h3 style={{ margin: 0, fontSize: '1.25rem', color: '#1a1a1a', fontWeight: '600' }}>{item.name}</h3>
            <p style={{ margin: 0, fontSize: '1.125rem', fontWeight: 'bold', color: '#1a1a1a', whiteSpace: 'nowrap', paddingLeft: '1rem' }}>{item.price}</p>
          </div>
          <p style={{ color: '#555', marginTop: '0.5rem', lineHeight: '1.5' }}>{item.description}</p>
        </div>

        <button 
          onClick={() => onViewInAR(item)}
          style={{
              marginTop: '1rem',
              padding: '0.75rem',
              fontSize: '1rem',
              fontWeight: '600',
              color: 'white',
              backgroundColor: '#4F46E5',
              border: 'none',
              borderRadius: '0.5rem',
              cursor: 'pointer',
              transition: 'background-color 0.2s',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem'
          }}
          onMouseOver={e => e.currentTarget.style.backgroundColor = '#4338CA'}
          onMouseOut={e => e.currentTarget.style.backgroundColor = '#4F46E5'}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg>
          View in AR
        </button>
      </div>
    </div>
  </div>
);

// --- Main App Component ---

function App() {
  const [arItem, setArItem] = useState(null);

  // Data is now structured with categories
  const menuData = [
    {
      category: "Hot Coffees",
      items: [
         {
          id: 1,
          name: "Cappuccino",
          description: "A classic blend of rich espresso, steamed milk, and a smooth layer of foam.",
          price: "$4.50",
          image: "https://images.unsplash.com/photo-1557799884-361a3c7f199b?q=80&w=1887&auto=format&fit=crop",
          model: "/my-ar-app/public/models/ribs_from_joia.glb",
          scale: "0.4 0.4 0.4",
          position: "0 0.5 0",
          rotation: "-90 0 0",
        },
        {
          id: 5,
          name: "Espresso",
          description: "A concentrated, full-bodied coffee shot with a layer of rich 'crema' on top.",
          price: "$3.00",
          image: "https://images.unsplash.com/photo-1599399432888-b39b83726f54?q=80&w=1887&auto=format&fit=crop",
          model: "/my-ar-app/public/models/grilled_sandwich.glb",
          scale: "0.3 0.3 0.3",
          position: "0 0.4 0",
          rotation: "-90 0 0",
        }
      ]
    },
    {
      category: "Pastries & Cakes",
      items: [
        {
          id: 2,
          name: "Butter Croissant",
          description: "Flaky, buttery, and freshly baked throughout the day. A perfect Parisian treat.",
          price: "$3.75",
          image: "https://images.unsplash.com/photo-1621268858154-1b3d5b796d1c?q=80&w=1964&auto=format&fit=crop",
          model: "/my-ar-app/public/models/cheese_pastry.glb",
          scale: "0.2 0.2 0.2",
          position: "0 0.2 0",
          rotation: "0 0 0",
        },
        {
          id: 3,
          name: "Chocolate Cake",
          description: "A decadent slice of rich chocolate cake with a creamy fudge frosting.",
          price: "$6.00",
          image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?q=80&w=1987&auto=format&fit=crop",
          model: "/my-ar-app/public/models/pizza_ballerina.glb",
          scale: "0.3 0.3 0.3",
          position: "0 0.1 0",
          rotation: "0 0 0",
        },
      ]
    },
    {
      category: "Cold Drinks",
      items: [
        {
          id: 4,
          name: "Iced Matcha",
          description: "Premium Japanese matcha powder whisked and served over ice with your choice of milk.",
          price: "$5.50",
          image: "https://images.unsplash.com/photo-1557888120-164a5c95a339?q=80&w=1887&auto=format&fit=crop",
          model: "https://cdn.glitch.global/e524623c-f45e-47f6-82f5-20c1532c2560/coffee_cup.glb?v=1726757138989",
          scale: "0.4 0.4 0.4",
          position: "0 0.5 0",
          rotation: "-90 0 0",
        },
      ]
    }
  ];
  
  // Prevent body scroll when AR view is active
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
      backgroundColor: '#F9FAFB', // Lighter grey for a cleaner look
      minHeight: '100vh',
    }}>
      <header style={{ 
        textAlign: 'center', 
        padding: '2.5rem 1rem', 
        backgroundColor: 'white',
        borderBottom: '1px solid #E5E7EB'
      }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#111827' }}>The AR Café</h1>
        <p style={{ fontSize: '1.125rem', color: '#4B5563', marginTop: '0.5rem' }}>Experience our menu in Augmented Reality!</p>
      </header>
      
      <main style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '2rem 1rem',
      }}>
        {menuData.map(({ category, items }) => (
          <section key={category} style={{ marginBottom: '3rem' }}>
            <h2 style={{
              fontSize: '1.75rem',
              fontWeight: '600',
              color: '#111827',
              marginBottom: '1.5rem',
              paddingBottom: '0.5rem',
              borderBottom: '2px solid #D1D5DB'
            }}>{category}</h2>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
              gap: '2rem',
            }}>
              {items.map(item => (
                <MenuItem key={item.id} item={item} onViewInAR={setArItem} />
              ))}
            </div>
          </section>
        ))}
      </main>

      <footer style={{ textAlign: 'center', padding: '2rem 1rem', color: '#6B7280', backgroundColor: '#F3F4F6' }}>
        <p>&copy; 2024 The AR Café. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default App;

