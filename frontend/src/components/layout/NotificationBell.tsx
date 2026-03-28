import { useState, useEffect } from 'react';

export default function NotificationBell({ user }: { user: any }) {
  const [count, setCount] = useState(0);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8080';

  const fetchCount = async () => {
    try {
      const token = localStorage.getItem('itsm_token');
      const res = await fetch(`${apiUrl}/api/notifications/unread-count?userId=${user.userId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setCount(data.count);
      }
    } catch (e) { console.error(e); }
  };

  const fetchAll = async () => {
    try {
      const token = localStorage.getItem('itsm_token');
      const res = await fetch(`${apiUrl}/api/notifications?userId=${user.userId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) setNotifications(await res.json());
    } catch (e) { console.error(e); }
  };

  const markAllRead = async () => {
    const token = localStorage.getItem('itsm_token');
    await fetch(`${apiUrl}/api/notifications/read-all?userId=${user.userId}`, {
      method: 'PATCH', headers: { 'Authorization': `Bearer ${token}` }
    });
    setCount(0);
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  useEffect(() => {
    fetchCount();
    const interval = setInterval(fetchCount, 30000000); // Poll every 30s
    return () => clearInterval(interval);
  }, [user.userId]);

  const toggleDropdown = () => {
    if (!isOpen) fetchAll();
    setIsOpen(!isOpen);
  };

  return (
    <div style={{ position: 'relative' }}>
      <button
        onClick={toggleDropdown}
        style={{ background: 'none', border: '1px solid #444', borderRadius: '8px', padding: '0.5rem 0.8rem', cursor: 'pointer', color: '#fff', fontSize: '1.2rem', position: 'relative', transition: 'background 0.2s' }}
      >
        🔔
        {count > 0 && (
          <span style={{ position: 'absolute', top: '-6px', right: '-6px', backgroundColor: '#ff6b6b', color: '#fff', borderRadius: '50%', width: '20px', height: '20px', fontSize: '0.7rem', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
            {count > 9 ? '9+' : count}
          </span>
        )}
      </button>

      {isOpen && (
        <div style={{ position: 'absolute', right: 0, top: '110%', width: '380px', backgroundColor: '#1e1e1e', border: '1px solid #444', borderRadius: '12px', boxShadow: '0 8px 30px rgba(0,0,0,0.5)', zIndex: 1000, maxHeight: '430px', overflowY: 'auto' }}>
          <div style={{ padding: '1rem 1.5rem', borderBottom: '1px solid #333', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h4 style={{ margin: 0, color: '#fff', fontSize: '1rem' }}>Notifications</h4>
            {count > 0 && (
              <button onClick={markAllRead} style={{ background: 'none', border: 'none', color: '#339af0', cursor: 'pointer', fontSize: '0.85rem' }}>
                Mark all as read
              </button>
            )}
          </div>
          {notifications.length === 0 ? (
            <div style={{ padding: '2rem', textAlign: 'center', color: '#888' }}>No notifications yet.</div>
          ) : (
            notifications.map(n => (
              <div key={n.id} style={{ padding: '1rem 1.5rem', borderBottom: '1px solid #2c2c2c', backgroundColor: n.read ? 'transparent' : 'rgba(51,154,240,0.07)', display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                <span style={{ fontSize: '1.4rem' }}>{n.type === 'SUCCESS' ? '✅' : n.type === 'WARNING' ? '⚠️' : 'ℹ️'}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ color: n.read ? '#aaa' : '#fff', fontWeight: n.read ? 'normal' : 'bold', marginBottom: '0.25rem', fontSize: '0.9rem' }}>{n.title}</div>
                  <div style={{ color: '#888', fontSize: '0.8rem', lineHeight: '1.4' }}>{n.message}</div>
                  <div style={{ color: '#555', fontSize: '0.75rem', marginTop: '0.25rem' }}>{new Date(n.createdAt).toLocaleString()}</div>
                </div>
                {!n.read && <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#339af0', marginTop: '4px', flexShrink: 0 }}></span>}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
