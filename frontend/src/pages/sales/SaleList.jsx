import { useState, useEffect } from 'react';
import Header from '../../components/layout/Header';
import api from '../../services/api';
import { formatMoney, formatDateTime } from '../../utils/formatters';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import Modal from '../../components/ui/Modal';

export default function SaleList() {
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [cancelConfirmId, setCancelConfirmId] = useState(null);
  const navigate = useNavigate();

  const fetchSales = () => {
    setLoading(true);
    api.get('/sales', { params: { page } }).then(r => { setSales(r.data.data); setLastPage(r.data.last_page); }).finally(() => setLoading(false));
  };

  useEffect(() => { fetchSales(); }, [page]);

  const confirmCancel = async () => {
    if (!cancelConfirmId) return;
    try {
      await api.post(`/sales/${cancelConfirmId}/cancel`);
      toast.success('Venta cancelada y stock revertido');
      setCancelConfirmId(null);
      fetchSales();
    } catch(err) { toast.error('Error al cancelar la venta'); }
  };

  return (
    <>
      <Header title="Ventas" subtitle="Historial de ventas realizadas" />
      <div className="admin-content">
        <div className="toolbar">
          <div className="toolbar-left"><h3 style={{fontSize:'0.95rem',color:'var(--text-muted)'}}>Total: {sales.length} ventas en esta página</h3></div>
          <div className="toolbar-right">
            <button className="btn btn-primary" onClick={() => navigate('/nueva-venta')}>
              <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>
              Nueva Venta
            </button>
          </div>
        </div>

        <div className="card">
          {loading ? <div className="loading"><div className="spinner" /></div> : (
            <div className="table-wrapper"><table><thead><tr><th>#</th><th>Fecha</th><th>Clienta</th><th>Producto</th><th>Total</th><th>Pago</th><th>Estado</th><th>Acciones</th></tr></thead><tbody>
              {sales.map(s => (
                <tr key={s.id}>
                  <td style={{fontFamily:'monospace',color:'var(--text-muted)'}}>#{s.id}</td>
                  <td>{formatDateTime(s.created_at)}</td>
                  <td style={{fontWeight:600}}>{s.client?.name || s.customer_name || 'Público general'}</td>
                  <td style={{fontSize:'0.85rem', maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'}} title={s.items || s.notes}>
                    {s.items || s.notes || '—'}
                  </td>
                  <td style={{color:'var(--accent)',fontWeight:700}}>{formatMoney(s.total)}</td>
                  <td><span className={`badge ${s.payment_method==='credito'?'badge-warning':'badge-success'}`}>{s.payment_method}</span></td>
                  <td><span className={`badge ${s.status==='completada'?'badge-success':s.status==='pendiente'?'badge-warning':'badge-danger'}`}>{s.status}</span></td>
                  <td>{s.status !== 'cancelada' && <button className="btn btn-danger btn-sm" onClick={()=>setCancelConfirmId(s.id)}>Cancelar</button>}</td>
                </tr>
              ))}
              {sales.length===0 && <tr><td colSpan={8} style={{textAlign:'center',padding:40,color:'var(--text-muted)'}}>Sin registros</td></tr>}
            </tbody></table></div>
          )}
          {lastPage > 1 && <div className="pagination"><button disabled={page<=1} onClick={()=>setPage(page-1)}>← Anterior</button><span>Página {page} de {lastPage}</span><button disabled={page>=lastPage} onClick={()=>setPage(page+1)}>Siguiente →</button></div>}
        </div>

        <Modal isOpen={!!cancelConfirmId} onClose={() => setCancelConfirmId(null)} title="Cancelar Registro" footer={<><button className="btn btn-outline" onClick={() => setCancelConfirmId(null)}>Volver</button><button className="btn btn-danger" onClick={confirmCancel}>Cancelar Registro</button></>}>
          <p>¿Estás segura de que deseas cancelar este registro? Si fue a crédito, se revertirá el saldo de la clienta.</p>
        </Modal>
      </div>
    </>
  );
}
