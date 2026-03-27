import { useState } from 'react';

export default function LoginPage({ onLogin }: { onLogin: (data: any) => void }) {
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8080';
      const response = await fetch(`${apiUrl}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, password })
      });
      
      if (!response.ok) {
        throw new Error('Invalid credentials. Please use admin / admin123');
      }
      
      const data = await response.json();
      onLogin(data);
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div style={{ display: 'flex', height: '100vh', justifyContent: 'center', alignItems: 'center', backgroundColor: '#121212', color: '#e0e0e0', fontFamily: 'Inter, system-ui, sans-serif' }}>
      <div style={{ backgroundColor: '#1e1e1e', padding: '3rem', borderRadius: '12px', width: '100%', maxWidth: '400px', border: '1px solid #333', boxShadow: '0 10px 30px rgba(0,0,0,0.5)' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '2rem', color: '#fff', fontSize: '1.8rem' }}>ITSM v5 Login</h2>
        {error && <div style={{ color: '#ff6b6b', marginBottom: '1rem', textAlign: 'center', backgroundColor: 'rgba(255,107,107,0.1)', padding: '0.5rem', borderRadius: '6px' }}>{error}</div>}
        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
          <input 
            type="text" 
            placeholder="User ID (e.g., admin)" 
            value={userId} 
            onChange={e => setUserId(e.target.value)} 
            style={{ padding: '1rem', borderRadius: '6px', border: '1px solid #444', backgroundColor: '#2c2c2c', color: '#fff', fontSize: '1rem' }}
          />
          <input 
            type="password" 
            placeholder="Password (e.g., admin123)" 
            value={password} 
            onChange={e => setPassword(e.target.value)} 
            style={{ padding: '1rem', borderRadius: '6px', border: '1px solid #444', backgroundColor: '#2c2c2c', color: '#fff', fontSize: '1rem' }}
          />
          <button type="submit" style={{ padding: '1rem', borderRadius: '6px', border: 'none', backgroundColor: '#339af0', color: '#fff', fontWeight: 'bold', cursor: 'pointer', marginTop: '0.5rem', fontSize: '1.1rem', transition: 'background-color 0.2s' }}>
            Login
          </button>
        </form>
      </div>
    </div>
  );
}
