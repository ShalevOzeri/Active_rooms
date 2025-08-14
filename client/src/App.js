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

// Enhanced Dashboard Component with Admin Features
const Dashboard = ({ user, onLogout }) => {
  const [sensors, setSensors] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [areas, setAreas] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [selectedSensor, setSelectedSensor] = useState(null);
  const [showMap, setShowMap] = useState(true);
  const [editSensor, setEditSensor] = useState(null);
  const [allowedBounds, setAllowedBounds] = useState({
    xMin: 0,
    xMax: 800,
    yMin: 0,
    yMax: 600,
  });

  const getFullRoomLabel = (roomId) => {
    const room = rooms.find(r => r.id === roomId);
    if (!room) return 'N/A';
      return `${room.room_name} (${room.area || 'Unknown'})`;
  };
  {/* Define area bounds for sensor placement on the map */}
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
      console.log("🛰️ שולחת את הסנסור:", sensorData);
      
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

  // Auto-hide message after 3 seconds
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => setMessage(''), 3000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  // Add function to handle sensor click on map
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
      
      <main style={{padding: '20px'}}>
        {/* Message Banner */}
        <MessageBanner message={message} />

        {/* Stats Cards */}
        <StatsCards sensors={sensors} rooms={rooms} />

        {/* Areas Section */}
        <AreasOverview rooms={rooms} sensors={sensors} />

        {/* Sensors Section */}
        <SensorsSection 
          sensors={sensors}
          user={user}
          onAddSensor={() => setShowAddModal(true)}
          onEditSensor={handleEditSensor}
          onDeleteSensor={handleDeleteSensor}
          getFullRoomLabel={getFullRoomLabel}
        />

        {/* Rooms Section */}
        <RoomsSection rooms={rooms} />

        {/* Map Section */}
        <MapSection 
          showMap={showMap}
          onToggleMap={() => setShowMap(!showMap)}
          sensors={sensors}
          rooms={rooms}
          onSensorClick={handleSensorClick}
        />
      </main>

      {/* Add Sensor Modal */}
      <AddSensorModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSave={handleAddSensor}
        rooms={rooms}
        sensors={sensors}
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
    </div>
  );
};

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