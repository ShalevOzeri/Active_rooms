import React, { useState, useEffect } from 'react';
import './App.css';
import Login from './components/Auth/Login';
import AddSensorModal from './components/Modals/AddSensorModal';
import EditSensorModal from './components/Modals/EditSensorModal';
import AreasOverview from './components/AreaOverview/AreasOverview';
import StatsCards from './components/Stats/StatsCards';
import RoomsSection from './components/Rooms/RoomsSection';
import Header from './components/Layout/Header';
import SensorsSection from './components/Sensors/SensorsSection';
import MessageBanner from './components/Common/MessageBanner';
import MapSection from './components/Map/MapSection';
import apiService from './services/apiService';
import AddRoomModal from './components/Modals/AddRoomModal';
import EditRoomModal from './components/Modals/EditRoomModal';

// Enhanced Dashboard Component with Admin Features
const Dashboard = ({ user, onLogout }) => {
  const [sensors, setSensors] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [areas, setAreas] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showAddRoomModal, setShowAddRoomModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [selectedSensor, setSelectedSensor] = useState(null);
  const [showMap, setShowMap] = useState(true);
  const [editSensor, setEditSensor] = useState(null);
  const [editRoom, setEditRoom] = useState(null);
  const [allowedBounds, setAllowedBounds] = useState({
    xMin: 0,
    xMax: 800,
    yMin: 0,
    yMax: 600,
  });
  const [addSensorXY, setAddSensorXY] = useState(null);
  const [addRoomXY, setAddRoomXY] = useState(null);

  const getFullRoomLabel = (roomId) => {
    const room = rooms.find(r => r.id === roomId);
    if (!room) return 'N/A';
    return `${room.room_name} (${room.area || 'Unknown'})`;
  };
  // Define area bounds for sensor placement on the map
  const areaBounds = {
    1: { xMin: 50,  xMax: 150, yMin: 40,  yMax: 120 },
    2: { xMin: 160, xMax: 240, yMin: 40,  yMax: 120 },
    3: { xMin: 50,  xMax: 140, yMin: 160, yMax: 240 },
    4: { xMin: 160, xMax: 240, yMin: 160, yMax: 240 },
    5: { xMin: 310, xMax: 440, yMin: 280, yMax: 400 },
    6: { xMin: 500, xMax: 620, yMin: 270, yMax: 370 },
    7: { xMin: 630, xMax: 770, yMin: 270, yMax: 390 },
    8: { xMin: 310, xMax: 420, yMin: 460, yMax: 580 },
  };

  const getRoomArea = (roomId) => {
    const room = rooms.find(r => r.id === roomId);
    return room?.area || null; // return a number
  };

  useEffect(() => {
    fetchData();
  }, [user]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const roomsData = await apiService.fetchRooms();
      if (roomsData.success) setRooms(roomsData.data);

      const sensorsData = await apiService.fetchSensors(user);
      if (sensorsData.success) setSensors(sensorsData.data);

      // Fetch areas for edit modal
      const areasData = await apiService.fetchAreas();
      if (areasData.success) setAreas(areasData.data);
    } catch (error) {
      console.error('Error:', error);
      setMessage('Error loading data');
    } finally {
      setLoading(false);
    }
  };

  const handleAddSensor = async (sensorData) => {
    try {
      setLoading(true);
      console.log("🛰️ Sending sensor:", sensorData);
      
      const data = await apiService.addSensor(user, sensorData);
      if (data.success) {
        setMessage(`✅ Sensor ${sensorData.id} added successfully!`);
        setShowAddModal(false);
        fetchData(); // Refresh data
      } else {
        setMessage(`❌ Error: ${data.message}`);
      }
    } catch (error) {
      console.error('Error adding sensor:', error);
      setMessage('❌ Error adding sensor');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateSensor = async (sensorData) => {
    try {
      setLoading(true);
      const data = await apiService.updateSensor(user, sensorData);
      if (data.success) {
        setMessage(`✅ Sensor ${sensorData.id} updated successfully!`);
        setEditSensor(null);
        // fetchData refreshes all sensors (and rooms) from the server
        fetchData();
      } else {
        setMessage(`❌ Error: ${data.message}`);
      }
    } catch (error) {
      setMessage('❌ Error updating sensor');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteSensor = async (sensorId) => {
    if (!window.confirm(`Are you sure you want to delete sensor ${sensorId}?`)) {
      return;
    }

    try {
      setLoading(true);
      const data = await apiService.deleteSensor(user, sensorId);
      if (data.success) {
        setMessage(`✅ Sensor ${sensorId} deleted successfully!`);
        fetchData(); // Refresh data
      } else {
        setMessage(`❌ Error: ${data.message}`);
      }
    } catch (error) {
      console.error('Error deleting sensor:', error);
      setMessage('❌ Error deleting sensor');
    } finally {
      setLoading(false);
    }
  };

  // --- Add Room handler ---
  const handleAddRoom = async (roomData) => {
    try {
      setLoading(true);
      const data = await apiService.addRoom(user, roomData);
      if (data.success) {
        setMessage(`✅ Room added successfully!`);
        setShowAddRoomModal(false);
        // Update the room list immediately (without fetchData)
        setRooms(prevRooms => {
          // If the room already exists (e.g. update), update it, otherwise add
          if (prevRooms.some(r => r.id === data.data.id)) {
            return prevRooms.map(r => r.id === data.data.id ? data.data : r);
          }
          return [...prevRooms, data.data];
        });
      } else {
        setMessage(`❌ Error: ${data.message || (data.errors && data.errors.join(', '))}`);
      }
    } catch (error) {
      setMessage('❌ Error adding room');
    } finally {
      setLoading(false);
    }
  };

  // --- Update Room handler ---
  const handleUpdateRoom = async (roomId, roomData) => {
    setLoading(true);
    try {
      const data = await apiService.updateRoom(user, roomId, roomData);
      if (data.success) {
        setMessage(`✅ Room updated successfully!`);
        setEditRoom(null);
        // Make sure fetchData finishes before closing the modal
        await fetchData();
      } else {
        setMessage(`❌ Error: ${data.message || (data.errors && data.errors.join(', '))}`);
      }
    } catch (error) {
      setMessage('❌ Error updating room');
    } finally {
      setLoading(false);
    }
  };

  // --- Delete Room handler ---
  const handleDeleteRoom = async (roomId) => {
    if (!window.confirm(`Are you sure you want to delete room ${roomId}? Sensors (if exist) will remain without a room.`)) {
      return;
    }
    try {
      setLoading(true);
      const data = await apiService.deleteRoom(user, roomId);
      if (data.success) {
        setMessage(`✅ Room ${roomId} deleted successfully!`);
        // Remove the room from the list immediately (without fetchData)
        setRooms(prevRooms => prevRooms.filter(r => r.id !== roomId));
      } else {
        setMessage(`❌ Error: ${data.message}`);
      }
    } catch (error) {
      setMessage('❌ Error deleting room');
    } finally {
      setLoading(false);
    }
  };

  // Auto-hide message after 3 seconds
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => setMessage(''), 3000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  // Add function to handle sensor click on the map
  const handleSensorClick = (sensor) => {
    setSelectedSensor(sensor);
    setMessage(`📡 Selected sensor: ${sensor.id} - Status: ${sensor.status} - Room: ${sensor.room_id || 'N/A'}`);
  };

  const handleEditSensor = (sensor) => {
    setEditSensor(sensor);
    setShowEditModal(true);
  };

  // Example: Show rooms in building S001, floor 2
  const filteredRooms = rooms.filter(room => room.area_name === 'S001' && room.floor === 2);

  return (
    <div>
      <Header user={user} onLogout={onLogout} />
      
      {/* Main layout: left side (all content), right side (map) */}
      <div
        style={{
          display: 'flex',
          gap: '24px',
          padding: '24px',
          minHeight: 'calc(100vh - 80px)',
          alignItems: 'flex-start',
          direction: 'ltr',
        }}
      >
        {/* Left side: all content except the map */}
        <div
          style={{
            flex: 1,
            minWidth: 0,
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
            paddingLeft: '6px',
            paddingRight: '6px',
            boxSizing: 'border-box',
            fontSize: '0.93em',
            maxWidth: showMap ? 'calc(100vw - 940px)' : '100%',
            transition: 'max-width 0.3s',
          }}
        >
          {/* Show "Show Map" button if map is hidden */}
          {!showMap && (
            <button
              style={{
                alignSelf: 'flex-end',
                marginBottom: '12px',
                padding: '8px 18px',
                background: '#2196F3',
                color: '#fff',
                border: 'none',
                borderRadius: '6px',
                fontWeight: 'bold',
                cursor: 'pointer',
                fontSize: '1em',
                boxShadow: '0 1px 4px rgba(0,0,0,0.07)'
              }}
              onClick={() => setShowMap(true)}
            >
              Show Map
            </button>
          )}
          <MessageBanner message={message} />
          <StatsCards sensors={sensors} rooms={rooms} />
          <AreasOverview rooms={rooms} sensors={sensors} />
          <SensorsSection
            sensors={sensors}
            user={user}
            onAddSensor={() => setShowAddModal(true)}
            onEditSensor={handleEditSensor}
            onDeleteSensor={handleDeleteSensor}
            getFullRoomLabel={getFullRoomLabel}
          />
          <RoomsSection
            rooms={rooms}
            user={user}
            onAddRoom={() => setShowAddRoomModal(true)}
            onDeleteRoom={handleDeleteRoom}
            openEditModal={setEditRoom}
          />
        </div>

        {/* Right side: map only (show only if showMap is true) */}
        {showMap && (
          <div
            style={{
              width: '100%',
              maxWidth: '900px',
              minWidth: '600px',
              flexShrink: 0,
              position: 'sticky',
              top: '24px',
              height: 'fit-content',
              background: '#fff',
              borderRadius: '12px',
              boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
              overflow: 'hidden',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <MapSection
              showMap={showMap}
              onToggleMap={() => setShowMap(false)}
              sensors={sensors}
              rooms={rooms}
              onSensorClick={handleSensorClick}
              onMapClick={
                user?.role === 'admin'
                  ? (x, y) => {
                      setAddSensorXY({ x, y });
                      setShowAddModal(true);
                    }
                  : undefined
              }
              onAddRoomFromMap={
                user?.role === 'admin'
                  ? ({ x, y }) => {
                      setShowAddRoomModal(true);
                      setAddRoomXY({ x, y });
                    }
                  : undefined
              }
            />
          </div>
        )}
      </div>

      {/* Add Sensor Modal */}
      <AddSensorModal
        isOpen={showAddModal}
        onClose={() => {
          setShowAddModal(false);
          setAddSensorXY(null);
        }}
        onSave={async (sensorData) => {
          await handleAddSensor(sensorData); // Save to server
          setShowAddModal(false);
          setAddSensorXY(null);
          fetchData(); // Refresh sensors from UI and database
        }}
        rooms={rooms}
        sensors={sensors}
        initialX={addSensorXY?.x}
        initialY={addSensorXY?.y}
      />

      {/* Edit Sensor Modal */}
      <EditSensorModal
        isOpen={!!editSensor}
        onClose={() => setEditSensor(null)}
        onSave={handleUpdateSensor}
        sensor={editSensor}
        rooms={rooms}
        sensors={sensors}
      />

      {/* --- Add Room Modal --- */}
      <AddRoomModal
        isOpen={showAddRoomModal}
        onClose={() => {
          setShowAddRoomModal(false);
          setAddRoomXY(null);
        }}
        onSave={handleAddRoom}
        user={user}
        initialX={addRoomXY?.x}
        initialY={addRoomXY?.y}
      />

      <EditRoomModal
        open={!!editRoom}
        onClose={() => setEditRoom(null)}
        room={editRoom}
        areas={areas}
        onSave={roomData => handleUpdateRoom(editRoom.id, roomData)}
        user={user}
      />
    </div>
  );
}

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem('activeRoomsUser');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (error) {
        localStorage.removeItem('activeRoomsUser');
      }
    }
    setLoading(false);
  }, []);

  const handleLogin = (userData) => {
    localStorage.setItem('activeRoomsUser', JSON.stringify(userData));
    setUser(userData);
  };

  const handleLogout = () => {
    localStorage.removeItem('activeRoomsUser');
    setUser(null);
  };

  if (loading) {
    return <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh'}}>
      <div>🔄 Loading...</div>
    </div>;
  }

  return (
    <div className="App">
      {user ? (
        <Dashboard user={user} onLogout={handleLogout} />
      ) : (
        <Login onLogin={handleLogin} />
      )}
    </div>
  );
}

export default App;
