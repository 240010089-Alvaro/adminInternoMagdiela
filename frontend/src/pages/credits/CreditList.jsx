import { useState, useEffect } from 'react';
import Header from '../../components/layout/Header';
import Modal from '../../components/ui/Modal';
import api from '../../services/api';
import { formatMoney, formatDate, formatDateTime } from '../../utils/formatters';
import toast from 'react-hot-toast';

export default function CreditList() {
  const [credits, setCredits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [showPayment, setShowPayment] = useState(null);
  const [showDetail, setShowDetail] = useState(null);
  const [payAmount, setPayAmount] = useState('');
  const [payNotes, setPayNotes] = useState('');
  const [saving, setSaving] = useState(false);
  const [detail, setDetail] = useState(null);

  const fetchCredits = () => {
    setLoading(true);
    api.get('/credits', { params: { page, status: statusFilter, search: searchTerm || undefined } }).then(r => { setCredits(r.data.data); setLastPage(r.data.last_page); }).finally(() => setLoading(false));
  };

  useEffect(() => { fetchCredits(); }, [page, statusFilter, searchTerm]);

  const openPayment = (credit) => { setShowPayment(credit); setPayAmount(''); setPayNotes(''); };

  const handlePayment = async () => {
    if (!payAmount || parseFloat(payAmount) <= 0) return toast.error('Ingresa un monto válido');
    setSaving(true);
    try {
      await api.post(`/credits/${showPayment.id}/payment`, { amount: parseFloat(payAmount), notes: payNotes });
      setShowPayment(null); fetchCredits();
      toast.success('Abono registrado correctamente');
    } catch(err) { toast.error(err.response?.data?.message || 'Error al registrar el abono'); }
    finally { setSaving(false); }
  };

  const openDetail = async (id) => {
    const r = await api.get(`/credits/${id}`);
    setDetail(r.data); setShowDetail(true);
  };

  return (
    <>
      <Header title="Créditos y Abonos" subtitle="Control de deudas y pagos parciales" />
      <div className="admin-content">
        <div className="toolbar">
          <div className="toolbar-left">
            <div style={{position:'relative'}}>
              <span style={{position:'absolute',left:12,top:'50%',transform:'translateY(-50%)',color:'var(--text-muted)',fontSize:'0.9rem',pointerEvents:'none'}}>🔍</span>
              <input
                type="text"
                className="form-input"
                placeholder="Buscar clienta..."
                value={searchTerm}
                onChange={e => { setSearchTerm(e.target.value); setPage(1); }}
                style={{paddingLeft:36,minWidth:220,height:42}}
              />
              {searchTerm && (
                <button
                  onClick={() => { setSearchTerm(''); setPage(1); }}
                  style={{position:'absolute',right:8,top:'50%',transform:'translateY(-50%)',background:'none',border:'none',color:'var(--text-muted)',cursor:'pointer',fontSize:'1.1rem',padding:4}}
                  title="Limpiar búsqueda"
                >✕</button>
              )}
            </div>
            <select className="filter-select" value={statusFilter} onChange={e => { setStatusFilter(e.target.value); setPage(1); }}>
              <option value="">Todos los créditos</option>
              <option value="pendiente">Pendientes</option>
              <option value="liquidado">Liquidados</option>
            </select>
          </div>
        </div>

        <div className="card">
          {loading ? <div className="loading"><div className="spinner" /></div> : (
            <div className="table-wrapper"><table><thead><tr><th>#</th><th>Clienta</th><th>Total</th><th>Pagado</th><th>Saldo</th><th>Fecha</th><th>Estado</th><th>Acciones</th></tr></thead><tbody>
              {credits.map(c => (
                <tr key={c.id}>
                  <td style={{fontFamily:'monospace',color:'var(--text-muted)'}}>#{c.id}</td>
                  <td style={{fontWeight:600}}>{c.client?.name}</td>
                  <td>{formatMoney(c.total_amount)}</td>
                  <td style={{color:'var(--success)'}}>{formatMoney(c.paid_amount)}</td>
                  <td style={{fontWeight:700,color:parseFloat(c.balance)>0?'var(--danger)':'var(--success)'}}>{formatMoney(c.balance)}</td>
                  <td style={{color:'var(--text-muted)'}}>{formatDate(c.created_at)}</td>
                  <td><span className={`badge ${c.status==='pendiente'?'badge-warning':'badge-success'}`}>{c.status}</span></td>
                  <td>
                    <div style={{display:'flex',gap:6}}>
                      <button className="btn btn-outline btn-sm" onClick={()=>openDetail(c.id)}>Detalle</button>
                      {c.status==='pendiente' && <button className="btn btn-accent btn-sm" onClick={()=>openPayment(c)}>Abonar</button>}
                    </div>
                  </td>
                </tr>
              ))}
              {credits.length===0 && <tr><td colSpan={8} style={{textAlign:'center',padding:40,color:'var(--text-muted)'}}>Sin créditos registrados</td></tr>}
            </tbody></table></div>
          )}
          {lastPage > 1 && <div className="pagination"><button disabled={page<=1} onClick={()=>setPage(page-1)}>← Anterior</button><span>Página {page} de {lastPage}</span><button disabled={page>=lastPage} onClick={()=>setPage(page+1)}>Siguiente →</button></div>}
        </div>

        <Modal isOpen={!!showPayment} onClose={()=>setShowPayment(null)} title="Registrar Abono" footer={<><button className="btn btn-outline" onClick={()=>setShowPayment(null)}>Cancelar</button><button className="btn btn-accent" onClick={handlePayment} disabled={saving}>{saving?'Procesando...':'Registrar Abono'}</button></>}>
          {showPayment && <>
            <div style={{background:'var(--bg-input)',padding:14,borderRadius:8,marginBottom:20}}>
              <div style={{display:'flex',justifyContent:'space-between',marginBottom:6}}><span style={{color:'var(--text-muted)'}}>Clienta:</span><span style={{fontWeight:600}}>{showPayment.client?.name}</span></div>
              <div style={{display:'flex',justifyContent:'space-between',marginBottom:6}}><span style={{color:'var(--text-muted)'}}>Total crédito:</span><span>{formatMoney(showPayment.total_amount)}</span></div>
              <div style={{display:'flex',justifyContent:'space-between',marginBottom:6}}><span style={{color:'var(--text-muted)'}}>Pagado:</span><span style={{color:'var(--success)'}}>{formatMoney(showPayment.paid_amount)}</span></div>
              <div style={{display:'flex',justifyContent:'space-between'}}><span style={{fontWeight:700}}>Saldo pendiente:</span><span style={{fontWeight:700,color:'var(--danger)'}}>{formatMoney(showPayment.balance)}</span></div>
            </div>
            <div className="form-group"><label>Monto del abono</label><input type="number" step="0.01" max={showPayment.balance} className="form-input" value={payAmount} onChange={e=>setPayAmount(e.target.value)} placeholder="0.00" /></div>
            <div className="form-group"><label>Notas (opcional)</label><textarea className="form-textarea" value={payNotes} onChange={e=>setPayNotes(e.target.value)} placeholder="Observaciones del pago" /></div>
          </>}
        </Modal>

        <Modal isOpen={showDetail} onClose={()=>setShowDetail(false)} title={`Crédito #${detail?.id}`} large>
          {detail && <>
            <div className="grid-2" style={{marginBottom:20}}>
              <div><strong style={{color:'var(--text-muted)',fontSize:'0.8rem'}}>CLIENTA</strong><p style={{fontWeight:600}}>{detail.client?.name}</p></div>
              <div><strong style={{color:'var(--text-muted)',fontSize:'0.8rem'}}>ESTADO</strong><p><span className={`badge ${detail.status==='pendiente'?'badge-warning':'badge-success'}`}>{detail.status}</span></p></div>
              <div><strong style={{color:'var(--text-muted)',fontSize:'0.8rem'}}>TOTAL</strong><p>{formatMoney(detail.total_amount)}</p></div>
              <div><strong style={{color:'var(--text-muted)',fontSize:'0.8rem'}}>SALDO</strong><p style={{color:'var(--danger)',fontWeight:700}}>{formatMoney(detail.balance)}</p></div>
            </div>
            <h4 style={{marginBottom:12}}>Historial de Abonos</h4>
            {detail.payments?.length > 0 ? (
              <div className="table-wrapper"><table><thead><tr><th>Fecha</th><th>Monto</th><th>Notas</th></tr></thead><tbody>
                {detail.payments.map(p => <tr key={p.id}><td>{formatDateTime(p.created_at)}</td><td style={{color:'var(--success)',fontWeight:600}}>{formatMoney(p.amount)}</td><td style={{color:'var(--text-muted)'}}>{p.notes||'—'}</td></tr>)}
              </tbody></table></div>
            ) : <p style={{color:'var(--text-muted)'}}>Sin abonos registrados</p>}
            <div style={{marginTop:16,padding:12,background:'var(--bg-input)',borderRadius:8}}>
              <div style={{display:'flex',justifyContent:'space-between'}}><span>Progreso de pago:</span><span style={{fontWeight:700}}>{((parseFloat(detail.paid_amount)/parseFloat(detail.total_amount))*100).toFixed(0)}%</span></div>
              <div style={{width:'100%',height:8,background:'var(--border)',borderRadius:4,marginTop:8,overflow:'hidden'}}><div style={{width:`${(parseFloat(detail.paid_amount)/parseFloat(detail.total_amount))*100}%`,height:'100%',background:'linear-gradient(90deg, var(--primary), var(--success))',borderRadius:4,transition:'width 0.3s ease'}} /></div>
            </div>
          </>}
        </Modal>
      </div>
    </>
  );
}
