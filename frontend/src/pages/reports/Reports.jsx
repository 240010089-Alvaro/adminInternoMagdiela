import { useState } from 'react';
import Header from '../../components/layout/Header';
import api from '../../services/api';
import { formatMoney } from '../../utils/formatters';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const COLORS = ['#8B5E83','#D4A574','#6ECB8B','#6BA3E8','#F0C75E','#E85D6F','#B98EB2','#9B8FA3'];

export default function Reports() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [period, setPeriod] = useState('month');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');

  const fetchReport = async () => {
    setLoading(true);
    try {
      const params = { period };
      if (period === 'custom') { params.date_from = dateFrom; params.date_to = dateTo; }
      const r = await api.get('/reports', { params });
      setData(r.data);
    } catch(e) { console.error(e); }
    finally { setLoading(false); }
  };

  const exportPDF = async () => {
    try {
      const params = { period };
      if (period === 'custom') { params.date_from = dateFrom; params.date_to = dateTo; }
      
      const response = await api.get('/reports/export-pdf', { 
        params, 
        responseType: 'blob' 
      });
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `reporte_magdiela_${period}.pdf`);
      document.body.appendChild(link);
      link.click();
    } catch(e) { 
      console.error(e); 
      alert('Error al generar el PDF');
    }
  };

  return (
    <>
      <Header title="Reportes" subtitle="Análisis financiero de tu boutique" />
      <div className="admin-content">
        <div className="toolbar">
          <div className="toolbar-left" style={{gap:12}}>
            <select className="filter-select" value={period} onChange={e => setPeriod(e.target.value)}>
              <option value="day">Hoy</option>
              <option value="week">Esta semana</option>
              <option value="month">Este mes</option>
              <option value="custom">Personalizado</option>
            </select>
            {period === 'custom' && <>
              <input type="date" className="form-input" style={{width:'auto'}} value={dateFrom} onChange={e=>setDateFrom(e.target.value)} />
              <input type="date" className="form-input" style={{width:'auto'}} value={dateTo} onChange={e=>setDateTo(e.target.value)} />
            </>}
            <button className="btn btn-primary" onClick={fetchReport} disabled={loading}>{loading ? 'Cargando...' : 'Generar Reporte'}</button>
          </div>
          <div className="toolbar-right">
            {data && <button className="btn btn-outline" onClick={exportPDF}>📄 Descargar PDF</button>}
          </div>
        </div>

        {!data && !loading && <div className="card"><div className="empty-state"><p>Selecciona un periodo y presiona "Generar Reporte"</p></div></div>}
        {loading && <div className="loading"><div className="spinner" /></div>}

        {data && <>
          <div className="grid-4" style={{marginBottom:24}}>
            <div className="stat-card"><div className="stat-icon purple"><svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8V7m0 10v1" /></svg></div><div className="stat-info"><div className="stat-label">Ingresos Totales</div><div className="stat-value">{formatMoney(data.total_revenue)}</div><div className="stat-sub">{data.total_sales} ventas</div></div></div>
            <div className="stat-card"><div className="stat-icon green"><svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg></div><div className="stat-info"><div className="stat-label">Ganancia Neta</div><div className="stat-value" style={{color:'var(--success)'}}>{formatMoney(data.profit)}</div><div className="stat-sub">Costo: {formatMoney(data.total_cost)}</div></div></div>
            <div className="stat-card"><div className="stat-icon gold"><svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg></div><div className="stat-info"><div className="stat-label">Total Ventas</div><div className="stat-value">{data.total_sales}</div><div className="stat-sub">{data.period.from} — {data.period.to}</div></div></div>
            <div className="stat-card"><div className="stat-icon red"><svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg></div><div className="stat-info"><div className="stat-label">Deudas Activas</div><div className="stat-value" style={{color:'var(--danger)'}}>{formatMoney(data.total_debt)}</div><div className="stat-sub">{data.active_debts?.length || 0} créditos</div></div></div>
          </div>

          <div className="grid-2" style={{marginBottom:24}}>
            <div className="card">
              <div className="card-header"><span className="card-title">Ventas por Categoría</span></div>
              {data.sales_by_category?.length > 0 ? (
                <ResponsiveContainer width="100%" height={280}>
                  <PieChart><Pie data={data.sales_by_category} dataKey="total" nameKey="name" cx="50%" cy="50%" outerRadius={95} label={({name,percent})=>`${name} ${(percent*100).toFixed(0)}%`} labelLine={false} fontSize={11}>{data.sales_by_category.map((_,i)=><Cell key={i} fill={COLORS[i%COLORS.length]} />)}</Pie><Tooltip formatter={v=>formatMoney(v)} contentStyle={{background:'#231D2E',border:'1px solid #3A3248',borderRadius:8,color:'#F5F0F7'}} /></PieChart>
                </ResponsiveContainer>
              ) : <div className="empty-state"><p>Sin datos</p></div>}
            </div>
            <div className="card">
              <div className="card-header"><span className="card-title">Ventas por Categoría (Detalle)</span></div>
              {data.sales_by_category?.length > 0 ? (
                <div className="table-wrapper"><table><thead><tr><th>Categoría</th><th>Unidades</th><th>Ingresos</th></tr></thead><tbody>
                  {data.sales_by_category.map((c,i) => <tr key={i}><td><span style={{display:'inline-block',width:10,height:10,borderRadius:'50%',background:COLORS[i%COLORS.length],marginRight:8}} />{c.name}</td><td>{c.qty}</td><td style={{color:'var(--accent)',fontWeight:600}}>{formatMoney(c.total)}</td></tr>)}
                </tbody></table></div>
              ) : <div className="empty-state"><p>Sin datos</p></div>}
            </div>
          </div>

          {data.credits_issued?.length > 0 && <div className="card" style={{marginBottom:24}}>
            <div className="card-header"><span className="card-title">Créditos Otorgados en el Periodo (Fiados)</span></div>
            <div className="table-wrapper"><table><thead><tr><th>Clienta</th><th>Total Crédito</th><th>Abonado</th><th>Saldo Pendiente</th><th>Fecha</th></tr></thead><tbody>
              {data.credits_issued.map(c => <tr key={c.id}><td style={{fontWeight:600}}>{c.client?.name}</td><td>{formatMoney(c.total_amount)}</td><td style={{color:'var(--success)'}}>{formatMoney(c.paid_amount)}</td><td style={{color:'var(--danger)',fontWeight:700}}>{formatMoney(c.balance)}</td><td style={{color:'var(--text-muted)'}}>{new Date(c.created_at).toLocaleDateString()}</td></tr>)}
            </tbody></table></div>
          </div>}

          {data.active_debts?.length > 0 && <div className="card">
            <div className="card-header"><span className="card-title">Todas las Deudas Pendientes (Saldo General)</span></div>
            <div className="table-wrapper"><table><thead><tr><th>Clienta</th><th>Total</th><th>Pagado</th><th>Saldo</th><th>Vence</th></tr></thead><tbody>
              {data.active_debts.map(d => <tr key={d.id}><td style={{fontWeight:600}}>{d.client?.name}</td><td>{formatMoney(d.total_amount)}</td><td style={{color:'var(--success)'}}>{formatMoney(d.paid_amount)}</td><td style={{color:'var(--danger)',fontWeight:700}}>{formatMoney(d.balance)}</td><td style={{color:'var(--text-muted)'}}>{d.due_date || '—'}</td></tr>)}
            </tbody></table></div>
          </div>}
        </>}
      </div>
    </>
  );
}
