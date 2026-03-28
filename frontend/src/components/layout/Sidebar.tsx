import React, { useState } from 'react';

interface MenuItem {
  id: string;
  label: string;
  roles?: string[];
  children?: MenuItem[];
}

interface SidebarProps {
  currentView: string;
  setCurrentView: (view: string) => void;
  user: any;
}

const Sidebar: React.FC<SidebarProps> = ({ currentView, setCurrentView, user }) => {
  const [expanded, setExpanded] = useState<Record<string, boolean>>({ ADMIN: true });

  const menuItems: MenuItem[] = [
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
    { 
      id: 'ADMIN', 
      label: '🛠️ 시스템 관리', 
      roles: ['ROLE_ADMIN'],
      children: [
        { id: 'ADMIN_COMPANY', label: '🏢 고객사 관리' },
        { id: 'ADMIN_USER', label: '👤 사용자 관리' },
        { id: 'ADMIN_CODE', label: '🔢 공통 코드 관리' }
      ]
    },
  ];

  const toggleExpand = (id: string) => {
    setExpanded(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const renderMenuItem = (item: MenuItem, isChild = false) => {
    if (item.roles && !item.roles.includes(user.role)) return null;

    const hasChildren = item.children && item.children.length > 0;
    const isExpanded = expanded[item.id];
    const isActive = currentView === item.id || 
                     (item.id === 'SR_MANAGEMENT' && currentView === 'SR_DETAIL') ||
                     (hasChildren && item.children?.some(child => child.id === currentView));
    
    return (
      <React.Fragment key={item.id}>
        <li
          onClick={() => hasChildren ? toggleExpand(item.id) : setCurrentView(item.id)}
          style={{
            cursor: 'pointer',
            padding: '0.8rem 1rem',
            paddingLeft: isChild ? '2.5rem' : '1rem',
            borderRadius: '8px',
            backgroundColor: isActive && !hasChildren ? 'rgba(51, 154, 240, 0.15)' : 'transparent',
            color: isActive ? '#339af0' : '#bbb',
            fontWeight: isActive ? 'bold' : 'normal',
            fontSize: isChild ? '0.85rem' : '0.9rem',
            transition: 'all 0.2s ease',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '0.8rem',
            marginBottom: '0.2rem',
            borderRight: isActive && !hasChildren ? '3px solid #339af0' : 'none'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
            {item.label}
          </div>
          {hasChildren && (
            <span style={{ fontSize: '0.7rem', opacity: 0.6 }}>
              {isExpanded ? '▼' : '▶'}
            </span>
          )}
        </li>
        {hasChildren && isExpanded && (
          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            {item.children?.map(child => renderMenuItem(child, true))}
          </ul>
        )}
      </React.Fragment>
    );
  };

  return (
    <div style={{ width: '280px', backgroundColor: '#1a1a1a', borderRight: '1px solid #333', padding: '1.5rem', display: 'flex', flexDirection: 'column', height: '100%', scrollbarWidth: 'none' }}>
      <div style={{ paddingBottom: '2rem', borderBottom: '1px solid #333', marginBottom: '2rem' }}>
        <h2 style={{ color: '#fff', margin: 0, fontSize: '1.5rem', letterSpacing: '-0.5px', fontWeight: 800 }}>ITSM v5</h2>
        <div style={{ fontSize: '0.75rem', color: '#666', fontWeight: 600, textTransform: 'uppercase', marginTop: '0.4rem' }}>Unified Portal Framework</div>
      </div>
      
      <ul className="sidebar-scroll" style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', overflowY: 'auto', flex: 1 }}>
        {menuItems.map(item => renderMenuItem(item))}
      </ul>
      
      <div style={{ marginTop: 'auto', paddingTop: '1rem', borderTop: '1px solid #333', fontSize: '0.75rem', color: '#444', textAlign: 'center' }}>
        © 2026 Admin Portal v5.2.0
      </div>
    </div>
  );
};

export default Sidebar;
