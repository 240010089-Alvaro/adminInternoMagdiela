import { useState, useEffect } from 'react';
import Header from '../../components/layout/Header';
import api from '../../services/api';
import { formatMoney, formatDateTime } from '../../utils/formatters';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import Modal from '../../components/ui/Modal';

export default function SaleList() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);
  const [cancelConfirmId, setCancelConfirmId] = useState(null);
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const navigate = useNavigate();

  const fetchHistory = () => {
    setLoading(true);
    api.get('/history', { params: { page } })
      .then(r => { 
        setHistory(r.data.data); 
        setLastPage(r.data.last_page); 
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchHistory(); }, [page]);

  const handleDelete = async () => {
    if (!deleteConfirmId) return;
    try {
      await api.delete(`/history/${deleteConfirmId}`);
      toast.success('Entrada eliminada');
      setDeleteConfirmId(null);
      fetchHistory();
    } catch(err) { toast.error('Error al eliminar'); }
  };

  const handleCancelSale = async () => {
    if (!cancelConfirmId) return;
    try {
      await api.post(`/sales/${cancelConfirmId}/cancel`);
      toast.success('Venta cancelada');
      setCancelConfirmId(null);
      fetchHistory();
    } catch(err) { toast.error('Error al cancelar la venta'); }
  };

  const handleClearHistory = async () => {
    try {
      await api.post('/history/clear');
      toast.success('Historial vaciado');
      setShowClearConfirm(false);
      fetchHistory();
    } catch(err) { toast.error('Error al vaciar historial'); }
  };

  const getTypeBadge = (type) => {
    switch(type) {
      case 'venta': return <span className="badge badge-success">Venta</span>;
      case 'abono': return <span className="badge badge-accent">Abono</span>;
      case 'cambio': return <span className="badge badge-warning">Cambio</span>;
      default: return <span className="badge">{type}</span>;
    }
  };

  return (
    <>
      <Header title="Historial" subtitle="Registro de ventas, abonos y cambios en el sistema" />
      <div className="admin-content">
        <div className="toolbar">
          <div className="toolbar-left">
            <h3 style={{fontSize:'0.95rem',color:'var(--text-muted)'}}>
              Mostrando {history.length} registros recientes
            </h3>
          </div>
          <div className="toolbar-right" style={{display:'flex', gap: '10px'}}>
            <button className="btn btn-outline" onClick={() => setShowClearConfirm(true)}>
              <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
              Vaciar Historial
            </button>
            <button className="btn btn-primary" onClick={() => navigate('/nueva-venta')}>
              <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>
              Nueva Venta
            </button>
          </div>
        </div>

        <div className="card">
          {loading ? <div className="loading"><div className="spinner" /></div> : (
            <div className="table-wrapper">
              <table>
                <thead>
                  <tr>
                    <th>Fecha</th>
                    <th>Tipo</th>
                    <th>Descripción</th>
                    <th>Monto</th>
                    <th>Usuario</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {history.map(item => (
                    <tr key={item.id}>
                      <td style={{fontSize:'0.85rem'}}>{formatDateTime(item.created_at)}</td>
                      <td>{getTypeBadge(item.type)}</td>
                      <td style={{fontWeight:500}}>{item.description}</td>
                      <td style={{color:item.amount > 0 ? 'var(--accent)' : 'inherit', fontWeight:item.amount > 0 ? 700 : 400}}>
                        {item.amount > 0 ? formatMoney(item.amount) : '—'}
                      </td>
                      <td style={{color:'var(--text-muted)', fontSize:'0.85rem'}}>{item.user?.name || 'Sistema'}</td>
                      <td>
                        <div style={{display:'flex', gap: 6}}>
                          {item.type === 'venta' && (
                            <button className="btn btn-warning btn-sm" style={{padding:'4px 8px'}} onClick={() => setCancelConfirmId(item.reference_id)} title="Cancelar Venta">
                              <svg style={{width:16,height:16}} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                            </button>
                          )}
                          <button className="btn btn-danger btn-sm" style={{padding:'4px 8px'}} onClick={() => setDeleteConfirmId(item.id)} title="Eliminar registro del historial">
                            <svg style={{width:16,height:16}} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {history.length === 0 && (
                    <tr>
                      <td colSpan={6} style={{textAlign:'center',padding:40,color:'var(--text-muted)'}}>
                        Sin registros en el historial
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
          {lastPage > 1 && (
            <div className="pagination">
              <button disabled={page <= 1} onClick={() => setPage(page - 1)}>← Anterior</button>
              <span>Página {page} de {lastPage}</span>
              <button disabled={page >= lastPage} onClick={() => setPage(page + 1)}>Siguiente →</button>
            </div>
          )}
        </div>

        {/* Modal Confirmar Eliminación Individual */}
        <Modal 
          isOpen={!!deleteConfirmId} 
          onClose={() => setDeleteConfirmId(null)} 
          title="Eliminar del Historial" 
          footer={
            <>
              <button className="btn btn-outline" onClick={() => setDeleteConfirmId(null)}>Cancelar</button>
              <button className="btn btn-danger" onClick={handleDelete}>Eliminar</button>
            </>
          }
        >
          <p>¿Estás segura de que deseas eliminar esta entrada del historial? Esto solo borrará el registro del historial, no afectará la venta o el crédito original.</p>
        </Modal>

        {/* Modal Confirmar Cancelación de Venta */}
        <Modal 
          isOpen={!!cancelConfirmId} 
          onClose={() => setCancelConfirmId(null)} 
          title="Cancelar Venta" 
          footer={
            <>
              <button className="btn btn-outline" onClick={() => setCancelConfirmId(null)}>Volver</button>
              <button className="btn btn-danger" onClick={handleCancelSale}>Confirmar Cancelación</button>
            </>
          }
        >
          <p>¿Estás segura de que deseas cancelar esta venta? Se revertirá el saldo de la clienta si fue a crédito.</p>
        </Modal>

        {/* Modal Confirmar Vaciar Historial */}
        <Modal 
          isOpen={showClearConfirm} 
          onClose={() => setShowClearConfirm(false)} 
          title="Vaciar Historial" 
          footer={
            <>
              <button className="btn btn-outline" onClick={() => setShowClearConfirm(false)}>Cancelar</button>
              <button className="btn btn-danger" onClick={handleClearHistory}>Vaciar Todo</button>
            </>
          }
        >
          <p>¿Estás segura de que deseas <strong>vaciar todo el historial</strong>? Esta acción no se puede deshacer y borrará todos los registros de actividad.</p>
        </Modal>
      </div>
    </>
  );
}
