import React from 'react';
import NotificationBell from './NotificationBell';

interface HeaderProps {
  currentView: string;
  user: any;
  onLogout: () => void;
}

const Header: React.FC<HeaderProps> = ({ currentView, user, onLogout }) => {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', paddingBottom: '1rem', borderBottom: '1px solid #333' }}>
      <h2 style={{ color: '#fff', margin: 0, textTransform: 'capitalize', fontSize: '1.5rem' }}>
        {currentView.replace('_', ' ').toLowerCase()}
      </h2>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
        <NotificationBell user={user} />
        <div style={{ textAlign: 'right', borderRight: '1px solid #333', paddingRight: '1.5rem' }}>
          <div style={{ color: '#fff', fontWeight: 'bold', fontSize: '1rem' }}>{user.userName}</div>
          <div style={{ color: '#888', fontSize: '0.75rem' }}>{user.role} | Company: {user.companyId}</div>
        </div>
        <button 
          onClick={onLogout} 
          style={{ 
            padding: '0.6rem 1.2rem', 
            borderRadius: '6px', 
            border: '1px solid #444', 
            backgroundColor: '#2a2a2a', 
            color: '#fff', 
            cursor: 'pointer', 
            transition: 'background-color 0.2s',
            fontSize: '0.85rem'
          }}
          onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#333'}
          onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#2a2a2a'}
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default Header;
