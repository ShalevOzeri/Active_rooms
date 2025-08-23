import React from 'react';

const MessageBanner = ({ message }) => {
  if (!message) return null;

  // Detect success by emoji or keywords (English/Hebrew)
  const isSuccess =
    message.includes('✅') ||
    /success|הצלחה|עודכן|נשמר|נוסף|נמחק|התווסף|הוסר|saved|updated|added|deleted|removed/i.test(message);

  return (
    <div style={{
      background: isSuccess ? '#d4edda' : '#f8d7da',
      color: isSuccess ? '#155724' : '#721c24',
      padding: '12px 20px',
      borderRadius: '6px',
      marginBottom: '20px',
      border: `1px solid ${isSuccess ? '#c3e6cb' : '#f5c6cb'}`
    }}>
      {message}
    </div>
  );
};

export default MessageBanner;
