import React, { useState, useEffect } from 'react';
import apiService from '../../services/apiService';

const AddRoomModal = ({ isOpen, onClose, onSave, user }) => {
  const [areas, setAreas] = useState([]);
  const [form, setForm] = useState({
    id: '',
    description: '',
    room_number: '',
    x: '',
    y: '',
    floor: '',
    area_id: ''
  });
  const [errors, setErrors] = useState([]);

  useEffect(() => {
    if (isOpen) {
      apiService.fetchAreas().then(res => {
        if (res.success) setAreas(res.data);
      });
      setForm({
        id: '',
        description: '',
        room_number: '',
        x: '',
        y: '',
        floor: '',
        area_id: ''
      });
      setErrors([]);
    }
  }, [isOpen]);

  const validate = () => {
    const errs = [];
    if (!form.id || form.id.length < 1)
      errs.push('Room ID is required');
    if (!form.description || form.description.length < 2)
      errs.push('Description is required');
    if (!form.room_number)
      errs.push('Room number is required');
    if (form.x === '' || isNaN(form.x))
      errs.push('X coordinate is required');
    if (form.y === '' || isNaN(form.y))
      errs.push('Y coordinate is required');
    return errs;
  };

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    const errs = validate();
    if (errs.length > 0) {
      setErrors(errs);
      return;
    }
    setErrors([]);
    await onSave({
      id: form.id,
      description: form.description,
      room_number: form.room_number,
      x: Number(form.x),
      y: Number(form.y),
      floor: form.floor || null,
      area_id: form.area_id || null
    });
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
    }} onClick={onClose}>
      <div style={{
        background: 'white',
        padding: '25px',
        borderRadius: '12px',
        maxWidth: '450px',
        width: '90%',
        boxShadow: '0 2px 12px rgba(0,0,0,0.13)'
      }} onClick={e => e.stopPropagation()}>
        <h3 style={{ margin: '0 0 20px 0', color: '#333', display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 28 }}>➕</span> Add New Room
        </h3>
        <form onSubmit={handleSubmit}>
          {/* Room ID */}
          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
              Room ID: <span style={{ color: 'red' }}>*</span>
            </label>
            <input
              name="id"
              value={form.id}
              onChange={handleChange}
              required
              maxLength={10}
              style={{
                width: '100%',
                padding: '8px 12px',
                border: `2px solid ${errors.find(e => e.toLowerCase().includes('room id')) ? '#f44336' : '#ddd'}`,
                borderRadius: '6px',
                fontSize: '14px'
              }}
            />
          </div>
          {/* Description */}
          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
              Description: <span style={{ color: 'red' }}>*</span>
            </label>
            <input
              name="description"
              value={form.description}
              onChange={handleChange}
              required
              maxLength={255}
              style={{
                width: '100%',
                padding: '8px 12px',
                border: `2px solid ${errors.find(e => e.toLowerCase().includes('description')) ? '#f44336' : '#ddd'}`,
                borderRadius: '6px',
                fontSize: '14px'
              }}
            />
          </div>
          {/* Room Number */}
          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
              Room Number: <span style={{ color: 'red' }}>*</span>
            </label>
            <input
              name="room_number"
              value={form.room_number}
              onChange={handleChange}
              required
              type="number"
              style={{
                width: '100%',
                padding: '8px 12px',
                border: `2px solid ${errors.find(e => e.toLowerCase().includes('room number')) ? '#f44336' : '#ddd'}`,
                borderRadius: '6px',
                fontSize: '14px'
              }}
            />
          </div>
          {/* X */}
          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
              X: <span style={{ color: 'red' }}>*</span>
            </label>
            <input
              name="x"
              value={form.x}
              onChange={handleChange}
              required
              type="number"
              min={0}
              max={800}
              style={{
                width: '100%',
                padding: '8px 12px',
                border: `2px solid ${errors.find(e => e.toLowerCase().includes('x coordinate')) ? '#f44336' : '#ddd'}`,
                borderRadius: '6px',
                fontSize: '14px'
              }}
            />
          </div>
          {/* Y */}
          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
              Y: <span style={{ color: 'red' }}>*</span>
            </label>
            <input
              name="y"
              value={form.y}
              onChange={handleChange}
              required
              type="number"
              min={0}
              max={600}
              style={{
                width: '100%',
                padding: '8px 12px',
                border: `2px solid ${errors.find(e => e.toLowerCase().includes('y coordinate')) ? '#f44336' : '#ddd'}`,
                borderRadius: '6px',
                fontSize: '14px'
              }}
            />
          </div>
          {/* Floor */}
          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
              Floor:
            </label>
            <input
              name="floor"
              value={form.floor}
              onChange={handleChange}
              type="number"
              min={0}
              max={100}
              style={{
                width: '100%',
                padding: '8px 12px',
                border: '2px solid #ddd',
                borderRadius: '6px',
                fontSize: '14px'
              }}
            />
          </div>
          {/* Area */}
          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
              Area:
            </label>
            <select
              name="area_id"
              value={form.area_id}
              onChange={handleChange}
              style={{
                width: '100%',
                padding: '8px 12px',
                border: '2px solid #ddd',
                borderRadius: '6px',
                fontSize: '14px'
              }}
            >
              <option value="">-- None --</option>
              {areas.map(area => (
                <option key={area.id} value={area.id}>{area.name}</option>
              ))}
            </select>
          </div>
          {/* Error messages */}
          {errors.length > 0 && (
            <div style={{ color: '#f44336', margin: '8px 0', fontSize: '13px' }}>
              {errors.map((err, i) => <div key={i}>{err}</div>)}
            </div>
          )}
          {/* Helper */}
          <div style={{
            background: '#f0f8ff',
            padding: '10px',
            borderRadius: '6px',
            marginBottom: '20px',
            fontSize: '12px',
            color: '#666'
          }}>
            💡 <strong>Tip:</strong> Map coordinates: X (0-800), Y (0-600). Top-left is (0,0), bottom-right is (800,600).
          </div>
          {/* Buttons */}
          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              type="button"
              onClick={onClose}
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
              Add Room
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddRoomModal;
