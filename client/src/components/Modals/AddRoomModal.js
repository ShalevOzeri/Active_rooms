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
    <div className="modal-backdrop" style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      background: 'rgba(0,0,0,0.2)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center'
    }}>
      <div style={{
        background: '#fff', borderRadius: 8, padding: 24, minWidth: 340, maxWidth: 400, boxShadow: '0 2px 12px rgba(0,0,0,0.13)'
      }}>
        <h2>Add New Room</h2>
        <form onSubmit={handleSubmit}>
          <div>
            <label>Room ID*:<br />
              <input name="id" value={form.id} onChange={handleChange} required maxLength={10} />
            </label>
          </div>
          <div>
            <label>Description*:<br />
              <input name="description" value={form.description} onChange={handleChange} required maxLength={255} />
            </label>
          </div>
          <div>
            <label>Room Number*:<br />
              <input name="room_number" value={form.room_number} onChange={handleChange} required type="number" />
            </label>
          </div>
          <div>
            <label>X*:<br />
              <input name="x" value={form.x} onChange={handleChange} required type="number" min={0} max={800} />
            </label>
          </div>
          <div>
            <label>Y*:<br />
              <input name="y" value={form.y} onChange={handleChange} required type="number" min={0} max={600} />
            </label>
          </div>
          <div>
            <label>Floor:<br />
              <input name="floor" value={form.floor} onChange={handleChange} type="number" min={0} max={100} />
            </label>
          </div>
          <div>
            <label>Area:<br />
              <select name="area_id" value={form.area_id} onChange={handleChange}>
                <option value="">-- None --</option>
                {areas.map(area => (
                  <option key={area.id} value={area.id}>{area.name}</option>
                ))}
              </select>
            </label>
          </div>
          {errors.length > 0 && (
            <div style={{ color: 'red', margin: '8px 0' }}>
              {errors.map((err, i) => <div key={i}>{err}</div>)}
            </div>
          )}
          <div style={{ marginTop: 16, display: 'flex', gap: 12 }}>
            <button type="submit" style={{ background: '#2196F3', color: '#fff', border: 'none', borderRadius: 4, padding: '8px 18px', fontWeight: 'bold' }}>Save</button>
            <button type="button" onClick={onClose} style={{ background: '#eee', border: 'none', borderRadius: 4, padding: '8px 18px' }}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddRoomModal;
