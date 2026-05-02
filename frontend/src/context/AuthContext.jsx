import { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('magdiela_token');
    const saved = localStorage.getItem('magdiela_user');
    if (token && saved) {
      setUser(JSON.parse(saved));
      api.get('/me').then(r => { setUser(r.data); localStorage.setItem('magdiela_user', JSON.stringify(r.data)); }).catch(() => { localStorage.removeItem('magdiela_token'); localStorage.removeItem('magdiela_user'); setUser(null); }).finally(() => setLoading(false));
    } else { setLoading(false); }
  }, []);

  const login = async (email, password) => {
    const res = await api.post('/login', { email, password });
    localStorage.setItem('magdiela_token', res.data.token);
    localStorage.setItem('magdiela_user', JSON.stringify(res.data.user));
    setUser(res.data.user);
    return res.data;
  };

  const logout = async () => {
    try { await api.post('/logout'); } catch(e) {}
    localStorage.removeItem('magdiela_token');
    localStorage.removeItem('magdiela_user');
    setUser(null);
  };

  return <AuthContext.Provider value={{ user, login, logout, loading }}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
