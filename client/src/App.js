import React, { useState, useEffect } from 'react';
import './App.css';

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
const AddSensorModal = ({ isOpen, onClose, onSave, rooms }) => {
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
              placeholder="S013"
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
                <option key={room.id} value={room.id}>{room.id} - {room.description}</option>
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

// Enhanced Dashboard Component with Admin Features
const Dashboard = ({ user, onLogout }) => {
  const [sensors, setSensors] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

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
        <div style={{display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', marginBottom: '30px'}}>
          <div style={{background: '#4CAF50', color: 'white', padding: '20px', borderRadius: '8px', textAlign: 'center'}}>
            <h3>{sensors.filter(s => s.status === 'available').length}</h3>
            <p>Available Rooms</p>
          </div>
          <div style={{background: '#FF5722', color: 'white', padding: '20px', borderRadius: '8px', textAlign: 'center'}}>
            <h3>{sensors.filter(s => s.status === 'occupied').length}</h3>
            <p>Occupied Rooms</p>
          </div>
          <div style={{background: '#2196F3', color: 'white', padding: '20px', borderRadius: '8px', textAlign: 'center'}}>
            <h3>{rooms.length}</h3>
            <p>Total Rooms</p>
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
                🏠 {room.id} - {room.description}
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Add Sensor Modal */}
      <AddSensorModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSave={handleAddSensor}
        rooms={rooms}
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