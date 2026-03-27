import React from 'react';

interface SidebarProps {
  currentView: string;
  setCurrentView: (view: string) => void;
  user: any;
}

const Sidebar: React.FC<SidebarProps> = ({ currentView, setCurrentView, user }) => {
  const menuItems = [
    { id: 'DASHBOARD', label: '📊 대시보드' },
    { id: 'MY_TICKETS', label: '📑 나의 요청 항목' },
    { id: 'CATALOG', label: '📋 서비스 카탈로그' },
    { id: 'SR_MANAGEMENT', label: '🎫 서비스 요청 관리', roles: ['ROLE_ADMIN', 'ROLE_AGENT'] },
    { id: 'EVENTS', label: '🔔 이벤트 관리' },
    { id: 'INCIDENTS', label: '🚨 장애 관리' },
    { id: 'PROBLEMS', label: '🧩 문제 관리' },
    { id: 'CHANGES', label: '🔄 변경 관리' },
    { id: 'RELEASE', label: '🚀 릴리스 관리' },
    { id: 'SLA_MGMT', label: '📈 서비스 수준 관리' },
    { id: 'ASSETS', label: '💻 자산 관리' },
    { id: 'CONFIG_MGMT', label: '🏗️ 구성 관리' },
    { id: 'SVC_MGMT', label: '🌐 서비스 관리' },
    { id: 'KNOWLEDGE', label: '📖 지식 관리' },
    { id: 'ADMIN', label: '🛠️ 시스템 관리', roles: ['ROLE_ADMIN'] },
  ];

  const renderMenuItem = (item: any) => {
    if (item.roles && !item.roles.includes(user.role)) return null;

    const isActive = currentView === item.id || (item.id === 'SR_MANAGEMENT' && currentView === 'SR_DETAIL');
    
    return (
      <li
        key={item.id}
        onClick={() => setCurrentView(item.id)}
        style={{
          cursor: 'pointer',
          padding: '0.8rem 1rem',
          borderRadius: '8px',
          backgroundColor: isActive ? 'rgba(51, 154, 240, 0.15)' : 'transparent',
          color: isActive ? '#339af0' : '#bbb',
          fontWeight: isActive ? 'bold' : 'normal',
          fontSize: '0.9rem',
          transition: 'all 0.2s ease',
          display: 'flex',
          alignItems: 'center',
          gap: '0.8rem',
          marginBottom: '0.2rem'
        }}
      >
        {item.label}
      </li>
    );
  };

  return (
    <div style={{ width: '260px', backgroundColor: '#1a1a1a', borderRight: '1px solid #333', padding: '1.5rem', display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div style={{ paddingBottom: '2rem', borderBottom: '1px solid #333', marginBottom: '2rem' }}>
        <h2 style={{ color: '#fff', margin: 0, fontSize: '1.5rem', letterSpacing: '-0.5px' }}>ITSM v5</h2>
        <span style={{ fontSize: '0.75rem', color: '#666', fontWeight: 500 }}>Enterprise Service Mgmt</span>
      </div>
      
      <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', overflowY: 'auto', flex: 1 }}>
        {menuItems.map(renderMenuItem)}
      </ul>
      
      <div style={{ marginTop: 'auto', paddingTop: '1rem', borderTop: '1px solid #333', fontSize: '0.75rem', color: '#555' }}>
        © 2026 Admin Portal v5.0.1
      </div>
    </div>
  );
};

export default Sidebar;
