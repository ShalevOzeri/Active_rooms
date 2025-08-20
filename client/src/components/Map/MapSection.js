import React from 'react';
import Map from '../Map';

const MapSection = ({ 
  showMap, 
  onToggleMap, 
  sensors, 
  rooms, 
  onSensorClick,
  onMapClick
}) => {
  return (
    <div>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '20px'
      }}>
        <h2>🗺️ Campus Map</h2>
        <button
          onClick={onToggleMap}
          style={{
            padding: '10px 20px',
            background: showMap ? '#FF5722' : '#4CAF50',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '14px'
          }}
        >
          {showMap ? '🗺️ Hide Map' : '🗺️ Show Map'}
        </button>
      </div>

      {/* Map component */}
      {showMap && (
        <Map 
          sensors={sensors} 
          rooms={rooms} 
          onSensorClick={onSensorClick}
          onMapClick={onMapClick}
        />
      )}
    </div>
  );
};

export default MapSection;
