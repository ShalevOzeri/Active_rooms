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
              //onChange={(e) => setSensorData({...sensorData, room_id: e.target.value})}
              onChange={(e) => {
                const selectedRoomId = parseInt(e.target.value);
                const area = getRoomArea(selectedRoomId);
                const bounds = areaBounds[area] || { xMin: 0, xMax: 800, yMin: 0, yMax: 600 };

                setSensorData(prev => ({
                  ...prev,
                  room_id: selectedRoomId,
                  x: bounds.xMin,
                  y: bounds.yMin
                }));

                setAllowedBounds(bounds);
              }}
              style={{
                width: '100%',
                padding: '8px 12px',
                border: '2px solid #ddd',
                borderRadius: '6px',
                fontSize: '14px'
              }}
            >
              <option value="">Select Room (Optional)</option>
              {rooms
              .filter(room => !sensors.some(sensor => sensor.room_id === room.id))
              .map(room => (
              <option key={room.id} value={room.id}>
              {room.room_name} ({room.area_name || 'Unknown'})
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