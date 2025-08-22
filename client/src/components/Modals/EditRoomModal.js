import React, { useState, useEffect } from 'react';
import apiService from '../../services/apiService';

// Modal for editing a room's details (admin only)
export default function EditRoomModal({ open, onClose, room, areas, onSave, user }) {
  // Initialize form state only when room is available
  const [form, setForm] = useState({
    room_name: '',
    floor: '',
    area: '',
    x: '',
    y: '',
  });
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  // Update form state when room changes
  useEffect(() => {
    if (room) {
      setForm({
        room_name: room.room_name ?? '',
        floor: room.floor ?? '',
        area: room.area ?? '',
        x: room.x ?? '',
        y: room.y ?? '',
      });
      setErrors({});
    }
  }, [room, open]);

  // Handle input changes
  const handleChange = e => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  };

  // Basic validation
  const validate = () => {
    const errs = {};
    // Room name: allow any non-empty value (string or number)
    if (
      form.room_name === undefined ||
      form.room_name === null ||
      (typeof form.room_name === 'string' && form.room_name.toString().trim() === '') ||
      (typeof form.room_name === 'number' && form.room_name.toString().trim() === '')
    ) {
      errs.room_name = 'Room name required';
    }
    // Floor is optional
    // Area is optional
    // X/Y: must be numbers in range
    if (form.x === '' || isNaN(form.x) || Number(form.x) < 0 || Number(form.x) > 800)
      errs.x = 'X must be 0-800';
    if (form.y === '' || isNaN(form.y) || Number(form.y) < 0 || Number(form.y) > 600)
      errs.y = 'Y must be 0-600';
    return errs;
  };

  // Submit handler
  const handleSubmit = async e => {
    e.preventDefault();
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;
    setSaving(true);
    try {
      // קריאה ל-onSave תחכה לסיום fetchData לפני סגירת המודאל
      if (onSave) {
        await onSave(form);
      }
      onClose();
    } catch (err) {
      setErrors({ api: err.message || 'Update failed' });
    } finally {
      setSaving(false);
    }
  };

  // Don't render modal if not open or room is null
  if (!open || !room) return null;

  return (
    <div
      style={{
        position: 'fixed',
        top: 0, left: 0, right: 0, bottom: 0,
        background: 'rgba(0,0,0,0.35)',
        zIndex: 1000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: '#fff',
          borderRadius: 12,
          minWidth: 340,
          maxWidth: 400,
          width: '100%',
          padding: '32px 28px 22px 28px',
          boxShadow: '0 8px 32px rgba(0,0,0,0.18)',
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
        }}
        onClick={e => e.stopPropagation()}
      >
        <h2 style={{
          margin: 0,
          marginBottom: 18,
          fontWeight: 700,
          fontSize: 22,
          color: '#1976d2',
          textAlign: 'center',
          letterSpacing: 0.5
        }}>
          Edit Room
        </h2>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {/* Room Name */}
          <label style={{ fontWeight: 500 }}>
            Room Name:
            <input
              name="room_name"
              value={form.room_name}
              onChange={handleChange}
              style={{
                width: '100%',
                padding: '7px 10px',
                marginTop: 4,
                borderRadius: 6,
                border: '1px solid #bdbdbd',
                fontSize: 15
              }}
            />
            {errors.room_name && <span style={{ color: '#d32f2f', fontSize: 13 }}>{errors.room_name}</span>}
          </label>
          {/* Floor */}
          <label style={{ fontWeight: 500 }}>
            Floor:
            <input
              name="floor"
              value={form.floor}
              onChange={handleChange}
              style={{
                width: '100%',
                padding: '7px 10px',
                marginTop: 4,
                borderRadius: 6,
                border: '1px solid #bdbdbd',
                fontSize: 15
              }}
            />
            {errors.floor && <span style={{ color: '#d32f2f', fontSize: 13 }}>{errors.floor}</span>}
          </label>
          {/* Area */}
          <label style={{ fontWeight: 500 }}>
            Area:
            <select
              name="area"
              value={form.area}
              onChange={handleChange}
              style={{
                width: '100%',
                padding: '7px 10px',
                marginTop: 4,
                borderRadius: 6,
                border: '1px solid #bdbdbd',
                fontSize: 15
              }}
            >
              <option value="">No Area</option>
              {areas.map(a => (
                <option key={a.id} value={a.id}>{a.name}</option>
              ))}
            </select>
            {errors.area && <span style={{ color: '#d32f2f', fontSize: 13 }}>{errors.area}</span>}
          </label>
          {/* X/Y fields at the bottom */}
          <div style={{ display: 'flex', gap: 10, marginTop: 10 }}>
            <label style={{ flex: 1, fontWeight: 500, display: 'flex', flexDirection: 'column' }}>
              Y:
              <input
                name="y"
                value={form.y}
                onChange={handleChange}
                style={{
                  width: '100%',
                  padding: '7px 10px',
                  marginTop: 4,
                  borderRadius: 6,
                  border: '1px solid #bdbdbd',
                  fontSize: 15
                }}
              />
              {errors.y && <span style={{ color: '#d32f2f', fontSize: 13 }}>{errors.y}</span>}
            </label>
            <label style={{ flex: 1, fontWeight: 500, display: 'flex', flexDirection: 'column' }}>
              X:
              <input
                name="x"
                value={form.x}
                onChange={handleChange}
                style={{
                  width: '100%',
                  padding: '7px 10px',
                  marginTop: 4,
                  borderRadius: 6,
                  border: '1px solid #bdbdbd',
                  fontSize: 15
                }}
              />
              {errors.x && <span style={{ color: '#d32f2f', fontSize: 13 }}>{errors.x}</span>}
            </label>
          </div>
          {errors.api && <div style={{ color: '#d32f2f', fontSize: 14, marginTop: 4 }}>{errors.api}</div>}
          <div style={{
            display: 'flex',
            justifyContent: 'flex-end',
            gap: 10,
            marginTop: 18
          }}>
            <button
              type="button"
              onClick={onClose}
              disabled={saving}
              style={{
                background: '#e0e0e0',
                color: '#333',
                border: 'none',
                borderRadius: 6,
                padding: '8px 18px',
                fontWeight: 500,
                fontSize: 15,
                cursor: 'pointer'
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              style={{
                background: '#1976d2',
                color: '#fff',
                border: 'none',
                borderRadius: 6,
                padding: '8px 18px',
                fontWeight: 600,
                fontSize: 15,
                cursor: saving ? 'not-allowed' : 'pointer',
                opacity: saving ? 0.7 : 1
              }}
            >
              Save
            </button>
          </div>
        </form>
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: 10,
            right: 14,
            background: 'none',
            border: 'none',
            fontSize: 22,
            color: '#888',
            cursor: 'pointer'
          }}
          aria-label="Close"
        >×</button>
      </div>
    </div>
  );
}