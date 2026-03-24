export default function Dashboard({ user, onLogout }: { user: any, onLogout: () => void }) {
  return (
    <div style={{ display: 'flex', height: '100vh', backgroundColor: '#121212', color: '#e0e0e0', fontFamily: 'Inter, system-ui, sans-serif' }}>
      {/* Sidebar Layout */}
      <div style={{ width: '250px', backgroundColor: '#1a1a1a', borderRight: '1px solid #333', padding: '1.5rem', display: 'flex', flexDirection: 'column' }}>
        <div style={{ paddingBottom: '2rem', borderBottom: '1px solid #333', marginBottom: '2rem' }}>
          <h2 style={{ color: '#fff', margin: 0 }}>ITSM v5</h2>
          <span style={{ fontSize: '0.8rem', color: '#888' }}>Enterprise Service Mgmt</span>
        </div>
        <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
          <li style={{ cursor: 'pointer', color: '#339af0', fontWeight: 'bold' }}>Dashboard</li>
          <li style={{ cursor: 'pointer', color: '#bbb' }}>Service Catalog</li>
          <li style={{ cursor: 'pointer', color: '#bbb' }}>My Tickets</li>
          <li style={{ cursor: 'pointer', color: '#bbb' }}>Incidents</li>
          <li style={{ cursor: 'pointer', color: '#bbb' }}>Knowledge Base</li>
        </ul>
      </div>
      
      {/* Main Content Area */}
      <div style={{ flex: 1, padding: '2rem', display: 'flex', flexDirection: 'column' }}>
        {/* Top Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', paddingBottom: '1rem', borderBottom: '1px solid #333' }}>
          <h2 style={{ color: '#fff', margin: 0 }}>Dashboard Overview</h2>
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
        
        {/* Main Dashboard Widgets */}
        <div style={{ backgroundColor: '#1e1e1e', padding: '2rem', borderRadius: '12px', border: '1px solid #333', boxShadow: '0 4px 15px rgba(0,0,0,0.2)', flex: 1 }}>
          <h3 style={{ color: '#fff', marginBottom: '1.5rem' }}>Welcome to the Secure Dashboard</h3>
          <p style={{ color: '#aaa', lineHeight: '1.6' }}>
            You have successfully authenticated via JWT (Spring Security) against the PostgreSQL/MariaDB backend utilizing Flyway generated schemas.
          </p>
          <div style={{ display: 'flex', gap: '2rem', marginTop: '3rem' }}>
            {/* Mock KPI Widget 1 */}
            <div style={{ flex: 1, backgroundColor: '#2c2c2c', padding: '1.5rem', borderRadius: '8px', borderLeft: '4px solid #339af0' }}>
              <div style={{ color: '#888', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Open Tickets</div>
              <div style={{ color: '#fff', fontSize: '2rem', fontWeight: 'bold' }}>14</div>
            </div>
            {/* Mock KPI Widget 2 */}
            <div style={{ flex: 1, backgroundColor: '#2c2c2c', padding: '1.5rem', borderRadius: '8px', borderLeft: '4px solid #51cf66' }}>
              <div style={{ color: '#888', marginBottom: '0.5rem', fontSize: '0.9rem' }}>SLA Compliance</div>
              <div style={{ color: '#fff', fontSize: '2rem', fontWeight: 'bold' }}>98.2%</div>
            </div>
            {/* Mock KPI Widget 3 */}
            <div style={{ flex: 1, backgroundColor: '#2c2c2c', padding: '1.5rem', borderRadius: '8px', borderLeft: '4px solid #fcc419' }}>
              <div style={{ color: '#888', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Active Incidents</div>
              <div style={{ color: '#fff', fontSize: '2rem', fontWeight: 'bold' }}>2</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
