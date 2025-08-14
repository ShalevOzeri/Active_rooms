import React from 'react';

const MessageBanner = ({ message }) => {
  if (!message) return null;

  return (
    <div style={{
      background: message.includes('✅') ? '#d4edda' : '#f8d7da',
      color: message.includes('✅') ? '#155724' : '#721c24',
      padding: '12px 20px',
      borderRadius: '6px',
      marginBottom: '20px',
      border: `1px solid ${message.includes('✅') ? '#c3e6cb' : '#f5c6cb'}`
    }}>
      {message}
    </div>
  );
};

export default MessageBanner;
