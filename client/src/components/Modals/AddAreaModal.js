import React, { useState } from 'react';

const AddAreaModal = ({ isOpen, onClose, onSave, serverErrors }) => {
  const [form, setForm] = useState({ id: '', name: '', description: '' });
  const [error, setError] = useState('');

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = e => {
    e.preventDefault();
    if (!form.name.trim()) {
      setError('Area name is required');
      return;
    }
    onSave(form);
    // לא לאפס טופס/שגיאות כאן, כי נרצה להציג שגיאות מהשרת
  };

  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      background: 'rgba(0,0,0,0.4)', zIndex: 2000,
      display: 'flex', alignItems: 'center', justifyContent: 'center'
    }} onClick={onClose}>
      <div style={{ background: 'white', padding: 28, borderRadius: 12, minWidth: 320, boxShadow: '0 2px 16px rgba(0,0,0,0.13)' }} onClick={e => e.stopPropagation()}>
        <h3 style={{marginTop:0,marginBottom:18}}>Add Area</h3>
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: 16 }}>
            <label style={{ display: 'block', fontWeight: 600, marginBottom: 6 }}>
              ID
            </label>
            <input
              name="id"
              value={form.id}
              onChange={handleChange}
              style={{ width: '100%', padding: '8px 12px', border: '2px solid #ddd', borderRadius: 6, fontSize: 15 }}
              placeholder="(Auto)"
            />
          </div>
          <div style={{ marginBottom: 16 }}>
            <label style={{ display: 'block', fontWeight: 600, marginBottom: 6 }}>
              Name <span style={{ color: 'red' }}>*</span>
            </label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              required
              style={{ width: '100%', padding: '8px 12px', border: '2px solid #ddd', borderRadius: 6, fontSize: 15 }}
              autoFocus
            />
          </div>
          <div style={{ marginBottom: 16 }}>
            <label style={{ display: 'block', fontWeight: 600, marginBottom: 6 }}>
              Description
            </label>
            <input
              name="description"
              value={form.description}
              onChange={handleChange}
              style={{ width: '100%', padding: '8px 12px', border: '2px solid #ddd', borderRadius: 6, fontSize: 15 }}
            />
          </div>
          {error && <div style={{ color: '#f44336', marginBottom: 10 }}>{error}</div>}
          {serverErrors && serverErrors.length > 0 && (
            <div style={{ color: '#f44336', marginBottom: 10 }}>
              {serverErrors.map((err, idx) => (
                <div key={idx}>{err}</div>
              ))}
            </div>
          )}
          <div style={{ display: 'flex', gap: 10, marginTop: 10 }}>
            <button type="button" onClick={onClose} style={{ flex: 1, padding: 10, background: '#f44336', color: 'white', border: 'none', borderRadius: 6, cursor: 'pointer' }}>Cancel</button>
            <button type="submit" style={{ flex: 1, padding: 10, background: '#2196f3', color: 'white', border: 'none', borderRadius: 6, fontWeight: 'bold', fontSize: 15, cursor: 'pointer' }}>Save</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddAreaModal;
