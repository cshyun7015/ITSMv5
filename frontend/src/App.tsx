import { useState, useEffect } from 'react'
import LoginPage from './pages/LoginPage'
import Dashboard from './pages/Dashboard'

function App() {
  const [user, setUser] = useState<any>(null)

  // Auto-login check if JWT token is persisted (mocking for now via localStorage)
  useEffect(() => {
    const savedUser = localStorage.getItem('itsm_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
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
