import React from 'react';

const AreasOverview = ({ rooms, sensors }) => {
  return (
    <div style={{background: 'white', padding: '20px', borderRadius: '8px', marginBottom: '20px'}}>
      <h2>Areas Overview</h2>
      <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px',justifyContent: 'start',direction: 'ltr' }}>
        {/* Get unique list of areas */}
        {[...new Set(rooms.map(room => room.area_name).filter(Boolean))]
          .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }))
          .map(areaName => {
            const areaRooms = rooms.filter(room => room.area_name === areaName);
            const areaSensors = sensors.filter(sensor => 
              areaRooms.some(room => room.id === sensor.room_id)
            );
            return (
              <div
                key={areaName}
                style={{
                  padding: '20px',
                  borderRadius: '12px',
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  color: 'white',
                  boxShadow: '0 6px 12px rgba(0,0,0,0.1)'
                }}
              >
                {/* Area title */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  marginBottom: '15px',
                  borderBottom: '2px solid rgba(255,255,255,0.3)',
                  paddingBottom: '10px'
                }}>
                  <div style={{fontSize: '24px', marginRight: '10px'}}>🏢</div>
                  <h3 style={{margin: 0, fontSize: '20px', fontWeight: 'bold'}}>
                    {areaName || 'Unknown Area'}
                  </h3>
                </div>

                {/* Area statistics */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(3, 1fr)',
                  gap: '10px',
                  marginBottom: '15px'
                }}>
                  <div style={{
                    background: 'rgba(255,255,255,0.2)',
                    padding: '10px',
                    borderRadius: '8px',
                    textAlign: 'center'
                  }}>
                    <div style={{fontSize: '20px', fontWeight: 'bold'}}>{areaRooms.length}</div>
                    <div style={{fontSize: '12px', opacity: 0.9}}>Rooms</div>
                  </div>
                  <div style={{
                    background: 'rgba(255,255,255,0.2)',
                    padding: '10px',
                    borderRadius: '8px',
                    textAlign: 'center'
                  }}>
                    <div style={{fontSize: '20px', fontWeight: 'bold'}}>{areaSensors.length}</div>
                    <div style={{fontSize: '12px', opacity: 0.9}}>Sensors</div>
                  </div>
                  <div style={{
                    background: 'rgba(255,255,255,0.2)',
                    padding: '10px',
                    borderRadius: '8px',
                    textAlign: 'center'
                  }}>
                    <div style={{fontSize: '20px', fontWeight: 'bold'}}>
                      {areaSensors.filter(s => s.status === 'available').length}
                    </div>
                    <div style={{fontSize: '12px', opacity: 0.9}}>Available</div>
                  </div>
                </div>

                {/* Rooms list */}
                <div style={{marginBottom: '10px'}}>
                  <strong style={{fontSize: '14px'}}>🏠 Rooms:</strong>
                  <div style={{
                    marginTop: '8px',
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: '5px'
                  }}>
                    {areaRooms.map(room => (
                      <span
                        key={room.room_name}
                        style={{
                          background: 'rgba(255,255,255,0.2)',
                          padding: '4px 8px',
                          borderRadius: '12px',
                          fontSize: '12px',
                          border: '1px solid rgba(255,255,255,0.3)'
                        }}
                      >
                        {room.room_name}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Sensors list */}
                <div>
                  <strong style={{fontSize: '14px'}}>📡 Sensors:</strong>
                  <div style={{
                    marginTop: '8px',
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: '5px'
                  }}>
                    {areaSensors.map(sensor => (
                      <span
                        key={sensor.id}
                        style={{
                          background: sensor.status === 'available' ? 'rgba(76, 175, 80, 0.8)' :
                                     sensor.status === 'occupied' ? 'rgba(255, 87, 34, 0.8)' :
                                     'rgba(255, 193, 7, 0.8)',
                          color: 'white',
                          padding: '4px 8px',
                          borderRadius: '12px',
                          fontSize: '12px',
                          fontWeight: 'bold'
                        }}
                        title={`${sensor.id} - ${sensor.status}`}
                      >
                        {sensor.id}
                      </span>
                    ))}
                    {areaSensors.length === 0 && (
                      <span style={{
                        color: 'rgba(255,255,255,0.7)',
                        fontSize: '12px',
                        fontStyle: 'italic'
                      }}>
                        No sensors assigned
                      </span>
                    )}
                  </div>
                </div>

                {/* Rooms list by floor */}
                <div style={{marginBottom: '10px'}}>
                  <strong style={{fontSize: '14px'}}>🏠 Rooms by Floor:</strong>
                  <div style={{marginTop: '8px'}}>
                    {[...new Set(areaRooms.map(room => room.floor))]
                      .sort((a, b) => a - b)
                      .map(floor => (
                        <div key={floor} style={{marginBottom: '6px'}}>
                          <span style={{fontWeight: 'bold', color: '#ffd700'}}>Floor {floor}:</span>{' '}
                          {areaRooms
                            .filter(room => room.floor === floor)
                            .map(room => (
                              <span
                                key={room.room_name}
                                style={{
                                  background: 'rgba(255,255,255,0.2)',
                                  padding: '4px 8px',
                                  borderRadius: '12px',
                                  fontSize: '12px',
                                  border: '1px solid rgba(255,255,255,0.3)',
                                  marginRight: '4px'
                                }}
                              >
                                {room.room_name}
                              </span>
                            ))}
                        </div>
                      ))}
                  </div>
                </div>
              </div>
              
             );
      })}  
          
        {/* Area for rooms without defined area */}
        {rooms.filter(room => !room.area_name).length > 0 && (
          <div
            style={{
              padding: '20px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #bdc3c7 0%, #2c3e50 100%)',
              color: 'white',
              boxShadow: '0 6px 12px rgba(0,0,0,0.1)'
            }}
          >
            <div style={{
              display: 'flex',
              alignItems: 'center',
              marginBottom: '15px',
              borderBottom: '2px solid rgba(255,255,255,0.3)',
              paddingBottom: '10px'
            }}>
              <div style={{fontSize: '24px', marginRight: '10px'}}>❓</div>
              <h3 style={{margin: 0, fontSize: '20px', fontWeight: 'bold'}}>
                Unassigned Area
              </h3>
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '10px',
              marginBottom: '15px'
            }}>
              <div style={{
                background: 'rgba(255,255,255,0.2)',
                padding: '10px',
                borderRadius: '8px',
                textAlign: 'center'
              }}>
                <div style={{fontSize: '20px', fontWeight: 'bold'}}>
                  {rooms.filter(room => !room.area_name).length}
                </div>
                <div style={{fontSize: '12px', opacity: 0.9}}>Rooms</div>
              </div>
              <div style={{
                background: 'rgba(255,255,255,0.2)',
                padding: '10px',
                borderRadius: '8px',
                textAlign: 'center'
              }}>
                <div style={{fontSize: '20px', fontWeight: 'bold'}}>
                  {sensors.filter(sensor => 
                    rooms.filter(room => !room.area_name).some(room => room.id === sensor.room_id)
                  ).length}
                </div>
                <div style={{fontSize: '12px', opacity: 0.9}}>Sensors</div>
              </div>
              <div style={{
                background: 'rgba(255,255,255,0.2)',
                padding: '10px',
                borderRadius: '8px',
                textAlign: 'center'
              }}>
                <div style={{fontSize: '20px', fontWeight: 'bold'}}>
                  {sensors.filter(sensor => 
                    rooms.filter(room => !room.area_name).some(room => room.id === sensor.room_id) &&
                    sensor.status === 'available'
                  ).length}
                </div>
                <div style={{fontSize: '12px', opacity: 0.9}}>Available</div>
              </div>
            </div>

            <div style={{marginBottom: '10px'}}>
              <strong style={{fontSize: '14px'}}>🏠 Rooms:</strong>
              <div style={{
                marginTop: '8px',
                display: 'flex',
                flexWrap: 'wrap',
                gap: '5px'
              }}>
                {rooms.filter(room => !room.area_name).map(room => (
                  <span
                    key={room.room_name}
                    style={{
                      background: 'rgba(255,255,255,0.2)',
                      padding: '4px 8px',
                      borderRadius: '12px',
                      fontSize: '12px',
                      border: '1px solid rgba(255,255,255,0.3)'
                    }}
                  >
                    {room.room_name}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AreasOverview;
