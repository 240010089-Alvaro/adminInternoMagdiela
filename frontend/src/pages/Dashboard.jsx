import { useState, useEffect } from 'react';
import Header from '../components/layout/Header';
import Modal from '../components/ui/Modal';
import api from '../services/api';
import { formatMoney, formatNumber } from '../utils/formatters';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showDebtorsModal, setShowDebtorsModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    api.get('/dashboard').then(r => setData(r.data)).catch(console.error).finally(() => setLoading(false));
  }, []);

  if (loading) return <><Header title="Dashboard" subtitle="Cargando..." /><div className="admin-content"><div className="loading"><div className="spinner" /></div></div></>;
  if (!data) return <><Header title="Dashboard" /><div className="admin-content"><p>Error al cargar datos</p></div></>;

  return (
    <>
      <Header title="Resumen" subtitle="Vista general del desempeño de tu negocio" />
      <div className="admin-content animate-fade-in">
        <div className="grid-4" style={{marginBottom:32}}>
          <div className="stat-card" style={{background: 'linear-gradient(135deg, var(--bg-card), #2d243a)'}}>
            <div className="stat-icon purple" style={{boxShadow: '0 8px 16px rgba(139,94,131,0.2)'}}>
              <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            </div>
            <div className="stat-info">
              <div className="stat-label">Ventas Hoy</div>
              <div className="stat-value">{formatMoney(data.today_sales)}</div>
              <div className="stat-sub">{data.today_sales_count} registros hoy</div>
            </div>
          </div>

          <div className="stat-card" style={{background: 'linear-gradient(135deg, var(--bg-card), #233a2d)'}}>
            <div className="stat-icon green" style={{boxShadow: '0 8px 16px rgba(110,203,139,0.2)'}}>
              <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
            </div>
            <div className="stat-info">
              <div className="stat-label">Ingresos Mes</div>
              <div className="stat-value" style={{color:'var(--success)'}}>{formatMoney(data.monthly_revenue)}</div>
              <div className="stat-sub">Total acumulado</div>
            </div>
          </div>

          <div className="stat-card" style={{background: 'linear-gradient(135deg, var(--bg-card), #3a3224)'}}>
            <div className="stat-icon gold" style={{boxShadow: '0 8px 16px rgba(240,199,94,0.2)'}}>
              <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
            </div>
            <div className="stat-info">
              <div className="stat-label">Total Clientas</div>
              <div className="stat-value">{formatNumber(data.total_clients)}</div>
              <div className="stat-sub">En tu catálogo</div>
            </div>
          </div>

          <div 
            className="stat-card" 
            onClick={() => setShowDebtorsModal(true)} 
            style={{cursor: 'pointer', background: 'linear-gradient(135deg, var(--bg-card), #3a242a)', transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'}} 
            onMouseOver={e => {e.currentTarget.style.transform='translateY(-6px)'; e.currentTarget.style.boxShadow='0 12px 30px rgba(232,93,111,0.2)'}} 
            onMouseOut={e => {e.currentTarget.style.transform='none'; e.currentTarget.style.boxShadow='none'}}
          >
            <div className="stat-icon red" style={{boxShadow: '0 8px 16px rgba(232,93,111,0.2)'}}>
              <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>
            </div>
            <div className="stat-info">
              <div className="stat-label">Cuentas por Cobrar</div>
              <div className="stat-value" style={{color:'var(--danger)'}}>{formatMoney(data.total_debt)}</div>
              <div className="stat-sub">{data.clients_with_debt_count || 0} clientas deben (Ver)</div>
            </div>
          </div>
        </div>

        <div className="grid-2" style={{marginBottom:24, alignItems: 'start'}}>
          <div className="card" style={{padding: '24px 24px 12px 24px'}}>
            <div className="card-header">
              <div className="card-title" style={{display:'flex', alignItems:'center', gap:8}}>
                <div style={{width:10, height:10, borderRadius:'50%', background:'var(--primary)'}}></div>
                Tendencia de Ventas (7 días)
              </div>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={data.sales_last_7_days} margin={{top: 10, right: 10, left: -20, bottom: 0}}>
                <defs>
                  <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="var(--primary)" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
                <XAxis dataKey="day" stroke="var(--text-dim)" fontSize={11} tickLine={false} axisLine={false} tick={{fill: 'var(--text-muted)'}} dy={10} />
                <YAxis stroke="var(--text-dim)" fontSize={11} tickLine={false} axisLine={false} tickFormatter={v => `$${v}`} tick={{fill: 'var(--text-muted)'}} />
                <Tooltip 
                  formatter={(v) => [formatMoney(v), 'Ventas']} 
                  contentStyle={{background:'var(--bg-card)',border:'1px solid var(--border)',borderRadius:12,boxShadow:'var(--shadow)'}}
                  itemStyle={{color: 'var(--text)', fontWeight: 600}}
                />
                <Area type="monotone" dataKey="total" stroke="var(--primary)" strokeWidth={3} fillOpacity={1} fill="url(#colorTotal)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="card">
            <div className="card-header">
              <span className="card-title">🚨 Mayores Adeudos</span>
            </div>
            {data.debtors?.length > 0 ? (
              <div className="table-wrapper">
                <table>
                  <thead><tr><th>Clienta</th><th>Deuda Actual</th></tr></thead>
                  <tbody>
                    {data.debtors.slice(0, 5).map((c,i) => (
                      <tr key={i}>
                        <td style={{fontWeight:600}}>{c.name}</td>
                        <td style={{color:'var(--danger)', fontWeight:700}}>{formatMoney(c.total_debt)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : <div className="empty-state" style={{padding: '40px 0'}}><p>Sin deudas registradas 🎉</p></div>}
            <button className="btn btn-outline btn-sm" style={{width:'100%', marginTop: 16}} onClick={() => navigate('/creditos')}>Ver todos los créditos</button>
          </div>
        </div>

        <Modal isOpen={showDebtorsModal} onClose={() => setShowDebtorsModal(false)} title="Clientas con adeudos" large>
          {data.debtors?.length > 0 ? (
            <div className="table-wrapper">
              <table>
                <thead><tr><th>Clienta</th><th>Deuda Pendiente</th><th></th></tr></thead>
                <tbody>
                  {data.debtors.map((c,i) => (
                    <tr key={i}>
                      <td style={{fontWeight:600}}>{c.name}</td>
                      <td style={{color:'var(--danger)', fontWeight:700}}>{formatMoney(c.total_debt)}</td>
                      <td style={{textAlign: 'right'}}>
                        <button className="btn btn-sm btn-outline" onClick={() => navigate('/creditos')}>Ir a Cobrar</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : <div className="empty-state"><p>Ninguna clienta debe dinero 🎉</p></div>}
        </Modal>
      </div>
    </>
  );
}
