import React from 'react';

// Add user and onDeleteRoom as props
const RoomsSection = ({ rooms, user, onDeleteRoom, onAddRoom }) => {
  return (
    <div style={{background: 'white', padding: '20px', borderRadius: '8px'}}>
      <h2 style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
        Rooms ({rooms.length})
        {user?.role === 'admin' && onAddRoom && (
          <button
            onClick={onAddRoom}
            style={{
              padding: '10px',
              background: '#4CAF50',
              color: '#fff',
              border: 'none',
              borderRadius: '6px',
              fontWeight: 'bold',
              fontSize: 15,
              cursor: 'pointer',
              boxShadow: '0 1px 4px rgba(0,0,0,0.07)'
            }}
          >
            ➕ Add Room
          </button>
        )}
      </h2>
      <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '15px'}}>
        {rooms.map(room => (
          <div
            key={room.room_name}
            style={{
              padding: '15px',
              borderRadius: '8px',
              backgroundColor: '#2196F3',
              color: 'white',
              textAlign: 'center',
              position: 'relative'
            }}
          >
            {/* Delete button is shown only for admin */}
            {user?.role === 'admin' && (
              <button
                onClick={() => onDeleteRoom && onDeleteRoom(room.id)}
                style={{
                  position: 'absolute',
                  top: '5px',
                  right: '5px',
                  background: '#0000004d',
                  color: 'white',
                  border: 'none',
                  borderRadius: '50%',
                  width: '24px',
                  height: '24px',
                  cursor: 'pointer',
                  fontSize: '12px'
                }}
                title="Delete Room"
              >
                ✕
              </button>
            )}
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
