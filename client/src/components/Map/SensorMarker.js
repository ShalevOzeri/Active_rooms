import React from 'react';

const SensorMarker = ({ sensor, position, onClick }) => {
  // קבלת צבע החיישן לפי סטטוס
  const getSensorColor = (status) => {
    switch (status) {
      case 'available': return '#4CAF50';
      case 'occupied': return '#FF5722';
      case 'error': return '#FFC107';
      case 'maintenance': return '#9E9E9E';
      default: return '#9E9E9E';
    }
  };

  // קבלת אייקון החיישן לפי סטטוס
  const getSensorIcon = (status) => {
    switch (status) {
      case 'available': return '✅';
      case 'occupied': return '🔴';
      case 'error': return '⚠️';
      case 'maintenance': return '🔧';
      default: return '❓';
    }
  };

  return (
    <div
      onClick={() => onClick && onClick(sensor)}
      style={{
        position: 'absolute',
        left: position.x - 15,
        top: position.y - 15,
        width: '30px',
        height: '30px',
        borderRadius: '50%',
        background: getSensorColor(sensor.status),
        border: '3px solid white',
        boxShadow: '0 2px 6px rgba(0,0,0,0.3)',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '12px',
        fontWeight: 'bold',
        color: 'white',
        transition: 'transform 0.2s, box-shadow 0.2s',
        zIndex: 10
      }}
      onMouseEnter={(e) => {
        e.target.style.transform = 'scale(1.2)';
        e.target.style.boxShadow = '0 4px 12px rgba(0,0,0,0.4)';
        e.target.style.zIndex = '20';
      }}
      onMouseLeave={(e) => {
        e.target.style.transform = 'scale(1)';
        e.target.style.boxShadow = '0 2px 6px rgba(0,0,0,0.3)';
        e.target.style.zIndex = '10';
      }}
      title={`${sensor.id} - ${sensor.status}${sensor.room_id ? ` (Room: ${sensor.room_id})` : ''}`}
    >
      {getSensorIcon(sensor.status)}
    </div>
  );
};

export default SensorMarker;