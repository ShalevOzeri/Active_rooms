
import React from 'react';
import Map from '../Map';
import MapHideButton from '../Common/MapHideButton';

const MapSection = ({ 
  showMap, 
  onToggleMap, 
  sensors, 
  rooms, 
  onSensorClick,
  onMapClick,
  onAddRoomFromMap,
  user
}) => {
  return (
    <div>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '20px'
      }}>
        <h2>🗺️ Campus Map - Sensors & Rooms Locations</h2>
  {showMap && <MapHideButton onHide={onToggleMap} />}
      </div>

      {/* Map component */}
      {showMap && (
        <Map 
          sensors={sensors} 
          rooms={rooms} 
          onSensorClick={onSensorClick}
          onMapClick={onMapClick}
          onAddRoomFromMap={onAddRoomFromMap}
          user={user}
        />
      )}
    </div>
  );
};

export default MapSection;
