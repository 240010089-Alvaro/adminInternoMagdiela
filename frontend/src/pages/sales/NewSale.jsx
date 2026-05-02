import { useState, useEffect } from 'react';
import Header from '../../components/layout/Header';
import api from '../../services/api';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

export default function NewSale() {
  const [clients, setClients] = useState([]);
  const [clientId, setClientId] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [items, setItems] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('efectivo');
  const [total, setTotal] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [saving, setSaving] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    api.get('/clients/all').then(r => setClients(r.data));
  }, []);

  const handleSale = async (e) => {
    e.preventDefault();
    if (!total || parseFloat(total) <= 0) return toast.error('Ingresa un monto válido');
    if (paymentMethod === 'credito' && !clientId && !customerName) return toast.error('Ingresa un nombre o selecciona una clienta para crédito');
    
    setSaving(true);
    try {
      await api.post('/sales', {
        client_id: clientId || null,
        customer_name: !clientId ? customerName : null,
        items,
        payment_method: paymentMethod,
        total: parseFloat(total),
        due_date: paymentMethod === 'credito' ? dueDate || null : null,
      });
      toast.success('Venta registrada exitosamente');
      navigate('/ventas');
    } catch(err) { 
      toast.error(err.response?.data?.message || 'Error al procesar el registro'); 
    }
    finally { setSaving(false); }
  };

  return (
    <>
      <Header title="Nueva Venta" subtitle="Registra una venta o un adeudo" />
      <div className="admin-content" style={{maxWidth: 600, margin: '0 auto'}}>
        <div className="card">
          <form onSubmit={handleSale}>
            <div className="form-group">
              <label>Clienta (Opcional si es pago al contado de público general)</label>
              <select className="form-select" value={clientId} onChange={e => {setClientId(e.target.value); if(e.target.value) setCustomerName('');}}>
                <option value="">Público general (Escribir nombre manual ↓)</option>
                {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>

            {!clientId && (
              <div className="form-group animate-fade-in" style={{background: 'var(--bg-input)', padding: '16px', borderRadius: '12px', border: '1px solid var(--border)'}}>
                <label>Nombre de la Clienta (Para Público General)</label>
                <input type="text" className="form-input" value={customerName} onChange={e => setCustomerName(e.target.value)} placeholder="Ej. Maria Lopez" />
                {paymentMethod === 'credito' && customerName && (
                  <p style={{fontSize: '0.75rem', color: 'var(--primary-light)', marginTop: 8, display: 'flex', alignItems: 'center', gap: 6}}>
                    <svg style={{width:14, height:14}} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    Esta clienta se guardará automáticamente en tu lista por ser venta a crédito.
                  </p>
                )}
              </div>
            )}

            <div className="form-group">
              <label>Producto / Artículos (Opcional)</label>
              <input type="text" className="form-input" value={items} onChange={e => setItems(e.target.value)} placeholder="Ej. Vestido floral, Blusa seda" />
            </div>

            <div className="form-group">
              <label>Monto Total ($)</label>
              <input type="number" step="0.01" className="form-input" style={{fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--accent)'}} value={total} onChange={e => setTotal(e.target.value)} placeholder="0.00" required />
            </div>

            <div className="form-group">
              <label>Método de Pago</label>
              <div style={{display:'flex',gap:8}}>
                <button type="button" className={`btn btn-sm ${paymentMethod==='efectivo'?'btn-primary':'btn-outline'}`} style={{flex:1}} onClick={()=>setPaymentMethod('efectivo')}>💵 Pagó de Contado</button>
                <button type="button" className={`btn btn-sm ${paymentMethod==='credito'?'btn-primary':'btn-outline'}`} style={{flex:1}} onClick={()=>setPaymentMethod('credito')}>💳 Se lo fié (Crédito)</button>
              </div>
            </div>

            {paymentMethod === 'credito' && (
              <div className="form-group">
                <label>Fecha Límite de Pago (Opcional)</label>
                <input type="date" className="form-input" value={dueDate} onChange={e=>setDueDate(e.target.value)} />
              </div>
            )}

            <button type="submit" className="btn btn-accent" style={{width:'100%', marginTop: 16, padding: '12px'}} disabled={saving}>
              {saving ? 'Registrando...' : 'Confirmar Registro'}
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
