// Dashboard.tsx
import { useState, useEffect } from 'react';
import CatalogList from './CatalogList';
import RequestForm from './RequestForm';
import KnowledgeList from './KnowledgeList';
import NotificationBell from './NotificationBell';
import MyTickets from './MyTickets';
import ChangeList from './ChangeList';
import AdminPage from './AdminPage';
import AssetList from './AssetList';
import EventList from './EventList';
import IncidentList from './IncidentList';
import ProblemList from './ProblemList';

export default function Dashboard({ user, onLogout }: { user: any, onLogout: () => void }) {
  const [currentView, setCurrentView] = useState('DASHBOARD');
  const [selectedCatalogId, setSelectedCatalogId] = useState<number | null>(null);
  const [stats, setStats] = useState<any>({ openTickets: 0, inProgressTickets: 0, resolvedTickets: 0, slaCompliance: '-', activeIncidents: 0 });

  useEffect(() => {
    if (currentView === 'DASHBOARD') {
      const fetchStats = async () => {
        try {
          const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8080';
          const token = localStorage.getItem('itsm_token');
          const res = await fetch(`${apiUrl}/api/dashboard/stats`, {
            headers: { 'Authorization': `Bearer ${token}` }
          });
          if (res.ok) setStats(await res.json());
        } catch (e) {
          console.error(e);
        }
      };
      fetchStats();
    }
  }, [currentView, user.tenantId]);

  const renderContent = () => {
    if (currentView === 'DASHBOARD') {
      return (
        <div style={{ backgroundColor: '#1e1e1e', padding: '2rem', borderRadius: '12px', border: '1px solid #333', boxShadow: '0 4px 15px rgba(0,0,0,0.2)', display: 'flex', flexDirection: 'column' }}>
          <h3 style={{ color: '#fff', marginBottom: '1.5rem' }}>Welcome to the Secure Dashboard</h3>
          <p style={{ color: '#aaa', lineHeight: '1.6' }}>
            You have successfully authenticated against the PostgreSQL backend. The statistics below are aggregated in real-time.
          </p>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '2rem', marginTop: '3rem' }}>
            {/* KPI Widget 1 */}
            <div style={{ backgroundColor: '#2c2c2c', padding: '1.5rem', borderRadius: '8px', borderLeft: '4px solid #339af0', boxShadow: '0 2px 8px rgba(0,0,0,0.2)' }}>
              <div style={{ color: '#888', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Open SR Tickets (Tenant)</div>
              <div style={{ color: '#fff', fontSize: '2.4rem', fontWeight: 'bold' }}>{stats.openTickets}</div>
            </div>
            {/* KPI Widget 2 */}
            <div style={{ backgroundColor: '#2c2c2c', padding: '1.5rem', borderRadius: '8px', borderLeft: '4px solid #51cf66', boxShadow: '0 2px 8px rgba(0,0,0,0.2)' }}>
              <div style={{ color: '#888', marginBottom: '0.5rem', fontSize: '0.9rem' }}>SLA Compliance</div>
              <div style={{ color: '#fff', fontSize: '2.4rem', fontWeight: 'bold' }}>{stats.slaCompliance}</div>
            </div>
            {/* KPI Widget 3 */}
            <div style={{ backgroundColor: '#2c2c2c', padding: '1.5rem', borderRadius: '8px', borderLeft: '4px solid #fcc419', boxShadow: '0 2px 8px rgba(0,0,0,0.2)' }}>
              <div style={{ color: '#888', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Active Incidents</div>
              <div style={{ color: '#fff', fontSize: '2.4rem', fontWeight: 'bold' }}>{stats.activeIncidents}</div>
            </div>
          </div>
        </div>
      );
    } else if (currentView === 'CATALOG') {
      return <CatalogList user={user} onSelectCatalog={(id) => { setSelectedCatalogId(id); setCurrentView('REQUEST_FORM'); }} />;
    } else if (currentView === 'REQUEST_FORM') {
      return <RequestForm user={user} catalogId={selectedCatalogId!} onBack={() => setCurrentView('CATALOG')} />;
    } else if (currentView === 'KNOWLEDGE') {
      return <KnowledgeList user={user} />;
    } else if (currentView === 'MY_TICKETS') {
      return <MyTickets user={user} />;
    } else if (currentView === 'INCIDENTS') {
      return <IncidentList user={user} />;
    } else if (currentView === 'CHANGES') {
      return <ChangeList user={user} />;
    } else if (currentView === 'ASSETS') {
      return <AssetList user={user} />;
    } else if (currentView === 'EVENTS') { // New EventList view
      return <EventList user={user} />;
    } else if (currentView === 'PROBLEMS') {
      return <ProblemList user={user} />;
    } else if (currentView === 'ADMIN') {
      return <AdminPage user={user} />;
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
          <li onClick={() => setCurrentView('MY_TICKETS')} style={{ cursor: 'pointer', color: currentView === 'MY_TICKETS' ? '#339af0' : '#bbb', fontWeight: currentView === 'MY_TICKETS' ? 'bold' : 'normal' }}>My Tickets</li>
          <li onClick={() => setCurrentView('INCIDENTS')} style={{ cursor: 'pointer', color: currentView === 'INCIDENTS' ? '#ff6b6b' : '#bbb', fontWeight: currentView === 'INCIDENTS' ? 'bold' : 'normal' }}>Incidents</li>
          <li onClick={() => setCurrentView('CHANGES')} style={{ cursor: 'pointer', color: currentView === 'CHANGES' ? '#339af0' : '#bbb', fontWeight: currentView === 'CHANGES' ? 'bold' : 'normal' }}>Change Mgmt</li>
          <li onClick={() => setCurrentView('ASSETS')} style={{ cursor: 'pointer', color: currentView === 'ASSETS' ? '#339af0' : '#bbb', fontWeight: currentView === 'ASSETS' ? 'bold' : 'normal' }}>Assets / CMDB</li>
          <li onClick={() => setCurrentView('EVENTS')} style={{ cursor: 'pointer', color: currentView === 'EVENTS' ? '#ff6b6b' : '#bbb', fontWeight: currentView === 'EVENTS' ? 'bold' : 'normal' }}>Event Mgmt</li>
          <li onClick={() => setCurrentView('PROBLEMS')} style={{ cursor: 'pointer', color: currentView === 'PROBLEMS' ? '#339af0' : '#bbb', fontWeight: currentView === 'PROBLEMS' ? 'bold' : 'normal' }}>Problem Mgmt</li>
          <li onClick={() => setCurrentView('KNOWLEDGE')} style={{ cursor: 'pointer', color: currentView === 'KNOWLEDGE' ? '#339af0' : '#bbb', fontWeight: currentView === 'KNOWLEDGE' ? 'bold' : 'normal' }}>Knowledge Base</li>
          {user.role === 'ROLE_ADMIN' && (
            <li onClick={() => setCurrentView('ADMIN')} style={{ cursor: 'pointer', color: currentView === 'ADMIN' ? '#fcc419' : '#bbb', fontWeight: currentView === 'ADMIN' ? 'bold' : 'normal', borderTop: '1px solid #333', paddingTop: '1rem', marginTop: '0.5rem' }}>🔧 MSP Admin</li>
          )}
        </ul>
      </div>
      
      {/* Main Content Area */}
      <div style={{ flex: 1, padding: '2.5rem', display: 'flex', flexDirection: 'column', overflowY: 'auto' }}>
        {/* Top Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', paddingBottom: '1rem', borderBottom: '1px solid #333' }}>
          <h2 style={{ color: '#fff', margin: 0, textTransform: 'capitalize' }}>{currentView.replace('_', ' ').toLowerCase()}</h2>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <NotificationBell user={user} />
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
