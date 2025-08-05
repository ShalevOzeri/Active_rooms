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
      const response = await fetch('http://localhost:3000/api/auth/login', {
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

  const validateData = () => {
    const newErrors = {};

    // בדיקת ID
    if (!sensorData.id) {
      newErrors.id = 'Sensor ID is required';
    } else if (!/^S\d{3}$/.test(sensorData.id)) {
      newErrors.id = 'ID must be in format S001, S002, ...';
    } else if (sensors.some(sensor => sensor.id === sensorData.id)) {
      newErrors.id = 'Sensor ID already exists';
    }

    // בדיקת X
    const x = parseInt(sensorData.x);
    if (isNaN(x) || x < 0 || x > 800) {
      newErrors.x = 'X must be between 0-800';
    }

    // בדיקת Y
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
      // המר למספרים לפני שליחה
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
        <h3 style={{ margin: '0 0 20px 0', color: '#333' }}>➕ Add New Sensor</h3>
        
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
          </div>

          {/* Room Selection */}
          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
              Room:
            </label>
            <select
              value={sensorData.room_id}
              onChange={(e) => setSensorData({...sensorData, room_id: e.target.value})}
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
                  {room.id} - {room.description}
                </option>
              ))}
            </select>
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

  const validateData = () => {
    const newErrors = {};
    
    // בדיקת ID
    if (!sensorData.id.trim()) {
      newErrors.id = 'Sensor ID is required';
    } else if (!/^S\d{3}$/.test(sensorData.id)) {
      newErrors.id = 'ID format should be S001, S002, etc.';
    }
    
    // בדיקת X
    const x = parseInt(sensorData.x);
    if (isNaN(x) || x < 0 || x > 800) {
      newErrors.x = 'X must be between 0-800';
    }
    
    // בדיקת Y
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
      // המר למספרים לפני שליחה
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
          </div>

          {/* Room Selection */}
          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
              Room:
            </label>
            <select
              value={sensorData.room_id}
              onChange={(e) => setSensorData({...sensorData, room_id: e.target.value})}
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
                  {room.id} - {room.description}
                </option>
              ))}
            </select>
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

  useEffect(() => {
    fetchData();
  }, [user]);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      const roomsRes = await fetch('http://localhost:3000/api/rooms');
      const roomsData = await roomsRes.json();
      if (roomsData.success) setRooms(roomsData.data);

      const sensorsRes = await fetch('http://localhost:3000/api/sensors', {
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
      const response = await fetch('http://localhost:3000/api/sensors', {
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
      const response = await fetch(`http://localhost:3000/api/sensors/${sensorData.id}`, {
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
      const response = await fetch(`http://localhost:3000/api/sensors/${sensorId}`, {
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

  // הוסף פונקציה לטיפול בלחיצה על חיישן במפה
  const handleSensorClick = (sensor) => {
    setSelectedSensor(sensor);
    setMessage(`📡 Selected sensor: ${sensor.id} - Status: ${sensor.status} - Room: ${sensor.room_id || 'N/A'}`);
  };

  const handleEditSensor = (sensor) => {
    setEditSensor(sensor);
    setShowEditModal(true);
  };

  // לדוג' הצגת חדרים בבניין S001, קומה 2
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
          <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px'}}>
            {/* קבל רשימה ייחודית של אזורים */}
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
                    {/* כותרת האזור */}
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

                    {/* סטטיסטיקות האזור */}
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

                    {/* רשימת חדרים */}
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
                            key={room.id}
                            style={{
                              background: 'rgba(255,255,255,0.2)',
                              padding: '4px 8px',
                              borderRadius: '12px',
                              fontSize: '12px',
                              border: '1px solid rgba(255,255,255,0.3)'
                            }}
                          >
                            {room.id}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* רשימת חיישנים */}
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

                    {/* רשימת חדרים לפי קומה */}
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
                                    key={room.id}
                                    style={{
                                      background: 'rgba(255,255,255,0.2)',
                                      padding: '4px 8px',
                                      borderRadius: '12px',
                                      fontSize: '12px',
                                      border: '1px solid rgba(255,255,255,0.3)',
                                      marginRight: '4px'
                                    }}
                                  >
                                    {room.id}
                                  </span>
                                ))}
                            </div>
                          ))}
                      </div>
                    </div>
                  </div>
                  
                 );
          })}  
              
            {/* אזור לחדרים ללא אזור מוגדר */}
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
                        key={room.id}
                        style={{
                          background: 'rgba(255,255,255,0.2)',
                          padding: '4px 8px',
                          borderRadius: '12px',
                          fontSize: '12px',
                          border: '1px solid rgba(255,255,255,0.3)'
                        }}
                      >
                        {room.id}
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
                <small>Room: {sensor.room_id || 'N/A'}</small>
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
                key={room.id}
                style={{
                  padding: '15px',
                  borderRadius: '8px',
                  backgroundColor: '#2196F3',
                  color: 'white',
                  textAlign: 'center'
                }}
              >
                🏠 {room.id} - {room.description} <br />
                <span style={{fontSize: '12px', color: '#eee'}}>Floor: {room.floor}</span>
              </div>
            ))}
          </div>
        </div>

        {/* 🗺️ המפה עברה לכאן - תחתית הדשבורד */}
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

        {/* רכיב המפה בתחתית */}
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