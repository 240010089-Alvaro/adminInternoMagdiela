import { useState, useEffect } from 'react';
import Header from '../../components/layout/Header';
import Modal from '../../components/ui/Modal';
import api from '../../services/api';
import { formatMoney, formatDate } from '../../utils/formatters';
import toast from 'react-hot-toast';

export default function ClientList() {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [showDetail, setShowDetail] = useState(null);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ name:'',phone:'',email:'',address:'',notes:'' });
  const [saving, setSaving] = useState(false);
  const [detail, setDetail] = useState(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);

  const fetchClients = () => {
    setLoading(true);
    api.get('/clients', { params: { page, search } }).then(r => { setClients(r.data.data); setLastPage(r.data.last_page); }).finally(() => setLoading(false));
  };

  useEffect(() => { fetchClients(); }, [page, search]);

  const openNew = () => { setEditing(null); setForm({ name:'',phone:'',email:'',address:'',notes:'' }); setShowModal(true); };
  const openEdit = (c) => { setEditing(c); setForm({ name:c.name,phone:c.phone||'',email:c.email||'',address:c.address||'',notes:c.notes||'' }); setShowModal(true); };

  const handleSave = async (e) => {
    e.preventDefault(); setSaving(true);
    try {
      if (editing) {
        await api.put(`/clients/${editing.id}`, form);
        toast.success('Clienta actualizada');
      } else {
        await api.post('/clients', form);
        toast.success('Clienta registrada');
      }
      setShowModal(false); fetchClients();
    } catch(err) { toast.error(err.response?.data?.message || 'Error al guardar'); }
    finally { setSaving(false); }
  };

  const openDetail = async (id) => {
    const r = await api.get(`/clients/${id}`);
    setDetail(r.data); setShowDetail(true);
  };

  const confirmDelete = async () => {
    if (!deleteConfirmId) return;
    try {
      await api.delete(`/clients/${deleteConfirmId}`);
      toast.success('Clienta eliminada');
      setDeleteConfirmId(null);
      fetchClients();
    } catch(err) { toast.error('Error al eliminar clienta'); }
  };

  return (
    <>
      <Header title="Clientas" subtitle="Registro y seguimiento de clientas" />
      <div className="admin-content">
        <div className="toolbar">
          <div className="toolbar-left">
            <div className="search-bar">
              <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
              <input placeholder="Buscar clientas..." value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} />
            </div>
          </div>
          <div className="toolbar-right">
            <button className="btn btn-primary" onClick={openNew}>
              <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>
              Nueva Clienta
            </button>
          </div>
        </div>

        <div className="card">
          {loading ? <div className="loading"><div className="spinner" /></div> : (
            <div className="table-wrapper"><table><thead><tr><th>Nombre</th><th>Teléfono</th><th>Email</th><th>Compras</th><th>Deuda</th><th>Acciones</th></tr></thead><tbody>
              {clients.map(c => (
                <tr key={c.id}>
                  <td style={{fontWeight:600,cursor:'pointer',color:'var(--primary-light)'}} onClick={()=>openDetail(c.id)}>{c.name}</td>
                  <td>{c.phone || '—'}</td>
                  <td style={{color:'var(--text-muted)'}}>{c.email || '—'}</td>
                  <td>{formatMoney(c.total_purchases)}</td>
                  <td>{parseFloat(c.total_debt) > 0 ? <span className="badge badge-danger">{formatMoney(c.total_debt)}</span> : <span className="badge badge-success">Sin deuda</span>}</td>
                  <td>
                    <div style={{display:'flex',gap:6}}>
                      <button className="btn btn-outline btn-sm" onClick={()=>openDetail(c.id)}>Ver</button>
                      <button className="btn btn-outline btn-sm" onClick={()=>openEdit(c)}>Editar</button>
                      <button className="btn btn-danger btn-sm" onClick={()=>setDeleteConfirmId(c.id)}>✕</button>
                    </div>
                  </td>
                </tr>
              ))}
              {clients.length === 0 && <tr><td colSpan={6} style={{textAlign:'center',padding:40,color:'var(--text-muted)'}}>No se encontraron clientas</td></tr>}
            </tbody></table></div>
          )}
          {lastPage > 1 && <div className="pagination"><button disabled={page<=1} onClick={()=>setPage(page-1)}>← Anterior</button><span>Página {page} de {lastPage}</span><button disabled={page>=lastPage} onClick={()=>setPage(page+1)}>Siguiente →</button></div>}
        </div>

        <Modal isOpen={showModal} onClose={()=>setShowModal(false)} title={editing?'Editar Clienta':'Nueva Clienta'} footer={<><button className="btn btn-outline" onClick={()=>setShowModal(false)}>Cancelar</button><button className="btn btn-primary" onClick={handleSave} disabled={saving}>{saving?'Guardando...':'Guardar'}</button></>}>
          <form onSubmit={handleSave}>
            <div className="form-group"><label>Nombre completo</label><input className="form-input" value={form.name} onChange={e=>setForm({...form,name:e.target.value})} required /></div>
            <div className="form-row">
              <div className="form-group"><label>Teléfono</label><input className="form-input" value={form.phone} onChange={e=>setForm({...form,phone:e.target.value})} /></div>
              <div className="form-group"><label>Email</label><input type="email" className="form-input" value={form.email} onChange={e=>setForm({...form,email:e.target.value})} /></div>
            </div>
            <div className="form-group"><label>Dirección</label><input className="form-input" value={form.address} onChange={e=>setForm({...form,address:e.target.value})} /></div>
            <div className="form-group"><label>Notas personalizadas</label><textarea className="form-textarea" value={form.notes} onChange={e=>setForm({...form,notes:e.target.value})} placeholder="Preferencias, tallas, etc." /></div>
          </form>
        </Modal>

        <Modal isOpen={showDetail} onClose={()=>setShowDetail(false)} title={detail?.name || 'Detalle'} large>
          {detail && <>
            <div className="grid-2" style={{marginBottom:20}}>
              <div><strong style={{color:'var(--text-muted)',fontSize:'0.8rem'}}>TELÉFONO</strong><p>{detail.phone || '—'}</p></div>
              <div><strong style={{color:'var(--text-muted)',fontSize:'0.8rem'}}>EMAIL</strong><p>{detail.email || '—'}</p></div>
              <div><strong style={{color:'var(--text-muted)',fontSize:'0.8rem'}}>COMPRAS TOTALES</strong><p style={{color:'var(--accent)',fontWeight:700}}>{formatMoney(detail.total_purchases)}</p></div>
              <div><strong style={{color:'var(--text-muted)',fontSize:'0.8rem'}}>DEUDA ACTUAL</strong><p style={{color: parseFloat(detail.total_debt)>0?'var(--danger)':'var(--success)',fontWeight:700}}>{formatMoney(detail.total_debt)}</p></div>
            </div>
            {detail.notes && <div style={{background:'var(--bg-input)',padding:12,borderRadius:8,marginBottom:20}}><strong style={{fontSize:'0.8rem',color:'var(--text-muted)'}}>NOTAS</strong><p style={{fontSize:'0.9rem',marginTop:4}}>{detail.notes}</p></div>}
            <h4 style={{marginBottom:12}}>Historial de Compras</h4>
            {detail.sales?.length > 0 ? (
              <div className="table-wrapper"><table><thead><tr><th>Fecha</th><th>Total</th><th>Método</th><th>Estado</th></tr></thead><tbody>
                {detail.sales.map(s => <tr key={s.id}><td>{formatDate(s.created_at)}</td><td style={{fontWeight:600}}>{formatMoney(s.total)}</td><td><span className={`badge ${s.payment_method==='credito'?'badge-warning':'badge-success'}`}>{s.payment_method}</span></td><td><span className={`badge ${s.status==='completada'?'badge-success':'badge-danger'}`}>{s.status}</span></td></tr>)}
              </tbody></table></div>
            ) : <p style={{color:'var(--text-muted)'}}>Sin compras registradas</p>}
          </>}
        </Modal>

        <Modal isOpen={!!deleteConfirmId} onClose={() => setDeleteConfirmId(null)} title="Confirmar eliminación" footer={<><button className="btn btn-outline" onClick={() => setDeleteConfirmId(null)}>Cancelar</button><button className="btn btn-danger" onClick={confirmDelete}>Eliminar</button></>}>
          <p>¿Estás segura de que deseas eliminar esta clienta? Se conservará su historial de ventas, pero no podrás verla en esta lista.</p>
        </Modal>
      </div>
    </>
  );
}
