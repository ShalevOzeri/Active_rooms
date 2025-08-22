import React from 'react';

const RoomsSection = ({ rooms, user, onAddRoom }) => {
  return (
    <div style={{background: 'white', padding: '20px', borderRadius: '8px'}}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <h2>Rooms ({rooms.length})</h2>
        {user?.role === 'admin' && (
          <button
            onClick={onAddRoom}
            style={{
              background: '#43a047',
              color: '#fff',
              border: 'none',
              borderRadius: 6,
              padding: '6px 16px',
              fontWeight: 'bold',
              fontSize: '1em',
              cursor: 'pointer'
            }}
          >
            ➕ Add Room
          </button>
        )}
      </div>
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
            🏠 {room.room_name} - {room.description} <br />
            <span style={{fontSize: '12px', color: '#eee'}}>Floor: {room.floor}</span> <br />
            <span style={{fontSize: '12px'}}> 🏢  {room.area_name || 'N/A'}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RoomsSection;
