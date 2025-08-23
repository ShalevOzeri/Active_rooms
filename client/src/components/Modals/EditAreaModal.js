
import React, { useState, useEffect } from 'react';

export default function EditAreaModal({ isOpen, area, onClose, onSave }) {
  const [form, setForm] = useState({ name: '', description: '' });
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (area) {
      setForm({
        name: area.name ?? '',
        description: area.description ?? ''
      });
      setErrors({});
    }
  }, [area, isOpen]);

  if (!isOpen || !area) return null;

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  };

  const validate = () => {
    const errs = {};
    if (!form.name || form.name.trim().length < 2)
      errs.name = 'Name is required (2+ chars)';
    if (form.name.length > 100)
      errs.name = 'Name must be up to 100 chars';
    if (form.description && form.description.length > 255)
      errs.description = 'Description must be up to 255 chars';
    return errs;
  };

  const handleSubmit = async e => {
    e.preventDefault();
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;
    setSaving(true);
    try {
      if (onSave) {
        const debugArea = { ...area, ...form };
        console.log('[EditAreaModal] onSave called with:', debugArea);
        const result = await onSave(debugArea);
        console.log('[EditAreaModal] onSave result:', result);
        if (result && result.success) {
          onClose();
        } else if (result && result.errors) {
          setErrors({ api: result.errors.join(', ') });
        } else {
          setErrors({ api: 'Update failed' });
        }
      }
    } catch (err) {
      setErrors({ api: err.message || 'Update failed' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>✏️ Edit Area</h2>
        </div>
        <form onSubmit={handleSubmit} className="modal-body">
          <label>
            Name:
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              minLength={2}
              maxLength={100}
              required
            />
            {errors.name && <span className="modal-error">{errors.name}</span>}
          </label>
          <label>
            Description:
            <input
              name="description"
              value={form.description}
              onChange={handleChange}
              maxLength={255}
            />
            {errors.description && <span className="modal-error">{errors.description}</span>}
          </label>
          {errors.api && <div className="modal-error">{errors.api}</div>}
          <div className="modal-footer">
            <button
              type="submit"
              className="modal-save-btn"
              disabled={saving}
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
          </div>
        </form>
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
            color: #222;
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
          .modal-body input {
            padding: 8px 10px;
            border: 1px solid #d1d5db;
            border-radius: 6px;
            font-size: 1em;
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
            background: #43a047;
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
            background: #f44336;
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
