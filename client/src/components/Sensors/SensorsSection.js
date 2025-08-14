import React from 'react';

const SensorsSection = ({ 
  sensors, 
  user, 
  loading, 
  onAddSensor, 
  onEditSensor, 
  onDeleteSensor,
  getFullRoomLabel 
}) => {
  return (
    <div style={{
      background: 'white', 
      padding: '20px', 
      borderRadius: '8px', 
      marginBottom: '20px'
    }}>
      <div style={{
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        marginBottom: '20px'
      }}>
        <h2>Sensors ({sensors.length})</h2>
        {user.role === 'admin' && (
          <button
            onClick={onAddSensor}
            style={{
              padding: '8px 16px',
              background: '#4CAF50',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer'
            }}
          >
            ➕ Add Sensor
          </button>
        )}
      </div>
      
      <div style={{
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', 
        gap: '15px'
      }}>
        {sensors.map(sensor => (
          <div
            key={sensor.id}
            style={{
              padding: '15px',
              borderRadius: '8px',
              color: 'white',
              backgroundColor: sensor.status === 'available' ? '#4CAF50' : 
                             sensor.status === 'occupied' ? '#FF5722' : '#FFC107',
              textAlign: 'center',
              position: 'relative'
            }}
          >
            {user.role === 'admin' && (
              <>
                <button
                  onClick={() => onEditSensor(sensor)}
                  style={{
                    position: 'absolute',
                    top: '5px',
                    left: '5px',
                    background: 'rgba(33,150,243,0.8)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '50%',
                    width: '24px',
                    height: '24px',
                    cursor: 'pointer',
                    fontSize: '12px'
                  }}
                  title="Edit Sensor"
                >
                  ✎
                </button>
                <button
                  onClick={() => onDeleteSensor(sensor.id)}
                  style={{
                    position: 'absolute',
                    top: '5px',
                    right: '5px',
                    background: 'rgba(0,0,0,0.3)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '50%',
                    width: '24px',
                    height: '24px',
                    cursor: 'pointer',
                    fontSize: '12px'
                  }}
                  title="Delete Sensor"
                >
                  ✕
                </button>
              </>
            )}
            📡 {sensor.id} - {sensor.status}
            <br />
            <small>Room: {getFullRoomLabel(sensor.room_id)}</small>
            <br />
            <small>Position: ({sensor.x}, {sensor.y})</small>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SensorsSection;
