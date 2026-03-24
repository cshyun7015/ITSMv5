import { useState } from 'react';
import CatalogList from './CatalogList';
import RequestForm from './RequestForm';

export default function Dashboard({ user, onLogout }: { user: any, onLogout: () => void }) {
  const [currentView, setCurrentView] = useState('DASHBOARD');
  const [selectedCatalogId, setSelectedCatalogId] = useState<number | null>(null);

  const renderContent = () => {
    if (currentView === 'DASHBOARD') {
      return (
        <div style={{ backgroundColor: '#1e1e1e', padding: '2rem', borderRadius: '12px', border: '1px solid #333' }}>
          <h3 style={{ color: '#fff', marginBottom: '1.5rem' }}>Welcome to ITSM v5 Dashboard</h3>
          <p style={{ color: '#aaa', lineHeight: '1.6' }}>
            ITSM v5 is running end-to-end.<br/>
            Select <strong>Service Catalog</strong> from the menu to request a new service using dynamic forms.
          </p>
        </div>
      );
    } else if (currentView === 'CATALOG') {
      return <CatalogList user={user} onSelectCatalog={(id) => { setSelectedCatalogId(id); setCurrentView('REQUEST_FORM'); }} />;
    } else if (currentView === 'REQUEST_FORM') {
      return <RequestForm user={user} catalogId={selectedCatalogId!} onBack={() => setCurrentView('CATALOG')} />;
    }
  };

  return (
    <div style={{ display: 'flex', height: '100vh', backgroundColor: '#121212', color: '#e0e0e0', fontFamily: 'Inter, system-ui, sans-serif' }}>
      {/* Sidebar Layout */}
      <div style={{ width: '250px', backgroundColor: '#1a1a1a', borderRight: '1px solid #333', padding: '1.5rem', display: 'flex', flexDirection: 'column' }}>
        <div style={{ paddingBottom: '2rem', borderBottom: '1px solid #333', marginBottom: '2rem' }}>
          <h2 style={{ color: '#fff', margin: 0 }}>ITSM v5</h2>
          <span style={{ fontSize: '0.8rem', color: '#888' }}>Enterprise Service Mgmt</span>
        </div>
        <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
          <li onClick={() => setCurrentView('DASHBOARD')} style={{ cursor: 'pointer', color: currentView === 'DASHBOARD' ? '#339af0' : '#bbb', fontWeight: currentView === 'DASHBOARD' ? 'bold' : 'normal' }}>Dashboard</li>
          <li onClick={() => setCurrentView('CATALOG')} style={{ cursor: 'pointer', color: currentView === 'CATALOG' || currentView === 'REQUEST_FORM' ? '#339af0' : '#bbb', fontWeight: currentView === 'CATALOG' || currentView === 'REQUEST_FORM' ? 'bold' : 'normal' }}>Service Catalog</li>
          <li style={{ cursor: 'pointer', color: '#bbb' }}>My Tickets</li>
          <li style={{ cursor: 'pointer', color: '#bbb' }}>Knowledge Base</li>
        </ul>
      </div>
      
      {/* Main Content Area */}
      <div style={{ flex: 1, padding: '2.5rem', display: 'flex', flexDirection: 'column', overflowY: 'auto' }}>
        {/* Top Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', paddingBottom: '1rem', borderBottom: '1px solid #333' }}>
          <h2 style={{ color: '#fff', margin: 0, textTransform: 'capitalize' }}>{currentView.replace('_', ' ').toLowerCase()}</h2>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ textAlign: 'right' }}>
              <div style={{ color: '#fff', fontWeight: 'bold' }}>{user.userName}</div>
              <div style={{ color: '#888', fontSize: '0.8rem' }}>{user.role} | Tenant: {user.tenantId}</div>
            </div>
            <button onClick={onLogout} style={{ padding: '0.6rem 1.2rem', borderRadius: '6px', border: '1px solid #555', backgroundColor: '#2a2a2a', color: '#fff', cursor: 'pointer', transition: 'background-color 0.2s' }}>
              Logout
            </button>
          </div>
        </div>
        
        {/* Main View Render */}
        {renderContent()}
      </div>
    </div>
  );
}
