import React, { useState, useEffect } from 'react';
import './App.css';
import Map from './components/Map';

// Simple Login Component
const Login = ({ onLogin }) => {
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch('http://localhost:3001/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await response.json();
      if (data.success) {
        onLogin({ ...data.user, credentials: formData });
      } else {
        setError(data.message || 'Login failed');
      }
    } catch (error) {
      setError('Server connection failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h1>🏠 Active Rooms</h1>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Username"
            value={formData.username}
            onChange={(e) => setFormData({...formData, username: e.target.value})}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={formData.password}
            onChange={(e) => setFormData({...formData, password: e.target.value})}
            required
          />
          {error && <div className="error-message">{error}</div>}
          <button type="submit" disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
        <div style={{marginTop: '20px'}}>
          <button onClick={() => setFormData({username: 'admin', password: 'admin123'})}>
            👑 Admin Demo
          </button>
          <button onClick={() => setFormData({username: 'user', password: 'user123'})}>
            👤 User Demo
          </button>
        </div>
      </div>
    </div>
  );
};

// Add Sensor Modal Component
const AddSensorModal = ({ isOpen, onClose, onSave, rooms, sensors }) => {
  const [sensorData, setSensorData] = useState({
    id: '',
    x: '',
    y: '',
    room_id: '',
    status: 'available'
  });
  const [errors, setErrors] = useState({});

  // Function to handle room selection change in Add Sensor modal
  const handleRoomChangeAdd = (e) => {
    const selectedRoomId = e.target.value;
    
    if (selectedRoomId) {
      // Find the selected room and get its coordinates
      const selectedRoom = rooms.find(room => room.id === selectedRoomId);
      
      if (selectedRoom && selectedRoom.x !== null && selectedRoom.y !== null) {
        // Update sensor data with room coordinates
        setSensorData({
          ...sensorData, 
          room_id: selectedRoomId,
          x: selectedRoom.x,
          y: selectedRoom.y
        });
      } else {
        // Just update room_id if room has no coordinates
        setSensorData({...sensorData, room_id: selectedRoomId});
      }
    } else {
      // No room selected
      setSensorData({...sensorData, room_id: selectedRoomId});
    }
  };

  const validateData = () => {
    const newErrors = {};

    // ID validation
    if (!sensorData.id) {
      newErrors.id = 'Sensor ID is required';
    } else if (!/^S\d{3}$/.test(sensorData.id)) {
      newErrors.id = 'ID must be in format S001, S002, ...';
    } else if (sensors.some(sensor => sensor.id === sensorData.id)) {
      newErrors.id = 'Sensor ID already exists';
    }

    // Room validation
    if (!sensorData.room_id) {
      newErrors.room_id = 'Room selection is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateData()) {
      // Get coordinates from selected room
      const selectedRoom = rooms.find(room => room.id === sensorData.room_id);
      const dataToSend = {
        ...sensorData,
        x: selectedRoom ? selectedRoom.x : 0,
        y: selectedRoom ? selectedRoom.y : 0
      };
      
      onSave(dataToSend);
      setSensorData({ id: '', x: '', y: '', room_id: '', status: 'available' });
      setErrors({});
    }
  };

  const handleClose = () => {
    setSensorData({ id: '', x: '', y: '', room_id: '', status: 'available' });
    setErrors({});
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0,0,0,0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000
    }} onClick={handleClose}>
      <div style={{
        background: 'white',
        padding: '25px',
        borderRadius: '12px',
        maxWidth: '450px',
        width: '90%'
      }} onClick={(e) => e.stopPropagation()}>
        <h3 style={{ margin: '0 0 20px 0', color: '#333' }}>➕ Add New Sensor</h3>
        
        <form onSubmit={handleSubmit}>
       //   {/* Sensor ID */}
          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
              Sensor ID: <span style={{ color: 'red' }}>*</span>
            </label>
            <input
              type="text"
              value={sensorData.id}
              onChange={(e) => setSensorData({...sensorData, id: e.target.value.toUpperCase()})}
              placeholder="S001"
              required
              style={{
                width: '100%',
                padding: '8px 12px',
                border: `2px solid ${errors.id ? '#f44336' : '#ddd'}`,
                borderRadius: '6px',
                fontSize: '14px'
              }}
            />
            {errors.id && <small style={{ color: '#f44336' }}>{errors.id}</small>}
          </div>

          {/* Room Selection */}
          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
              Room: <span style={{ color: 'red' }}>*</span>
            </label>
            <select
              value={sensorData.room_id}
              onChange={handleRoomChangeAdd}
              style={{
                width: '100%',
                padding: '8px 12px',
                border: '2px solid #ddd',
                borderRadius: '6px',
                fontSize: '14px'
              }}
            >
              <option value="">Select Room *</option>
              {rooms.map(room => (
                <option key={room.id} value={room.id}>
                  {room.room_name} - {room.description}
                  {room.x !== null && room.y !== null ? ` (${room.x}, ${room.y})` : ' (No coords)'}
                  {sensors.some(sensor => sensor.room_id === room.id) ? ' [Occupied]' : ''}
                </option>
              ))}
            </select>
            {sensorData.room_id && (
              <small style={{ color: '#666', fontSize: '12px', marginTop: '5px', display: 'block' }}>
                💡 Coordinates automatically updated from selected room
              </small>
            )}
            {errors.room_id && <span style={{ color: 'red', fontSize: '12px' }}>{errors.room_id}</span>}
          </div>

          {/* Status */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
              Status:
            </label>
            <select
              value={sensorData.status}
              onChange={(e) => setSensorData({...sensorData, status: e.target.value})}
              style={{
                width: '100%',
                padding: '8px 12px',
                border: '2px solid #ddd',
                borderRadius: '6px',
                fontSize: '14px'
              }}
            >
              <option value="available">Available</option>
              <option value="occupied">Occupied</option>
              <option value="error">Error</option>
            </select>
          </div>

          {/* Coordinate Helper */}
          <div style={{ 
            background: '#f0f8ff', 
            padding: '10px', 
            borderRadius: '6px', 
            marginBottom: '20px',
            fontSize: '12px',
            color: '#666'
          }}>
            💡 <strong>Tip:</strong> Map coordinates: X (0-800), Y (0-600). 
            Top-left is (0,0), bottom-right is (800,600).
          </div>

          {/* Buttons */}
          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              type="button"
              onClick={handleClose}
              style={{
                flex: 1,
                padding: '10px',
                background: '#f44336',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer'
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              style={{
                flex: 1,
                padding: '10px',
                background: '#4CAF50',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer'
              }}
            >
              Add Sensor
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Edit Sensor Modal Component
const EditSensorModal = ({ isOpen, onClose, onSave, sensor, rooms, sensors }) => {
  const [sensorData, setSensorData] = useState(sensor || {});
  const [errors, setErrors] = useState({});

  useEffect(() => {
    setSensorData(sensor || {});
  }, [sensor]);

  // Function to handle room selection change
  const handleRoomChange = (e) => {
    const selectedRoomId = e.target.value;
    
    if (selectedRoomId) {
      // Find the selected room and get its coordinates
      const selectedRoom = rooms.find(room => room.id === selectedRoomId);
      
      if (selectedRoom && selectedRoom.x !== null && selectedRoom.y !== null) {
        // Update sensor data with room coordinates
        setSensorData({
          ...sensorData, 
          room_id: selectedRoomId,
          x: selectedRoom.x,
          y: selectedRoom.y
        });
      } else {
        // Just update room_id if room has no coordinates
        setSensorData({...sensorData, room_id: selectedRoomId});
      }
    } else {
      // No room selected
      setSensorData({...sensorData, room_id: selectedRoomId});
    }
  };

  const validateData = () => {
    const newErrors = {};
    
    // ID validation
    if (!sensorData.id.trim()) {
      newErrors.id = 'Sensor ID is required';
    } else if (!/^S\d{3}$/.test(sensorData.id)) {
      newErrors.id = 'ID format should be S001, S002, etc.';
    }
    
    // X validation
    const x = parseInt(sensorData.x);
    if (isNaN(x) || x < 0 || x > 800) {
      newErrors.x = 'X must be between 0-800';
    }
    
    // Y validation
    const y = parseInt(sensorData.y);
    if (isNaN(y) || y < 0 || y > 600) {
      newErrors.y = 'Y must be between 0-600';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateData()) {
      // Convert to numbers before sending
      const dataToSend = {
        ...sensorData,
        x: parseInt(sensorData.x),
        y: parseInt(sensorData.y)
      };
      
      onSave(dataToSend);
      setSensorData({ id: '', x: '', y: '', room_id: '', status: 'available' });
      setErrors({});
    }
  };

  const handleClose = () => {
    setSensorData({ id: '', x: '', y: '', room_id: '', status: 'available' });
    setErrors({});
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0,0,0,0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000
    }} onClick={handleClose}>
      <div style={{
        background: 'white',
        padding: '25px',
        borderRadius: '12px',
        maxWidth: '450px',
        width: '90%'
      }} onClick={(e) => e.stopPropagation()}>
        <h3 style={{ margin: '0 0 20px 0', color: '#333' }}>✏️ Edit Sensor</h3>
        
        <form onSubmit={handleSubmit}>
          {/* Sensor ID */}
          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
              Sensor ID: <span style={{ color: 'red' }}>*</span>
            </label>
            <input
              type="text"
              value={sensorData.id}
              onChange={(e) => setSensorData({...sensorData, id: e.target.value.toUpperCase()})}
              placeholder="S001"
              required
              style={{
                width: '100%',
                padding: '8px 12px',
                border: `2px solid ${errors.id ? '#f44336' : '#ddd'}`,
                borderRadius: '6px',
                fontSize: '14px'
              }}
            />
            {errors.id && <small style={{ color: '#f44336' }}>{errors.id}</small>}
          </div>

          {/* Coordinates */}
          <div style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                Y Position: <span style={{ color: 'red' }}>*</span>
              </label>
              <input
                type="number"
                min="0"
                max="600"
                value={sensorData.y}
                onChange={(e) => setSensorData({...sensorData, y: e.target.value})}
                placeholder="0-600"
                required
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  border: `2px solid ${errors.y ? '#f44336' : '#ddd'}`,
                  borderRadius: '6px',
                  fontSize: '14px'
                }}
              />
              {errors.y && <small style={{ color: '#f44336' }}>{errors.y}</small>}
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                X Position: <span style={{ color: 'red' }}>*</span>
              </label>
              <input
                type="number"
                min="0"
                max="800"
                value={sensorData.x}
                onChange={(e) => setSensorData({...sensorData, x: e.target.value})}
                placeholder="0-800"
                required
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  border: `2px solid ${errors.x ? '#f44336' : '#ddd'}`,
                  borderRadius: '6px',
                  fontSize: '14px'
                }}
              />
              {errors.x && <small style={{ color: '#f44336' }}>{errors.x}</small>}
            </div>
          </div>

          {/* Room Selection */}
          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
              Room:
            </label>
            <select
              value={sensorData.room_id}
              onChange={handleRoomChange}
              style={{
                width: '100%',
                padding: '8px 12px',
                border: '2px solid #ddd',
                borderRadius: '6px',
                fontSize: '14px'
              }}
            >
              <option value="">Select Room (Optional)</option>
              {rooms.map(room => (
                <option key={room.id} value={room.id}>
                  {room.room_name} - {room.description} 
                  {room.x !== null && room.y !== null ? ` (${room.x}, ${room.y})` : ' (No coords)'}
                </option>
              ))}
            </select>
            {sensorData.room_id && (
              <small style={{ color: '#666', fontSize: '12px', marginTop: '5px', display: 'block' }}>
                💡 Coordinates automatically updated from selected room
              </small>
            )}
          </div>

          {/* Status */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
              Status:
            </label>
            <select
              value={sensorData.status}
              onChange={(e) => setSensorData({...sensorData, status: e.target.value})}
              style={{
                width: '100%',
                padding: '8px 12px',
                border: '2px solid #ddd',
                borderRadius: '6px',
                fontSize: '14px'
              }}
            >
              <option value="available">Available</option>
              <option value="occupied">Occupied</option>
              <option value="error">Error</option>
            </select>
          </div>

          {/* Coordinate Helper */}
          <div style={{ 
            background: '#f0f8ff', 
            padding: '10px', 
            borderRadius: '6px', 
            marginBottom: '20px',
            fontSize: '12px',
            color: '#666'
          }}>
            💡 <strong>Tip:</strong> Map coordinates: X (0-800), Y (0-600). 
            Top-left is (0,0), bottom-right is (800,600).
          </div>

          {/* Buttons */}
          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              type="button"
              onClick={handleClose}
              style={{
                flex: 1,
                padding: '10px',
                background: '#f44336',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer'
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              style={{
                flex: 1,
                padding: '10px',
                background: '#4CAF50',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer'
              }}
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

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
      
      const roomsRes = await fetch('http://localhost:3001/api/rooms');
      const roomsData = await roomsRes.json();
      if (roomsData.success) setRooms(roomsData.data);

      const sensorsRes = await fetch('http://localhost:3001/api/sensors', {
        headers: {
          'username': user.credentials.username,
          'password': user.credentials.password
        }
      });
      const sensorsData = await sensorsRes.json();
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
      
      const response = await fetch('http://localhost:3001/api/sensors', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'username': user.credentials.username,
          'password': user.credentials.password
        },
        body: JSON.stringify(sensorData)
      });

      const data = await response.json();
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
      const response = await fetch(`http://localhost:3001/api/sensors/${sensorData.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'username': user.credentials.username,
          'password': user.credentials.password
        },
        body: JSON.stringify(sensorData)
      });
      const data = await response.json();
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
      const response = await fetch(`http://localhost:3001/api/sensors/${sensorId}`, {
        method: 'DELETE',
        headers: {
          'username': user.credentials.username,
          'password': user.credentials.password
        }
      });

      const data = await response.json();
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
      <header style={{background: 'white', padding: '20px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)'}}>
        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
          <h1>🏠 Active Rooms Detection</h1>
          <div>
            <span>Welcome, {user.username} 
              {user.role === 'admin' && <span style={{
                background: '#f44336',
                color: 'white',
                padding: '2px 8px',
                borderRadius: '12px',
                fontSize: '12px',
                marginLeft: '8px'
              }}>👑 Admin</span>}
            </span>
            <button onClick={onLogout} style={{
              marginLeft: '10px',
              padding: '8px 16px',
              background: '#f44336',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}>
              Logout
            </button>
          </div>
        </div>
      </header>
      
      <main style={{padding: '20px'}}>
        {/* Message Banner */}
        {message && (
          <div style={{
            background: message.includes('✅') ? '#d4edda' : '#f8d7da',
            color: message.includes('✅') ? '#155724' : '#721c24',
            padding: '12px 20px',
            borderRadius: '6px',
            marginBottom: '20px',
            border: `1px solid ${message.includes('✅') ? '#c3e6cb' : '#f5c6cb'}`
          }}>
            {message}
          </div>
        )}

        {/* Stats Cards */}
        <div style={{
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', 
          gap: '20px', 
          marginBottom: '30px'
        }}>
          <div style={{background: '#4CAF50', color: 'white', padding: '25px', borderRadius: '8px', textAlign: 'center', boxShadow: '0 4px 8px rgba(0,0,0,0.1)'}}>
            <div style={{fontSize: '32px', marginBottom: '12px'}}>✅</div>
            <h3 style={{margin: '0 0 8px 0', fontSize: '40px', fontWeight: 'bold'}}>{sensors.filter(s => s.status === 'available').length}</h3>
            <p style={{margin: 0, fontSize: '18px', fontWeight: '500'}}>Available Rooms</p>
          </div>
          
          <div style={{background: '#FF5722', color: 'white', padding: '25px', borderRadius: '8px', textAlign: 'center', boxShadow: '0 4px 8px rgba(0,0,0,0.1)'}}>
            <div style={{fontSize: '32px', marginBottom: '12px'}}>🔴</div>
            <h3 style={{margin: '0 0 8px 0', fontSize: '40px', fontWeight: 'bold'}}>{sensors.filter(s => s.status === 'occupied').length}</h3>
            <p style={{margin: 0, fontSize: '18px', fontWeight: '500'}}>Occupied Rooms</p>
          </div>
          
          <div style={{background: '#FFC107', color: 'white', padding: '25px', borderRadius: '8px', textAlign: 'center', fontWeight: 'bold', boxShadow: '0 4px 8px rgba(0,0,0,0.1)'}}>
            <div style={{fontSize: '32px', marginBottom: '12px'}}>⚠️</div>
            <h3 style={{margin: '0 0 8px 0', fontSize: '40px', fontWeight: 'bold'}}>{sensors.filter(s => s.status === 'error').length}</h3>
            <p style={{margin: 0, fontSize: '18px', fontWeight: '500'}}>Error Rooms</p>
          </div>
          
          <div style={{background: '#2196F3', color: 'white', padding: '25px', borderRadius: '8px', textAlign: 'center', boxShadow: '0 4px 8px rgba(0,0,0,0.1)'}}>
            <div style={{fontSize: '32px', marginBottom: '12px'}}>🏠</div>
            <h3 style={{margin: '0 0 8px 0', fontSize: '40px', fontWeight: 'bold'}}>{rooms.length}</h3>
            <p style={{margin: 0, fontSize: '18px', fontWeight: '500'}}>Total Rooms</p>
          </div>
        </div>

        {/* Areas Section */}
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

        {/* Sensors Section */}
        <div style={{background: 'white', padding: '20px', borderRadius: '8px', marginBottom: '20px'}}>
          <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px'}}>
            <h2>Sensors ({sensors.length})</h2>
            <div style={{display: 'flex', gap: '10px'}}>
              <button
                onClick={fetchData}
                disabled={loading}
                style={{
                  padding: '8px 16px',
                  background: '#2196F3',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: loading ? 'not-allowed' : 'pointer'
                }}
              >
                {loading ? '🔄 Loading...' : '🔄 Refresh'}
              </button>
              
              {user.role === 'admin' && (
                <button
                  onClick={() => setShowAddModal(true)}
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
          </div>
          
          <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '15px'}}>
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
                      onClick={() => handleEditSensor(sensor)}
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
                      onClick={() => handleDeleteSensor(sensor.id)}
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

        {/* Rooms Section */}
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
                🏠 {room.room_name} - {room.description} <br />
                <span style={{fontSize: '12px', color: '#eee'}}>Floor: {room.floor}</span> <br />
                <span style={{fontSize: '12px'}}> 🏢  {room.area_name || 'N/A'}</span>

              </div>
            ))}
          </div>
        </div>

        {/* The map moved here - bottom of dashboard */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '20px'
        }}>
          <h2>🗺️ Campus Map</h2>
          <button
            onClick={() => setShowMap(!showMap)}
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

        {/* Map component at the bottom */}
        {showMap && (
          <Map 
            sensors={sensors} 
            rooms={rooms} 
            onSensorClick={handleSensorClick}
          />
        )}
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