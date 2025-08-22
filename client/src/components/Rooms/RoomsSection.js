import React from 'react';

const RoomsSection = ({ rooms }) => {
  return (
    <div style={{background: 'white', padding: '20px', borderRadius: '8px'}}>
      <h2>Rooms ({rooms.length})</h2>
      <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '15px'}}>
        {rooms.map(room => (
          <div
            key={room.room_name}
            style={{
              padding: '15px',
              borderRadius: '8px',
              backgroundColor: '#2196F3',
              color: 'white',
              textAlign: 'center'
            }}
          >
            <div style={{fontWeight: 'bold', fontSize: '1.1em', marginBottom: 6}}>
              Room Num: {room.room_name}
            </div>
            <div style={{fontSize: '13px', marginBottom: 4}}>
              Floor: {room.floor}
            </div>
            <div style={{fontSize: '13px'}}>
              🏢 {room.area_name || 'N/A'}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RoomsSection;
