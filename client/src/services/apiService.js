
const API_BASE_URL = 'http://localhost:3001/api';

const createAuthHeaders = (user) => ({
  'Content-Type': 'application/json',
  'username': user.credentials.username,
  'password': user.credentials.password
});

const apiService = {
  // --- AREAS ---
  addArea: async (user, areaData) => {
    const response = await fetch(`${API_BASE_URL}/areas`, {
      method: 'POST',
      headers: createAuthHeaders(user),
      body: JSON.stringify(areaData)
    });
    const data = await response.json();
    return data;
  },

  updateArea: async (user, areaId, areaData) => {
    const response = await fetch(`${API_BASE_URL}/areas/${areaId}`, {
      method: 'PUT',
      headers: createAuthHeaders(user),
      body: JSON.stringify(areaData)
    });
    const data = await response.json();
    return data;
  },

  deleteArea: async (user, areaId) => {
    const response = await fetch(`${API_BASE_URL}/areas/${areaId}`, {
      method: 'DELETE',
      headers: createAuthHeaders(user)
    });
    const data = await response.json();
    return data;
  },


  // --- ROOMS ---
  addRoom: async (user, roomData) => {
    const response = await fetch(`${API_BASE_URL}/rooms`, {
      method: 'POST',
      headers: createAuthHeaders(user),
      body: JSON.stringify(roomData)
    });
    const data = await response.json();
    return data;
  },

  updateRoom: async (user, roomId, roomData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/rooms/${roomId}`, {
        method: 'PUT',
        headers: createAuthHeaders(user),
        body: JSON.stringify(roomData)
      });
      const data = await response.json();
      return data;
    } catch (err) {
      return { success: false, message: err.message || 'Network error' };
    }
  },

  deleteRoom: async (user, roomId) => {
    const response = await fetch(`${API_BASE_URL}/rooms/${roomId}`, {
      method: 'DELETE',
      headers: createAuthHeaders(user)
    });
    const data = await response.json();
    return data;
  },

  // --- SENSORS ---
  addSensor: async (user, sensorData) => {
    const response = await fetch(`${API_BASE_URL}/sensors`, {
      method: 'POST',
      headers: createAuthHeaders(user),
      body: JSON.stringify(sensorData)
    });
    const data = await response.json();
    return data;
  },

  updateSensor: async (user, sensorData) => {
    const response = await fetch(`${API_BASE_URL}/sensors/${sensorData.id}`, {
      method: 'PUT',
      headers: createAuthHeaders(user),
      body: JSON.stringify(sensorData)
    });
    const data = await response.json();
    return data;
  },

  deleteSensor: async (user, sensorId) => {
    const response = await fetch(`${API_BASE_URL}/sensors/${sensorId}`, {
      method: 'DELETE',
      headers: createAuthHeaders(user)
    });
    const data = await response.json();
    return data;
  },

  // --- FETCH METHODS ---
  fetchAreas: async () => {
    const response = await fetch(`${API_BASE_URL}/areas`);
    const data = await response.json();
    return data;
  },

  fetchRooms: async () => {
    const response = await fetch(`${API_BASE_URL}/rooms`);
    const data = await response.json();
    return data;
  },

  fetchSensors: async (user) => {
    const response = await fetch(`${API_BASE_URL}/sensors`, {
      headers: createAuthHeaders(user)
    });
    const data = await response.json();
    return data;
  }
};

export default apiService;
