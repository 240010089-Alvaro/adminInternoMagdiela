import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(email, password);
      toast.success('Bienvenida a Magdiela');
      navigate('/');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Credenciales inválidas');
    } finally { setLoading(false); }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-brand">
          <img src="/logo.jpg" alt="Magdiela Logo" style={{width: '120px', height: '120px', objectFit: 'cover', borderRadius: '16px', margin: '0 auto 16px', display: 'block'}} />
          <h1>Magdiela</h1>
          <p className="subtitle">Sistema de Control Interno</p>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="form-group" style={{textAlign:'left'}}>
            <label>Usuario</label>
            <input className="form-input" type="text" value={email} onChange={e => setEmail(e.target.value)} required />
          </div>
          <div className="form-group" style={{textAlign:'left'}}>
            <label>Contraseña</label>
            <input className="form-input" type="password" value={password} onChange={e => setPassword(e.target.value)} required />
          </div>
          <button type="submit" className="btn btn-primary" style={{width:'100%',marginTop:8}} disabled={loading}>
            {loading ? 'Ingresando...' : 'Ingresar al Sistema'}
          </button>
        </form>
        <p style={{marginTop:24,fontSize:'0.75rem',color:'var(--text-dim)'}}>Acceso exclusivo para administración</p>
      </div>
    </div>
  );
}
