import React from 'react';

interface AdminModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  type?: 'danger' | 'info' | 'success';
}

export default function AdminModal({ isOpen, title, message, onConfirm, onCancel, type = 'info' }: AdminModalProps) {
  if (!isOpen) return null;

  const accentColor = type === 'danger' ? '#ff6b6b' : type === 'success' ? '#51cf66' : '#339af0';

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999 }}>
      <div style={{ backgroundColor: '#1e1e1e', border: `1px solid ${accentColor}`, borderRadius: '12px', padding: '2rem', width: '400px', boxShadow: '0 10px 25px rgba(0,0,0,0.5)' }}>
        <h3 style={{ margin: '0 0 1rem 0', color: accentColor }}>{title}</h3>
        <p style={{ color: '#ccc', lineHeight: '1.5', marginBottom: '2rem' }}>{message}</p>
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
          <button type="button" onClick={onCancel} style={{ padding: '0.6rem 1.2rem', borderRadius: '6px', border: '1px solid #444', backgroundColor: 'transparent', color: '#888', cursor: 'pointer' }}>취소</button>
          <button type="button" onClick={onConfirm} style={{ padding: '0.6rem 1.2rem', borderRadius: '6px', border: 'none', backgroundColor: accentColor, color: type === 'danger' ? '#fff' : '#000', fontWeight: 'bold', cursor: 'pointer' }}>확인</button>
        </div>
      </div>
    </div>
  );
}
