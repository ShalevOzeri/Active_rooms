const API_BASE_URL = 'http://localhost:3001/api';

const createAuthHeaders = (user) => ({
  'Content-Type': 'application/json',
  'username': user.credentials.username,
  'password': user.credentials.password
});

const apiService = {
  // Fetch rooms data
  fetchRooms: async () => {
    const response = await fetch(`${API_BASE_URL}/rooms`);
    const data = await response.json();
    return data;
  },

  // Fetch sensors data
  fetchSensors: async (user) => {
    const response = await fetch(`${API_BASE_URL}/sensors`, {
      headers: {
        'username': user.credentials.username,
        'password': user.credentials.password
      }
    });
    const data = await response.json();
    return data;
  },

  // Add new sensor
  addSensor: async (user, sensorData) => {
    const response = await fetch(`${API_BASE_URL}/sensors`, {
      method: 'POST',
      headers: createAuthHeaders(user),
      body: JSON.stringify(sensorData)
    });
    const data = await response.json();
    return data;
  },

  // Update existing sensor
  updateSensor: async (user, sensorData) => {
    const response = await fetch(`${API_BASE_URL}/sensors/${sensorData.id}`, {
      method: 'PUT',
      headers: createAuthHeaders(user),
      body: JSON.stringify(sensorData)
    });
    const data = await response.json();
    return data;
  },

  // Delete sensor
  deleteSensor: async (user, sensorId) => {
    const response = await fetch(`${API_BASE_URL}/sensors/${sensorId}`, {
      method: 'DELETE',
      headers: {
        'username': user.credentials.username,
        'password': user.credentials.password
      }
    });
    const data = await response.json();
    return data;
  },

  // Fetch areas data
  fetchAreas: async () => {
    const response = await fetch(`${API_BASE_URL}/areas`);
    const data = await response.json();
    return data;
  },

  // Add new room
  addRoom: async (user, roomData) => {
    const response = await fetch(`${API_BASE_URL}/rooms`, {
      method: 'POST',
      headers: createAuthHeaders(user),
      body: JSON.stringify(roomData)
    });
    const data = await response.json();
    return data;
  },

  // Delete room (admin only)
  deleteRoom: async (user, roomId) => {
    const response = await fetch(`${API_BASE_URL}/rooms/${roomId}`, {
      method: 'DELETE',
      headers: {
        'username': user.credentials.username,
        'password': user.credentials.password
      }
    });
    const data = await response.json();
    return data;
  }
};

export default apiService;
