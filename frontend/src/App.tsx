import { useState, useEffect } from 'react'
import LoginPage from './pages/LoginPage'
import Dashboard from './pages/Dashboard'

function App() {
  const [user, setUser] = useState<any>(null)

  // Auto-login check if JWT token is persisted
  useEffect(() => {
    const savedUser = localStorage.getItem('itsm_user');
    const token = localStorage.getItem('itsm_token');
    
    if (savedUser && token) {
      try {
        // Simple JWT check (Base64 decode payload)
        const payload = JSON.parse(atob(token.split('.')[1]));
        const isExpired = payload.exp * 1000 < Date.now();
        
        if (isExpired) {
          console.warn('Token expired, logging out...');
          handleLogout();
        } else {
          setUser(JSON.parse(savedUser));
        }
      } catch (e) {
        handleLogout();
      }
    }
  }, []);

  const handleLogin = (userData: any) => {
    setUser(userData);
    localStorage.setItem('itsm_token', userData.token);
    localStorage.setItem('itsm_user', JSON.stringify(userData));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('itsm_token');
    localStorage.removeItem('itsm_user');
  };

  if (!user) {
    return <LoginPage onLogin={handleLogin} />
  }

  return <Dashboard user={user} onLogout={handleLogout} />
}

export default App
