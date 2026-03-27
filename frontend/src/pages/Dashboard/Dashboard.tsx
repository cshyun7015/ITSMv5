// Dashboard.tsx
import { useState, useEffect } from 'react';
import ServiceCatalogPage from '../ServiceCatalog';
import { ServiceCatalogAdminPage } from '../ServiceCatalog/admin/ServiceCatalogAdminPage';
import KnowledgePage from '../Knowledge';
import Header from '../../components/layout/Header';
import Sidebar from '../../components/layout/Sidebar';
import MyTickets from '../MyTickets/MyTickets';
import ChangePage from '../Change';
import AdminPage from '../Admin/AdminPage';
import AssetPage from '../Asset';
import EventPage from '../Event';
import IncidentPage from '../Incident';
// import CIPage from '../CI';
import ProblemPage from '../Problem';
import ServiceList from '../Service/ServiceList';
import ReleasePage from '../Release';
import SLAPage from '../SLA';
// import CatalogManagement from '../../components/admin/CatalogManagement';
import ServiceRequestPage from '../ServiceRequest';

export default function Dashboard({ user, onLogout }: { user: any, onLogout: () => void }) {
  const [currentView, setCurrentView] = useState('DASHBOARD');
  const [selectedCatalogId, setSelectedCatalogId] = useState<number | null>(null);
  const [selectedRequestId, setSelectedRequestId] = useState<number | null>(null);
  const [stats, setStats] = useState<any>({ openTickets: 0, inProgressTickets: 0, resolvedTickets: 0, slaCompliance: '-', activeIncidents: 0 });

  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8080';
  const token = localStorage.getItem('itsm_token');

  const headers = () => ({
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  });

  useEffect(() => {
    if (currentView === 'DASHBOARD') {
      const fetchStats = async () => {
        try {
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
  }, [currentView, user.companyId, apiUrl, token]);

  const renderContent = () => {
    switch (currentView) {
      case 'DASHBOARD':
        return (
          <div style={{ backgroundColor: '#1e1e1e', padding: '2.5rem', borderRadius: '12px', border: '1px solid #333', boxShadow: '0 8px 32px rgba(0,0,0,0.4)', display: 'flex', flexDirection: 'column' }}>
            <h3 style={{ color: '#fff', marginBottom: '1.5rem', fontSize: '1.4rem' }}>Secure MSP Operations Dashboard</h3>
            <p style={{ color: '#aaa', lineHeight: '1.6', fontSize: '0.95rem' }}>
              Welcome back to the ITIL v5 ITSM platform. All data is isolated by Company ID and synced with the backend in real-time.
            </p>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '2rem', marginTop: '3rem' }}>
              <div style={{ backgroundColor: '#252525', padding: '1.75rem', borderRadius: '12px', borderLeft: '5px solid #339af0', boxShadow: '0 4px 12px rgba(0,0,0,0.3)' }}>
                <div style={{ color: '#888', marginBottom: '0.75rem', fontSize: '0.85rem', fontWeight: 600, textTransform: 'uppercase' }}>Open SR Tickets</div>
                <div style={{ color: '#fff', fontSize: '3rem', fontWeight: 800 }}>{stats.openTickets}</div>
              </div>
              <div style={{ backgroundColor: '#252525', padding: '1.75rem', borderRadius: '12px', borderLeft: '5px solid #51cf66', boxShadow: '0 4px 12px rgba(0,0,0,0.3)' }}>
                <div style={{ color: '#888', marginBottom: '0.75rem', fontSize: '0.85rem', fontWeight: 600, textTransform: 'uppercase' }}>SLA Compliance</div>
                <div style={{ color: '#fff', fontSize: '3rem', fontWeight: 800 }}>{stats.slaCompliance}</div>
              </div>
              <div style={{ backgroundColor: '#252525', padding: '1.75rem', borderRadius: '12px', borderLeft: '5px solid #ff6b6b', boxShadow: '0 4px 12px rgba(0,0,0,0.3)' }}>
                <div style={{ color: '#888', marginBottom: '0.75rem', fontSize: '0.85rem', fontWeight: 600, textTransform: 'uppercase' }}>Active Incidents</div>
                <div style={{ color: '#fff', fontSize: '3rem', fontWeight: 800 }}>{stats.activeIncidents}</div>
              </div>
            </div>
          </div>
        );
      case 'CATALOG':
      case 'REQUEST_FORM':
        return user.role === 'ROLE_ADMIN' 
          ? <ServiceCatalogAdminPage />
          : <ServiceCatalogPage user={user} />;
      case 'SR_MANAGEMENT':
      case 'SR_DETAIL':
        return <ServiceRequestPage user={user} />;
      case 'EVENTS':
        return <EventPage />;
      case 'INCIDENTS':
        return <IncidentPage user={user} />;
      case 'PROBLEMS':
        return <ProblemPage user={user} />;
      case 'CHANGES':
        return <ChangePage user={user} />;
      case 'RELEASE':
        return <ReleasePage user={user} />;
      case 'SLA_MGMT':
        return <SLAPage user={user} />;
      case 'ASSETS':
        return <AssetPage user={user} />;
      case 'CONFIG_MGMT':
        return <div>CI Page Placeholder</div>;
      case 'SVC_MGMT':
        return <ServiceList user={user} />;
      case 'KNOWLEDGE':
        return <KnowledgePage user={user} />;
      case 'MY_TICKETS':
        return <MyTickets user={user} />;
      case 'ADMIN':
        return <AdminPage user={user} />;
      default:
        return <div style={{ color: '#fff' }}>View {currentView} not found.</div>;
    }
  };

  return (
    <div style={{ display: 'flex', height: '100vh', width: '100%', backgroundColor: '#121212', color: '#e0e0e0', overflow: 'hidden' }}>
      <Sidebar currentView={currentView} setCurrentView={setCurrentView} user={user} />
      
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <div style={{ padding: '1.5rem 2.5rem', flex: 1, overflowY: 'auto' }}>
          <Header currentView={currentView} user={user} onLogout={onLogout} />
          <div style={{ marginTop: '2rem' }}>
            {renderContent()}
          </div>
        </div>
      </div>
    </div>
  );
}
