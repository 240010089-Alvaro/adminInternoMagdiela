import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import Modal from '../ui/Modal';

export default function Header({ title, subtitle }) {
  const { user, logout } = useAuth();
  const [showHelp, setShowHelp] = useState(false);
  const initials = user?.name?.split(' ').map(n => n[0]).join('').substring(0, 2) || 'MA';
  return (
    <header className="header">
      <div className="header-left">
        <h2>{title}</h2>
        {subtitle && <p>{subtitle}</p>}
      </div>
      <div className="header-right">
        <button className="btn btn-outline" style={{borderColor:'var(--accent)',color:'var(--accent)'}} onClick={() => setShowHelp(true)}>❓ Ayuda</button>
        <div className="header-user">
          <div className="avatar">{initials}</div>
          <span>{user?.name || 'Admin'}</span>
        </div>
      </div>

      <Modal isOpen={showHelp} onClose={() => setShowHelp(false)} title="¿Cómo usar el sistema?" large>
        <div style={{ lineHeight: '1.6', color: 'var(--text)' }}>
          <h3 style={{ color: 'var(--primary-light)', marginBottom: 8 }}>1. Clientas</h3>
          <p style={{ marginBottom: 16 }}>Aquí registras a tus clientas. Es importante registrarlas primero si planeas fiarles o llevarles una cuenta de crédito.</p>
          
          <h3 style={{ color: 'var(--primary-light)', marginBottom: 8 }}>2. Nueva Venta</h3>
          <p style={{ marginBottom: 16 }}>Cuando una clienta te compre ropa, ve aquí. Selecciona a la clienta, escribe el <strong>Monto Total</strong> de lo que se lleva, y elige si te pagó en <strong>Efectivo</strong> (no debe nada) o a <strong>Crédito</strong> (se suma a su deuda). En "Notas" puedes escribir qué prendas se llevó para recordarlo.</p>

          <h3 style={{ color: 'var(--primary-light)', marginBottom: 8 }}>3. Créditos y Abonos</h3>
          <p style={{ marginBottom: 16 }}>Si una clienta viene a pagarte parte de su deuda, entra aquí. Busca su crédito pendiente, dale a <strong>"Abonar"</strong> y escribe cuánto dinero te está entregando. El sistema descontará esa cantidad de su saldo automáticamente.</p>

          <h3 style={{ color: 'var(--primary-light)', marginBottom: 8 }}>4. Reportes</h3>
          <p style={{ marginBottom: 16 }}>Revisa tus ganancias, cuánto dinero tienes prestado en la calle (Deudas Activas) y filtra por día, semana o mes.</p>
        </div>
      </Modal>
    </header>
  );
}
