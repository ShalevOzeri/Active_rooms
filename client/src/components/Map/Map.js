import React, { useState, useEffect } from 'react';
import SensorMarker from './SensorMarker';
import MapLegend from './MapLegend';
import AddSensorDialog from './AddSensorDialog'; // import the dialog

const Map = ({ sensors, rooms, onSensorClick, onMapClick }) => {
  const [mapDimensions, setMapDimensions] = useState({ width: 0, height: 0 });
  const [imageLoaded, setImageLoaded] = useState(false);
  const [addSensorPos, setAddSensorPos] = useState(null);

  // Load image dimensions
  useEffect(() => {
    const img = new Image();
    img.onload = () => {
      setMapDimensions({ width: img.width, height: img.height });
      setImageLoaded(true);
    };
    img.src = '/hit-campus-map.jpg';
  }, []);

  // Function to convert sensor coordinates to map pixels
  const getSensorPosition = (sensor, containerWidth, containerHeight) => {
    if (!mapDimensions.width || !mapDimensions.height) return { x: 0, y: 0 };
    
    // Convert from sensor coordinates (0-800, 0-600) to actual map size
    const scaleX = containerWidth / 800;
    const scaleY = containerHeight / 600;
    
    return {
      x: sensor.x * scaleX,
      y: sensor.y * scaleY
    };
  };

  // Handle map click (not on marker)
  const handleMapClick = (e) => {
    if (e.target.closest('.sensor-marker')) return;
    const rect = e.target.getBoundingClientRect();
    const x = Math.round((e.clientX - rect.left) * 800 / rect.width);
    const y = Math.round((e.clientY - rect.top) * 600 / rect.height);
    if (onMapClick) onMapClick(x, y);
  };

  // Handle dialog close or sensor add
  const handleDialogClose = () => setAddSensorPos(null);
  const handleAddSensor = (sensorData) => {
    setAddSensorPos(null);
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
      {/* Title and legend */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '20px'
      }}>
        <h2>🗺️ Campus Map - Sensor Locations</h2>
        <MapLegend />
      </div>

      {/* The map */}
      <div
        style={{
          position: 'relative',
          width: '100%',
          maxWidth: '1200px',
          margin: '0 auto',
          border: '2px solid #ddd',
          borderRadius: '8px',
          overflow: 'hidden',
          boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
        }}
        onClick={handleMapClick}
      >
        {/* Map image */}
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

        {/* Sensors on the map */}
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
              onClick={(e) => e.stopPropagation()}
              rooms={rooms}
              className="sensor-marker"
            />
          );
        })}

        {/* Add Sensor Dialog */}
        {addSensorPos && (
          <AddSensorDialog
            position={addSensorPos}
            rooms={rooms}
            onAdd={handleAddSensor}
            onCancel={handleDialogClose}
          />
        )}
      </div>

      {/* Statistics below the map */}
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