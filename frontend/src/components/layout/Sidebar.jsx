import { NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const navItems = [
  { section: 'Principal' },
  { to: '/', label: 'Dashboard', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-4 0a1 1 0 01-1-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 01-1 1' },
  { section: 'Gestión' },
  { to: '/clientas', label: 'Clientas', icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z' },
  { section: 'Ventas y Cargos' },
  { to: '/ventas', label: 'Historial', icon: 'M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z' },
  { to: '/nueva-venta', label: 'Nueva Venta', icon: 'M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z' },
  { to: '/creditos', label: 'Créditos', icon: 'M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z' },
  { section: 'Análisis' },
  { to: '/reportes', label: 'Reportes', icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z' },
];

export default function Sidebar({ isOpen, onClose }) {
  const { logout } = useAuth();
  return (
    <>
      {isOpen && <div className="sidebar-overlay" onClick={onClose} style={{position:'fixed',inset:0,background:'rgba(0,0,0,0.5)',zIndex:99,display:'none'}} />}
      <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
        <div className="sidebar-brand">
          <img src="/logo.jpg" alt="Logo" style={{width: '42px', height: '42px', objectFit: 'cover', borderRadius: '12px'}} />
          <div><h1>Magdiela<small>Control Interno</small></h1></div>
        </div>
        <nav className="sidebar-nav">
          {navItems.map((item, i) => item.section ? (
            <div key={i} className="nav-section">{item.section}</div>
          ) : (
            <NavLink key={item.to} to={item.to} end={item.to === '/'} className={({isActive}) => `nav-link ${isActive ? 'active' : ''}`} onClick={onClose}>
              <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d={item.icon} /></svg>
              {item.label}
            </NavLink>
          ))}
        </nav>
        <div style={{padding:'16px 12px',borderTop:'1px solid var(--border)'}}>
          <button onClick={logout} className="nav-link" style={{width:'100%',background:'none',border:'none',color:'var(--text-muted)',cursor:'pointer',fontFamily:'var(--font-sans)',fontSize:'0.9rem'}}>
            <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8} style={{width:20,height:20}}><path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
            Cerrar Sesión
          </button>
        </div>
      </aside>
    </>
  );
}
