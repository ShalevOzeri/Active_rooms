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
      // Wait for onSave to finish before closing the modal
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
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>✏️ Edit Room</h2>
          <button className="modal-close-btn" onClick={onClose} aria-label="Close">×</button>
        </div>
        <form onSubmit={handleSubmit} className="modal-body">
          <label>
            Room Name:
            <input
              name="room_name"
              value={form.room_name}
              onChange={handleChange}
            />
            {errors.room_name && <span className="modal-error">{errors.room_name}</span>}
          </label>
          <label>
            Floor:
            <input
              name="floor"
              value={form.floor}
              onChange={handleChange}
            />
            {errors.floor && <span className="modal-error">{errors.floor}</span>}
          </label>
          <label>
            Area:
            <select
              name="area"
              value={form.area}
              onChange={handleChange}
            >
              <option value="">No Area</option>
              {areas.map(a => (
                <option key={a.id} value={a.id}>{a.name}</option>
              ))}
            </select>
            {errors.area && <span className="modal-error">{errors.area}</span>}
          </label>
          <div className="modal-xy-row">
            <label>
              Y:
              <input
                name="y"
                value={form.y}
                onChange={handleChange}
              />
              {errors.y && <span className="modal-error">{errors.y}</span>}
            </label>
            <label>
              X:
              <input
                name="x"
                value={form.x}
                onChange={handleChange}
              />
              {errors.x && <span className="modal-error">{errors.x}</span>}
            </label>
          </div>
          {errors.api && <div className="modal-error">{errors.api}</div>}
        </form>
        <div className="modal-footer">
          <button
            type="button"
            className="modal-cancel-btn"
            onClick={onClose}
            disabled={saving}
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
            className="modal-save-btn"
            disabled={saving}
            onClick={handleSubmit}
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
        <style>{`
          .modal-overlay {
            position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
            background: rgba(0,0,0,0.18); display: flex; align-items: center; justify-content: center; z-index: 9999;
          }
          .modal-card {
            background: #fff;
            border-radius: 12px;
            box-shadow: 0 4px 24px rgba(0,0,0,0.13);
            min-width: 340px;
            max-width: 95vw;
            padding: 0;
            overflow: hidden;
            display: flex;
            flex-direction: column;
          }
          .modal-header {
            background: #f5f7fa;
            padding: 18px 24px 12px 24px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            border-bottom: 1px solid #e1e5e9;
          }
          .modal-header h2 {
            margin: 0;
            font-size: 1.25em;
            color: #222; /* black */
          }
          .modal-close-btn {
            background: none;
            border: none;
            font-size: 1.5em;
            color: #888;
            cursor: pointer;
            border-radius: 50%;
            width: 36px;
            height: 36px;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: background 0.15s;
          }
          .modal-close-btn:hover {
            background: #e1e5e9;
            color: #444;
          }
          .modal-body {
            padding: 24px;
            display: flex;
            flex-direction: column;
            gap: 18px;
          }
          .modal-body label {
            display: flex;
            flex-direction: column;
            font-size: 1em;
            color: #333;
            gap: 4px;
          }
          .modal-body input, .modal-body select {
            padding: 8px 10px;
            border: 1px solid #d1d5db;
            border-radius: 6px;
            font-size: 1em;
          }
          .modal-xy-row {
            display: flex;
            gap: 10px;
          }
          .modal-xy-row label {
            flex: 1;
          }
          .modal-footer {
            display: flex;
            justify-content: flex-end;
            gap: 12px;
            padding: 16px 24px 18px 24px;
            background: #f5f7fa;
            border-top: 1px solid #e1e5e9;
          }
          .modal-save-btn {
            background: #43a047; /* green */
            color: #fff;
            border: none;
            border-radius: 6px;
            padding: 10px 32px;
            font-weight: bold;
            cursor: pointer;
            font-size: 1.08em;
            box-shadow: 0 1px 4px rgba(0,0,0,0.07);
            transition: background 0.15s;
            letter-spacing: 0.5px;
            min-width: 110px;
            min-height: 44px;
          }
          .modal-save-btn:hover:enabled {
            background: #2e7031;
          }
          .modal-cancel-btn {
            background: #f44336; /* red */
            color: #fff;
            border: none;
            border-radius: 6px;
            padding: 10px 28px;
            font-weight: 500;
            cursor: pointer;
            font-size: 1.08em;
            transition: background 0.15s;
            letter-spacing: 0.2px;
            min-width: 110px;
            min-height: 44px;
          }
          .modal-cancel-btn:hover:enabled {
            background: #b71c1c;
          }
          .modal-error {
            color: #d32f2f;
            font-size: 13px;
            margin-top: 2px;
          }
        `}</style>
      </div>
    </div>
  );
}