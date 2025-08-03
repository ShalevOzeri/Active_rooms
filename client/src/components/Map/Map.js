import React, { useState, useEffect } from 'react';
import SensorMarker from './SensorMarker';
import MapLegend from './MapLegend';

const Map = ({ sensors, rooms, onSensorClick }) => {
  const [mapDimensions, setMapDimensions] = useState({ width: 0, height: 0 });
  const [imageLoaded, setImageLoaded] = useState(false);

  // טען את גודל התמונה
  useEffect(() => {
    const img = new Image();
    img.onload = () => {
      setMapDimensions({ width: img.width, height: img.height });
      setImageLoaded(true);
    };
    img.src = '/hit-campus-map.jpg';
  }, []);

  // פונקציה להמרת קואורדינטות חיישן לפיקסלים במפה
  const getSensorPosition = (sensor, containerWidth, containerHeight) => {
    if (!mapDimensions.width || !mapDimensions.height) return { x: 0, y: 0 };
    
    // המרה מקואורדינטות החיישן (0-800, 0-600) לגודל המפה בפועל
    const scaleX = containerWidth / 800;
    const scaleY = containerHeight / 600;
    
    return {
      x: sensor.x * scaleX,
      y: sensor.y * scaleY
    };
  };

  if (!imageLoaded) {
    return (
      <div style={{
        padding: '40px',
        textAlign: 'center',
        background: '#f5f5f5',
        borderRadius: '8px'
      }}>
        <div style={{ fontSize: '24px', marginBottom: '10px' }}>🗺️</div>
        <div>Loading campus map...</div>
      </div>
    );
  }

  return (
    <div style={{
      background: 'white',
      padding: '20px',
      borderRadius: '8px',
      marginBottom: '20px'
    }}>
      {/* כותרת ולגנדה */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '20px'
      }}>
        <h2>🗺️ Campus Map - Sensor Locations</h2>
        <MapLegend />
      </div>

      {/* המפה */}
      <div style={{
        position: 'relative',
        width: '100%',
        maxWidth: '1200px',
        margin: '0 auto',
        border: '2px solid #ddd',
        borderRadius: '8px',
        overflow: 'hidden',
        boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
      }}>
        {/* תמונת המפה */}
        <img
          src="/hit-campus-map.jpg"
          alt="HIT Campus Map"
          style={{
            width: '100%',
            height: 'auto',
            display: 'block'
          }}
          onLoad={(e) => {
            const rect = e.target.getBoundingClientRect();
            setMapDimensions({ width: rect.width, height: rect.height });
          }}
        />

        {/* החיישנים על המפה */}
        {sensors.map(sensor => {
          const position = getSensorPosition(
            sensor,
            mapDimensions.width,
            mapDimensions.height
          );

          return (
            <SensorMarker
              key={sensor.id}
              sensor={sensor}
              position={position}
              onClick={onSensorClick}
            />
          );
        })}

        {/* מידע נוסף על המפה */}
        <div style={{
          position: 'absolute',
          bottom: '10px',
          left: '10px',
          background: 'rgba(0,0,0,0.7)',
          color: 'white',
          padding: '8px 12px',
          borderRadius: '6px',
          fontSize: '12px'
        }}>
          📡 {sensors.length} sensors • 
          ✅ {sensors.filter(s => s.status === 'available').length} available • 
          🔴 {sensors.filter(s => s.status === 'occupied').length} occupied
        </div>
      </div>

      {/* סטטיסטיקות מתחת למפה */}
      <div style={{
        marginTop: '20px',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
        gap: '10px'
      }}>
        <div style={{
          background: '#4CAF50',
          color: 'white',
          padding: '15px',
          borderRadius: '6px',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '24px', fontWeight: 'bold' }}>
            {sensors.filter(s => s.status === 'available').length}
          </div>
          <div style={{ fontSize: '12px' }}>Available Sensors</div>
        </div>
        
        <div style={{
          background: '#FF5722',
          color: 'white',
          padding: '15px',
          borderRadius: '6px',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '24px', fontWeight: 'bold' }}>
            {sensors.filter(s => s.status === 'occupied').length}
          </div>
          <div style={{ fontSize: '12px' }}>Occupied Sensors</div>
        </div>
        
        <div style={{
          background: '#FFC107',
          color: 'white',
          padding: '15px',
          borderRadius: '6px',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '24px', fontWeight: 'bold' }}>
            {sensors.filter(s => s.status === 'error').length}
          </div>
          <div style={{ fontSize: '12px' }}>Error Sensors</div>
        </div>
        
        <div style={{
          background: '#2196F3',
          color: 'white',
          padding: '15px',
          borderRadius: '6px',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '24px', fontWeight: 'bold' }}>
            {sensors.length}
          </div>
          <div style={{ fontSize: '12px' }}>Total Sensors</div>
        </div>
      </div>
    </div>
  );
};

export default Map;