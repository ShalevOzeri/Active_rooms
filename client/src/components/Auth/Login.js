import React, { useState } from 'react';

const Login = ({ onLogin }) => {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('http://localhost:3000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (data.success) {
        const userWithCredentials = {
          ...data.user,
          credentials: formData
        };
        localStorage.setItem('activeRoomsUser', JSON.stringify(userWithCredentials));
        onLogin(userWithCredentials);
      } else {
        setError(data.message || 'Login failed');
      }
    } catch (error) {
      setError('Server connection failed');
      console.error('Login error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = (role) => {
    const credentials = role === 'admin' 
      ? { username: 'admin', password: 'admin123' }
      : { username: 'user', password: 'user123' };
    setFormData(credentials);
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <h1>🏠 Active Rooms</h1>
          <p>Room Occupancy Detection System</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Username:</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
              disabled={loading}
              placeholder="Enter username"
            />
          </div>

          <div className="form-group">
            <label>Password:</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              disabled={loading}
              placeholder="Enter password"
            />
          </div>

          {error && (
            <div className="error-message">
              ⚠️ {error}
            </div>
          )}

          <button 
            type="submit" 
            className="login-button"
            disabled={loading || !formData.username || !formData.password}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <div className="demo-section">
          <p>Demo Accounts:</p>
          <div className="demo-buttons">
            <button 
              type="button" 
              className="demo-button admin"
              onClick={() => handleDemoLogin('admin')}
              disabled={loading}
            >
              👑 Admin Demo
            </button>
            <button 
              type="button" 
              className="demo-button user"
              onClick={() => handleDemoLogin('user')}
              disabled={loading}
            >
              👤 User Demo
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;